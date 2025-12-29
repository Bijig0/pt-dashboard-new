import { useEffect, useState, useCallback } from "react";
import { supabase } from "../supabase";
import { RealtimeChannel } from "@supabase/supabase-js";
import { RecordRow } from "@pt-dashboard/shared";

/**
 * Information about a push notification received from the scanner
 */
export interface PushNotification {
  batchId: string;
  recordsData: RecordRow[];
  recordsCount: number;
  createdAt: string;
  affectedAlats: string[];
  affectedMonths: Date[];
}

/**
 * Payload structure from Supabase Realtime for record_push_log inserts
 */
interface RecordPushLogPayload {
  batch_id: string;
  records_data: RecordRow[];
  records_count: number;
  created_at: string;
  action_type: string;
}

/**
 * Extract unique months from records data
 * Records use "DD/MM" format, we infer the year from context
 */
function extractMonthsFromRecords(records: RecordRow[], referenceYear?: number): Date[] {
  const year = referenceYear ?? new Date().getFullYear();
  const monthSet = new Set<string>();
  const months: Date[] = [];

  for (const record of records) {
    if (!record.date) continue;
    const parts = record.date.split("/");
    if (parts.length !== 2) continue;

    const month = parseInt(parts[1] ?? "0", 10);
    if (month < 1 || month > 12) continue;

    const monthKey = `${year}-${month}`;
    if (!monthSet.has(monthKey)) {
      monthSet.add(monthKey);
      // Create date as first day of month for comparison
      months.push(new Date(year, month - 1, 1));
    }
  }

  return months;
}

/**
 * Extract unique alat names from records data
 */
function extractAlatNames(records: RecordRow[]): string[] {
  const alatSet = new Set<string>();
  for (const record of records) {
    if (record.alatName) {
      alatSet.add(record.alatName);
    }
  }
  return Array.from(alatSet);
}

/**
 * Hook to subscribe to scanner push notifications via Supabase Realtime
 *
 * Listens for INSERT events on the record_push_log table where action_type='push'
 * and provides the latest push notification along with extracted metadata.
 *
 * @returns Object containing the latest push notification and a function to clear it
 */
export function useRecordPushSubscription() {
  const [latestPush, setLatestPush] = useState<PushNotification | null>(null);

  useEffect(() => {
    const channel: RealtimeChannel = supabase
      .channel("record_push_log_changes")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "record_push_log",
          filter: "action_type=eq.push",
        },
        (payload) => {
          const newRecord = payload.new as RecordPushLogPayload;

          // Extract affected alat names and months from records_data
          const affectedAlats = extractAlatNames(newRecord.records_data);
          const affectedMonths = extractMonthsFromRecords(newRecord.records_data);

          setLatestPush({
            batchId: newRecord.batch_id,
            recordsData: newRecord.records_data,
            recordsCount: newRecord.records_count,
            createdAt: newRecord.created_at,
            affectedAlats,
            affectedMonths,
          });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const clearNotification = useCallback(() => {
    setLatestPush(null);
  }, []);

  return { latestPush, clearNotification };
}

/**
 * Check if a push notification affects a specific worksheet
 *
 * @param push The push notification to check
 * @param alatName The alat name of the current worksheet
 * @param selectedDate The selected date (end of month) of the current worksheet
 * @returns true if the push affects the specified worksheet
 */
export function doesPushAffectWorksheet(
  push: PushNotification,
  alatName: string,
  selectedDate: Date
): boolean {
  // Check if any of the affected alats match
  const alatMatches = push.affectedAlats.includes(alatName);
  if (!alatMatches) return false;

  // Check if any of the affected months match
  const selectedMonth = selectedDate.getMonth();
  const selectedYear = selectedDate.getFullYear();

  const monthMatches = push.affectedMonths.some(
    (month) =>
      month.getMonth() === selectedMonth && month.getFullYear() === selectedYear
  );

  return monthMatches;
}
