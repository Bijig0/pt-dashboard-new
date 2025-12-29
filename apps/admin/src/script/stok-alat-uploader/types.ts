export type StokAlatRecord = {
  alat_name: string;
  company_name: string;
  tanggal: string;
  masuk: number | null;
  keluar: number | null;
  upload_batch_id: string;
};

export type StokAlatRecordWithSource = StokAlatRecord & {
  _sourceFile: string;
  _sourceLine: number;
};

export type SheetData = {
  sheetName: string;
  rows: Array<{
    tgl: string;
    companyName: string;
    masuk: string;
    keluar: string;
    lineNumber: number;
  }>;
};

export type ParsedExcelResult = {
  sheets: SheetData[];
  totalRows: number;
};

export type ValidationError = {
  type: string;
  record: StokAlatRecordWithSource;
  message: string;
};

export type UploadResult = {
  batchId: string;
  totalRecords: number;
  filesProcessed: number;
};
