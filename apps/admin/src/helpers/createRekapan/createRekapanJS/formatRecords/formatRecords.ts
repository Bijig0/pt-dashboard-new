import { pipe } from "fp-ts/lib/function";
import { SupabaseWorksheetDataSchema } from "../../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import { logAndPipe } from "../addRekapanHeader/addRekapanHeader";
import { cleanCompanyNames } from "./cleanCompanyNames/cleanCompanyNames";
import { flattenRecords } from "./flattenRecords/flattenRecords";
import { formatMasukAndKeluar } from "./formatMasukAndKeluar/formatMasukAndKeluar";

type FormattedRecordsSchema = {
  companyName: string;
  alatName: string;
  masuk: number | null;
  keluar: number | null;
  tanggal: string;
  stokDifference: number;
}[] & {};

const formatRecords = (records: SupabaseWorksheetDataSchema) => {
  const formattedRecords = pipe(
    records,
    flattenRecords,
    logAndPipe,
    cleanCompanyNames,
    formatMasukAndKeluar
  ) satisfies FormattedRecordsSchema as FormattedRecordsSchema;

  return formattedRecords;
};

export default formatRecords;
