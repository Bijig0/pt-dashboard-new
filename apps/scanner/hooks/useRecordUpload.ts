import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  pushRecords,
  undoPush,
  getPushHistory,
  PushResult,
  UndoResult,
} from '../lib/recordService';
import { RecordRow, PushLogEntry } from '@pt-dashboard/shared';
import { useAuthStore } from '../store/authStore';

/**
 * Hook for uploading records with audit logging
 */
export function useRecordUpload() {
  const queryClient = useQueryClient();
  const user = useAuthStore((state) => state.user);

  const uploadMutation = useMutation<
    PushResult,
    Error,
    { records: RecordRow[]; year?: number }
  >({
    mutationFn: async ({ records, year }) => {
      return pushRecords(records, user?.id, year);
    },
    onSuccess: () => {
      // Invalidate push history query
      queryClient.invalidateQueries({ queryKey: ['pushHistory'] });
    },
  });

  return {
    upload: uploadMutation.mutate,
    uploadAsync: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    uploadError: uploadMutation.error,
    lastResult: uploadMutation.data,
    reset: uploadMutation.reset,
  };
}

/**
 * Hook for undoing a push operation
 */
export function useUndoPush() {
  const queryClient = useQueryClient();

  const undoMutation = useMutation<UndoResult, Error, string>({
    mutationFn: async (batchId) => {
      return undoPush(batchId);
    },
    onSuccess: () => {
      // Invalidate push history query
      queryClient.invalidateQueries({ queryKey: ['pushHistory'] });
    },
  });

  return {
    undo: undoMutation.mutate,
    undoAsync: undoMutation.mutateAsync,
    isUndoing: undoMutation.isPending,
    undoError: undoMutation.error,
    lastResult: undoMutation.data,
    reset: undoMutation.reset,
  };
}

/**
 * Hook for fetching push history
 */
export function usePushHistory(limit = 20) {
  const query = useQuery<PushLogEntry[], Error>({
    queryKey: ['pushHistory', limit],
    queryFn: async () => {
      const result = await getPushHistory(limit);
      if (result.error) {
        throw new Error(result.error);
      }
      return result.logs;
    },
    staleTime: 30000, // 30 seconds
  });

  return {
    history: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    refetch: query.refetch,
  };
}
