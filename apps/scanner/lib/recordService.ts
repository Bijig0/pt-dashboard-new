import { supabase } from './supabase';
import {
  RecordRow,
  PushLogEntry,
  recordRowToDatabase,
} from '@pt-dashboard/shared';

// Generate UUID for batch operations
function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export interface PushResult {
  success: boolean;
  batchId: string;
  insertedIds: number[];
  error?: string;
}

export interface UndoResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

/**
 * Push records to database with audit logging
 */
export async function pushRecords(
  records: RecordRow[],
  userId?: string,
  year?: number
): Promise<PushResult> {
  const batchId = generateUUID();

  try {
    // Convert RecordRow to database format
    const dbRecords = records.map((r) => recordRowToDatabase(r, year));

    // Insert records
    const { data: inserted, error: insertError } = await supabase
      .from('record')
      .insert(dbRecords)
      .select('id');

    if (insertError) {
      throw new Error(`Failed to insert records: ${insertError.message}`);
    }

    const insertedIds = inserted?.map((r) => r.id) ?? [];

    // Create audit log entry
    const { error: logError } = await supabase.from('record_push_log').insert({
      batch_id: batchId,
      user_id: userId ?? null,
      action_type: 'push',
      record_ids: insertedIds,
      records_data: records, // Store original format for display
      records_count: records.length,
      description: `Pushed ${records.length} records from scanner`,
    });

    if (logError) {
      console.error('Failed to create audit log:', logError);
      // Don't fail the operation, just log the error
    }

    console.log(`Pushed ${insertedIds.length} records with batch ${batchId}`);

    return {
      success: true,
      batchId,
      insertedIds,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Push failed:', message);
    return {
      success: false,
      batchId,
      insertedIds: [],
      error: message,
    };
  }
}

/**
 * Undo a push operation by deleting records
 */
export async function undoPush(batchId: string): Promise<UndoResult> {
  try {
    // Get the push log entry
    const { data: logEntry, error: fetchError } = await supabase
      .from('record_push_log')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (fetchError || !logEntry) {
      throw new Error(`Push log not found: ${fetchError?.message ?? 'Not found'}`);
    }

    if (logEntry.rolled_back_at) {
      throw new Error('This push has already been undone');
    }

    const recordIds = logEntry.record_ids as number[];

    // Delete the records
    const { error: deleteError } = await supabase
      .from('record')
      .delete()
      .in('id', recordIds);

    if (deleteError) {
      throw new Error(`Failed to delete records: ${deleteError.message}`);
    }

    // Mark the push as rolled back
    const { error: updateError } = await supabase
      .from('record_push_log')
      .update({ rolled_back_at: new Date().toISOString() })
      .eq('batch_id', batchId);

    if (updateError) {
      console.error('Failed to update push log:', updateError);
    }

    // Create a delete audit entry
    const deleteBatchId = generateUUID();
    await supabase.from('record_push_log').insert({
      batch_id: deleteBatchId,
      user_id: logEntry.user_id,
      action_type: 'delete',
      record_ids: recordIds,
      records_data: logEntry.records_data,
      records_count: recordIds.length,
      description: `Undid push of ${recordIds.length} records`,
      rolled_back_by_batch_id: batchId,
    });

    console.log(`Undid push ${batchId}, deleted ${recordIds.length} records`);

    return {
      success: true,
      deletedCount: recordIds.length,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('Undo failed:', message);
    return {
      success: false,
      deletedCount: 0,
      error: message,
    };
  }
}

/**
 * Get push history for the current user
 */
export async function getPushHistory(
  limit = 20
): Promise<{ logs: PushLogEntry[]; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('record_push_log')
      .select('*')
      .eq('action_type', 'push')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw new Error(`Failed to fetch history: ${error.message}`);
    }

    return {
      logs: (data ?? []) as PushLogEntry[],
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      logs: [],
      error: message,
    };
  }
}

/**
 * Get a specific push log entry
 */
export async function getPushLogByBatchId(
  batchId: string
): Promise<{ log: PushLogEntry | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('record_push_log')
      .select('*')
      .eq('batch_id', batchId)
      .single();

    if (error) {
      throw new Error(`Failed to fetch log: ${error.message}`);
    }

    return {
      log: data as PushLogEntry,
    };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return {
      log: null,
      error: message,
    };
  }
}
