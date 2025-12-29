/**
 * Types for audit logging and record management
 * Used by both scanner and admin apps
 */

/**
 * Represents a single record row in the scanner app format
 * This is the format used during OCR extraction and editing
 */
export interface RecordRow {
  id?: string; // Local ID for editing (not DB id)
  date: string; // Format: "DD/MM" e.g., "17/12"
  type: "kirim" | "terima"; // kirim = keluar, terima = masuk
  companyName: string;
  alatName: string;
  amount: number | null; // null during editing, required for upload
}

/**
 * Represents a record as stored in the database
 */
export interface DatabaseRecord {
  id?: number;
  tanggal: string; // ISO date string
  company_name: string;
  alat_name: string;
  masuk: number | null;
  keluar: number | null;
}

/**
 * Entry in the push log for audit tracking
 */
export interface PushLogEntry {
  id: number;
  batch_id: string;
  user_id: string | null;
  action_type: "push" | "delete" | "restore";
  record_ids: number[];
  records_data: RecordRow[];
  records_count: number;
  description: string | null;
  created_at: string;
  rolled_back_at: string | null;
  rolled_back_by_batch_id: string | null;
}

/**
 * Result of a validation check for a name field
 */
export interface ValidationResult {
  value: string;
  isValid: boolean;
  isExactMatch: boolean;
  suggestions: string[];
  bestMatch?: {
    name: string;
    similarity: number;
  };
}

/**
 * Summary of all validations before upload
 */
export interface ValidationSummary {
  isAllValid: boolean;
  companyValidations: ValidationResult[];
  alatValidations: ValidationResult[];
  invalidCount: number;
  warningCount: number; // Has suggestions but not exact match
}

/**
 * Convert RecordRow (scanner format) to DatabaseRecord (DB format)
 */
export function recordRowToDatabase(
  row: RecordRow,
  year: number = new Date().getFullYear()
): DatabaseRecord {
  // Parse "DD/MM" format
  const [day, month] = row.date.split("/").map(Number);
  const tanggal = new Date(year, (month ?? 1) - 1, day ?? 1)
    .toISOString()
    .split("T")[0]!;

  return {
    tanggal,
    company_name: row.companyName,
    alat_name: row.alatName,
    masuk: row.type === "terima" ? row.amount : null,
    keluar: row.type === "kirim" ? row.amount : null,
  };
}

/**
 * Convert DatabaseRecord (DB format) to RecordRow (scanner format)
 */
export function databaseToRecordRow(record: DatabaseRecord): RecordRow {
  const date = new Date(record.tanggal);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");

  const type: RecordRow["type"] =
    record.masuk !== null && record.masuk > 0 ? "terima" : "kirim";
  const amount = record.masuk ?? record.keluar ?? 0;

  return {
    id: record.id?.toString(),
    date: `${day}/${month}`,
    type,
    companyName: record.company_name,
    alatName: record.alat_name,
    amount,
  };
}
