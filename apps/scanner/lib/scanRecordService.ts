import { supabase, isMockMode } from './supabase';
import * as Crypto from 'expo-crypto';
import { RecordRow } from '@pt-dashboard/shared';
import { TableData } from '../types/table';

export type ScanStatus = 'draft' | 'completed' | 'failed';

export interface ScanRecord {
  id: string;
  userId: string;
  name: string | null;
  imageUri: string | null;
  imageBase64: string | null;
  tableData: TableData | null;
  records: RecordRow[];
  rowCount: number;
  columnCount: number;
  confidence: number;
  status: ScanStatus;
  errorMessage: string | null;
  processingTimeMs: number | null;
  ocrModel: string;
  createdAt: Date;
  updatedAt: Date;
  uploadedAt: Date | null;
}

export interface CreateScanRecordInput {
  name?: string;
  imageUri?: string;
  imageBase64?: string;
  tableData?: TableData;
  records?: RecordRow[];
  rowCount?: number;
  columnCount?: number;
  confidence?: number;
  status?: ScanStatus;
  processingTimeMs?: number;
}

export interface UpdateScanRecordInput {
  name?: string;
  tableData?: TableData;
  records?: RecordRow[];
  rowCount?: number;
  columnCount?: number;
  confidence?: number;
  status?: ScanStatus;
  errorMessage?: string;
  uploadedAt?: Date;
}

/**
 * Convert database row to ScanRecord
 */
function fromDatabaseRow(row: any): ScanRecord {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    imageUri: row.image_uri,
    imageBase64: row.image_base64,
    tableData: row.table_data,
    records: row.records || [],
    rowCount: row.row_count,
    columnCount: row.column_count,
    confidence: row.confidence,
    status: row.status,
    errorMessage: row.error_message,
    processingTimeMs: row.processing_time_ms,
    ocrModel: row.ocr_model,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    uploadedAt: row.uploaded_at ? new Date(row.uploaded_at) : null,
  };
}

/**
 * Convert ScanRecord to database row
 */
function toDatabaseRow(record: Partial<ScanRecord>): Record<string, unknown> {
  const row: Record<string, unknown> = {};

  if (record.name !== undefined) row.name = record.name;
  if (record.imageUri !== undefined) row.image_uri = record.imageUri;
  if (record.imageBase64 !== undefined) row.image_base64 = record.imageBase64;
  if (record.tableData !== undefined) row.table_data = record.tableData;
  if (record.records !== undefined) row.records = record.records;
  if (record.rowCount !== undefined) row.row_count = record.rowCount;
  if (record.columnCount !== undefined) row.column_count = record.columnCount;
  if (record.confidence !== undefined) row.confidence = record.confidence;
  if (record.status !== undefined) row.status = record.status;
  if (record.errorMessage !== undefined) row.error_message = record.errorMessage;
  if (record.processingTimeMs !== undefined) row.processing_time_ms = record.processingTimeMs;
  if (record.uploadedAt !== undefined) row.uploaded_at = record.uploadedAt?.toISOString();

  return row;
}

// Mock storage for demo mode
let mockRecords: ScanRecord[] = [];

/**
 * Create a new scan record (draft)
 */
export async function createScanRecord(
  userId: string,
  input: CreateScanRecordInput
): Promise<ScanRecord> {
  const now = new Date();
  const id = Crypto.randomUUID();

  const record: ScanRecord = {
    id,
    userId,
    name: input.name || null,
    imageUri: input.imageUri || null,
    imageBase64: input.imageBase64 || null,
    tableData: input.tableData || null,
    records: input.records || [],
    rowCount: input.rowCount || 0,
    columnCount: input.columnCount || 0,
    confidence: input.confidence || 0,
    status: input.status || 'draft',
    errorMessage: null,
    processingTimeMs: input.processingTimeMs || null,
    ocrModel: 'claude',
    createdAt: now,
    updatedAt: now,
    uploadedAt: null,
  };

  if (isMockMode) {
    mockRecords.unshift(record);
    return record;
  }

  const { data, error } = await supabase
    .from('scan_records')
    .insert({
      id,
      user_id: userId,
      ...toDatabaseRow(record),
    })
    .select()
    .single();

  if (error) throw error;
  return fromDatabaseRow(data);
}

