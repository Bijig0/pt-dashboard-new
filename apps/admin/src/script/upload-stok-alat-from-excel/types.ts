import { DataError } from "../stok-alat-to-js/find-stok-alat-data-errors/find-stok-alat-data-errors";

export { StokAlat } from "../stok-alat-to-js/cleaned-stok-alat-to-js/cleaned-stok-alat-to-js";

export type ProcessResult = {
  fileName: string;
  alatName: string;
  success: boolean;
  recordCount?: number;
  errors?: DataError[];
  errorMessage?: string;
};

export type SeedingSummary = {
  totalFiles: number;
  filesProcessed: number;
  filesWithErrors: number;
  totalRecords: number;
  results: ProcessResult[];
};
