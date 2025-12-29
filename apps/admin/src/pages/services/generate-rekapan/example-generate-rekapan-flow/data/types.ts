export type StokAlatRecord = {
  alat_name: string;
  company_name: string;
  keluar: number | null;
  masuk: number | null;
  tanggal: string; // YYYY-MM-DD format
};

export type RekapanRow = {
  tanggal: string; // Either a date string or "Total Sewa Periode [Month]"
  isSummaryRow: boolean;
  equipmentQuantities: Record<string, number | undefined>; // Equipment name -> quantity
};

export type ExampleStokAlatData = {
  title: string;
  records: StokAlatRecord[];
};

export type ExampleRekapanData = {
  equipmentNames: string[]; // Column headers for equipment
  rows: RekapanRow[];
};
