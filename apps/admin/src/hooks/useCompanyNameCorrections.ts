import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { companyNamesKeys } from "../react-query";

// Types for company name corrections
export type CorrectionPayload = {
  old_name: string;
  new_name: string;
};

export type ApplyCorrectionResult = {
  batch_id: string;
  records_updated: number;
  companies_merged: number;
};

export type RollbackResult = {
  records_restored: number;
  success: boolean;
};

export type CorrectionHistoryItem = {
  batch_id: string;
  created_at: string;
  records_count: number;
  old_companies: string[];
  new_companies: string[];
  is_rolled_back: boolean;
};

export type RecordCompanyName = {
  company_name: string;
  record_count: number;
};

// Hook: Get all unique company names from records with counts
export const useGetAllRecordCompanyNames = () => {
  return useQuery({
    queryKey: ["record-company-names"],
    queryFn: async (): Promise<RecordCompanyName[]> => {
      const { data, error } = await supabase.rpc("get_all_record_company_names");
      if (error) throw error;
      return data ?? [];
    },
  });
};

// Hook: Apply company name corrections
export const useApplyCorrections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (corrections: CorrectionPayload[]): Promise<ApplyCorrectionResult> => {
      const { data, error } = await supabase.rpc("apply_company_name_corrections", {
        corrections: corrections,
      });

      if (error) throw error;

      // The RPC returns an array with one row
      const result = data?.[0];
      if (!result) {
        throw new Error("No result returned from apply_company_name_corrections");
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: companyNamesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["record-company-names"] });
      queryClient.invalidateQueries({ queryKey: ["correction-history"] });
      queryClient.invalidateQueries({ queryKey: ["unused-companies"] });
    },
  });
};

// Hook: Rollback a correction batch
export const useRollbackCorrections = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (batchId: string): Promise<RollbackResult> => {
      const { data, error } = await supabase.rpc("rollback_company_name_corrections", {
        p_batch_id: batchId,
      });

      if (error) throw error;

      const result = data?.[0];
      if (!result) {
        throw new Error("No result returned from rollback_company_name_corrections");
      }

      return result;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: companyNamesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["record-company-names"] });
      queryClient.invalidateQueries({ queryKey: ["correction-history"] });
      queryClient.invalidateQueries({ queryKey: ["unused-companies"] });
    },
  });
};

// Hook: Get correction history
export const useGetCorrectionHistory = () => {
  return useQuery({
    queryKey: ["correction-history"],
    queryFn: async (): Promise<CorrectionHistoryItem[]> => {
      const { data, error } = await supabase.rpc("get_correction_history");
      if (error) throw error;
      return data ?? [];
    },
  });
};

// Hook: Get unused companies
export const useGetUnusedCompanies = () => {
  return useQuery({
    queryKey: ["unused-companies"],
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase.rpc("get_unused_companies");
      if (error) throw error;
      return data?.map((d: { company_name: string }) => d.company_name) ?? [];
    },
  });
};

// Hook: Delete unused companies
export const useDeleteUnusedCompanies = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (): Promise<number> => {
      const { data, error } = await supabase.rpc("delete_unused_companies");
      if (error) throw error;
      return data ?? 0;
    },
    onSuccess: () => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: companyNamesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: ["unused-companies"] });
    },
  });
};

// Types for excluded company names
export type ExcludedCompanyName = {
  company_name: string;
  created_at: string;
};

// Hook: Get excluded company names
export const useGetExcludedCompanyNames = () => {
  return useQuery({
    queryKey: ["excluded-company-names"],
    queryFn: async (): Promise<ExcludedCompanyName[]> => {
      const { data, error } = await supabase.rpc("get_excluded_company_names");
      if (error) throw error;
      return data ?? [];
    },
  });
};

// Hook: Add excluded company names
export const useAddExcludedCompanyNames = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (names: string[]): Promise<number> => {
      const { data, error } = await supabase.rpc("add_excluded_company_names", {
        names,
      });
      if (error) throw error;
      return data ?? 0;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["excluded-company-names"] });
    },
  });
};

// Hook: Remove excluded company name
export const useRemoveExcludedCompanyName = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (name: string): Promise<boolean> => {
      const { data, error } = await supabase.rpc("remove_excluded_company_name", {
        p_name: name,
      });
      if (error) throw error;
      return data ?? false;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["excluded-company-names"] });
    },
  });
};