/**
 * Update an existing scan record
 */
export async function updateScanRecord(
  id: string,
  input: UpdateScanRecordInput
): Promise<ScanRecord> {
  if (isMockMode) {
    const index = mockRecords.findIndex((r) => r.id === id);
    if (index === -1) throw new Error('Record not found');

    mockRecords[index] = {
      ...mockRecords[index],
      ...input,
      updatedAt: new Date(),
    };
    return mockRecords[index];
  }

  const { data, error } = await supabase
    .from('scan_records')
    .update(toDatabaseRow(input as Partial<ScanRecord>))
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return fromDatabaseRow(data);
}

/**
 * Get a single scan record by ID
 */
export async function getScanRecord(id: string): Promise<ScanRecord | null> {
  if (isMockMode) {
    return mockRecords.find((r) => r.id === id) || null;
  }

  const { data, error } = await supabase
    .from('scan_records')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    if (error.code === 'PGRST116') return null; // Not found
    throw error;
  }
  return fromDatabaseRow(data);
}

/**
 * Get all scan records for a user
 */
export async function getScanRecords(
  userId: string,
  options?: {
    status?: ScanStatus;
    limit?: number;
    offset?: number;
    search?: string;
  }
): Promise<ScanRecord[]> {
  if (isMockMode) {
    let filtered = mockRecords.filter((r) => r.userId === userId);

    if (options?.status) {
      filtered = filtered.filter((r) => r.status === options.status);
    }

    if (options?.search) {
      const searchLower = options.search.toLowerCase();
      filtered = filtered.filter(
        (r) =>
          r.name?.toLowerCase().includes(searchLower) ||
          r.records.some(
            (rec) =>
              rec.companyName.toLowerCase().includes(searchLower) ||
              rec.alatName.toLowerCase().includes(searchLower)
          )
      );
    }

    const start = options?.offset || 0;
    const end = options?.limit ? start + options.limit : undefined;
    return filtered.slice(start, end);
  }

  let query = supabase
    .from('scan_records')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (options?.status) {
    query = query.eq('status', options.status);
  }

  if (options?.search) {
    query = query.or(`name.ilike.%${options.search}%,records.cs.{"companyName":"${options.search}"}`);
  }

  if (options?.limit) {
    query = query.limit(options.limit);
  }

  if (options?.offset) {
    query = query.range(options.offset, options.offset + (options.limit || 20) - 1);
  }

  const { data, error } = await query;

  if (error) throw error;
  return (data || []).map(fromDatabaseRow);
}

/**
 * Get drafts for a user
 */
export async function getDrafts(userId: string): Promise<ScanRecord[]> {
  return getScanRecords(userId, { status: 'draft' });
}

/**
 * Get completed records for a user
 */
export async function getCompletedRecords(userId: string): Promise<ScanRecord[]> {
  return getScanRecords(userId, { status: 'completed' });
}

/**
 * Delete a scan record
 */
export async function deleteScanRecord(id: string): Promise<void> {
  if (isMockMode) {
    mockRecords = mockRecords.filter((r) => r.id !== id);
    return;
  }

  const { error } = await supabase.from('scan_records').delete().eq('id', id);

  if (error) throw error;
}

/**
 * Mark a draft as completed (after successful upload)
 */
export async function markAsCompleted(id: string): Promise<ScanRecord> {
  return updateScanRecord(id, {
    status: 'completed',
    uploadedAt: new Date(),
  });
}

/**
 * Mark a draft as failed (after failed upload)
 */
export async function markAsFailed(id: string, errorMessage: string): Promise<ScanRecord> {
  return updateScanRecord(id, {
    status: 'failed',
    errorMessage,
  });
}

/**
 * Clear all mock records (for testing)
 */
export function clearMockRecords(): void {
  mockRecords = [];
}
