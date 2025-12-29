import { useEffect, useRef, useCallback, useState } from 'react';
import { useSettingsStore, useHistoryStore, useAuthStore } from '../store';
import { RecordRow } from '@pt-dashboard/shared';
import { TableData } from '../types/table';
import { ScanRecord } from '../lib/scanRecordService';

interface UseAutoSaveOptions {
  records: RecordRow[];
  tableData: TableData | null;
  imageUri?: string | null;
  enabled?: boolean;
}

interface UseAutoSaveReturn {
  draftId: string | null;
  isSaving: boolean;
  lastSaved: Date | null;
  error: string | null;
  saveDraft: () => Promise<void>;
}

export function useAutoSave({
  records,
  tableData,
  imageUri,
  enabled = true,
}: UseAutoSaveOptions): UseAutoSaveReturn {
  const { autoSaveEnabled, autoSaveIntervalMs } = useSettingsStore();
  const { createDraft, updateRecord } = useHistoryStore();
  const { user } = useAuthStore();

  const [draftId, setDraftId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Track previous values to detect changes
  const prevRecordsRef = useRef<string>('');
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pendingSaveRef = useRef(false);

  const isAutoSaveActive = enabled && autoSaveEnabled && !!user;

  const saveDraft = useCallback(async () => {
    if (!tableData || records.length === 0 || !user) {
      return;
    }

    // Prevent concurrent saves
    if (isSaving) {
      pendingSaveRef.current = true;
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const draftData = {
        name: `Scan ${new Date().toLocaleDateString()}`,
        imageUri: imageUri || undefined,
        tableData,
        records,
        rowCount: records.length,
        columnCount: tableData.columns,
        confidence: 0.9, // Default confidence
        status: 'draft' as const,
      };

      if (draftId) {
        // Update existing draft
        await updateRecord(draftId, draftData);
      } else {
        // Create new draft
        const newDraft = await createDraft(draftData);
        setDraftId(newDraft.id);
      }

      setLastSaved(new Date());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
      console.error('Auto-save error:', err);
    } finally {
      setIsSaving(false);

      // If there was a pending save request, trigger it
      if (pendingSaveRef.current) {
        pendingSaveRef.current = false;
        saveDraft();
      }
    }
  }, [tableData, records, user, draftId, isSaving, imageUri, createDraft, updateRecord]);

  // Auto-save effect
  useEffect(() => {
    if (!isAutoSaveActive) {
      return;
    }

    // Serialize records to detect changes
    const recordsJson = JSON.stringify(records);

    // Skip if no changes
    if (recordsJson === prevRecordsRef.current) {
      return;
    }

    prevRecordsRef.current = recordsJson;

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule save after debounce interval
    saveTimeoutRef.current = setTimeout(() => {
      saveDraft();
    }, autoSaveIntervalMs);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [records, isAutoSaveActive, autoSaveIntervalMs, saveDraft]);

  // Save immediately when unmounting if there are unsaved changes
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
        // Note: Can't reliably save on unmount due to async nature
        // Consider using beforeunload event for web
      }
    };
  }, []);

  return {
    draftId,
    isSaving,
    lastSaved,
    error,
    saveDraft,
  };
}
