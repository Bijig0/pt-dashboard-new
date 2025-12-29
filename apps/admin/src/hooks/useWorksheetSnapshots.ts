import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import dayjs from "dayjs";
import { supabase } from "../supabase";
import { Row } from "../types/globals";

export type WorksheetSnapshot = {
  id: number;
  alat_name: string;
  month: string;
  snapshot: Row[];
  label: string | null;
  created_at: string;
  user_id: string | null;
};

// Query keys
export const snapshotKeys = {
  all: ["worksheetSnapshots"] as const,
  lists: () => [...snapshotKeys.all, "list"] as const,
  list: (alatName: string, month: Date) =>
    [...snapshotKeys.lists(), alatName, dayjs(month).format("YYYY-MM")] as const,
};

// Fetch snapshots for a specific worksheet/month
export const useGetSnapshots = (alatName: string, month: Date) => {
  const monthStart = dayjs(month).startOf("month").format("YYYY-MM-DD");

  return useQuery({
    queryKey: snapshotKeys.list(alatName, month),
    queryFn: async (): Promise<WorksheetSnapshot[]> => {
      const { data, error } = await supabase
        .from("worksheet_snapshot")
        .select("*")
        .eq("alat_name", alatName)
        .eq("month", monthStart)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return (data as WorksheetSnapshot[]) ?? [];
    },
    refetchOnWindowFocus: false,
  });
};

// Save a new snapshot
type SaveSnapshotParams = {
  alatName: string;
  month: Date;
  snapshot: Row[];
  label?: string;
};

export const useSaveSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ alatName, month, snapshot, label }: SaveSnapshotParams) => {
      const monthStart = dayjs(month).startOf("month").format("YYYY-MM-DD");

      const { data: userData } = await supabase.auth.getUser();

      const { error } = await supabase.from("worksheet_snapshot").insert({
        alat_name: alatName,
        month: monthStart,
        snapshot: snapshot as unknown as Record<string, unknown>[],
        label: label ?? null,
        user_id: userData.user?.id ?? null,
      });

      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      // Invalidate the snapshots list for this worksheet/month
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.list(variables.alatName, variables.month),
      });
    },
  });
};

// Delete a snapshot
export const useDeleteSnapshot = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (snapshotId: number) => {
      const { error } = await supabase
        .from("worksheet_snapshot")
        .delete()
        .eq("id", snapshotId);

      if (error) throw error;
    },
    onSuccess: () => {
      // Invalidate all snapshot queries
      queryClient.invalidateQueries({
        queryKey: snapshotKeys.all,
      });
    },
  });
};
