export type StokAlatRecord = {
  alat_name: string;
  company_name: string;
  tanggal: string;
  masuk: number | null;
  keluar: number | null;
  upload_batch_id: string;
};

// Extended type with source tracking for debugging
export type StokAlatRecordWithSource = StokAlatRecord & {
  _sourceFile: string;
  _sourceLine: number;
};

export type CsvRow = {
  tgl: string;
  companyName: string;
  masuk: string;
  keluar: string;
};

export type UploadResult = {
  batchId: string;
  totalRecords: number;
  filesProcessed: number;
};
