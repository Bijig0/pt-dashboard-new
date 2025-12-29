import { Tables } from "#src/types/supabase.js";
import ExcelJS from "exceljs";
import { StokAlatSchema } from "../stok-alat-schema/stok-alat-schema";
import dayjs from "dayjs";

export type StokAlat = Omit<Tables<"record">, "id">;

type Return = {
  stokAlat: StokAlat[];
};

type Args = {
  workbook: ExcelJS.Workbook;
  alatName: string;
};

export const cleanedStokAlatToJS = ({ workbook, alatName }: Args): Return => {
  const stokAlat: StokAlat[] = [];

  workbook.eachSheet((worksheet) => {
    worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
      if (rowNumber === 1) return; // Skip header row

      const rowValues = row.values;

      const { date, company, masuk, keluar } = StokAlatSchema.parse(rowValues);

      stokAlat.push({
        alat_name: alatName,
        company_name: company,
        keluar: keluar ?? null,
        masuk: masuk ?? null,
        tanggal: dayjs.utc(date).format("YYYY-MM-DD"),
      });
    });
  });

  return { stokAlat };
};
