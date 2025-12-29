import dayjsutc from "@dayjsutc";
import { supabase } from "../../../../supabase";
import {
  SupabaseWorksheetDataSchema,
  supabaseWorksheetDataSchema,
} from "./supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";

export const getCurrentMonthStokAlatData = async (
  rekapanToCreateDate: Date
): Promise<SupabaseWorksheetDataSchema> => {
  const currentMonthDate = dayjsutc(rekapanToCreateDate);

  const startOfCurrentMonth = currentMonthDate.startOf("month").toISOString();

  console.log({ startOfCurrentMonth });

  const endOfCurrentMonth = currentMonthDate.endOf("month").toISOString();

  console.log({ endOfCurrentMonth });

  const { data, error } = await supabase
    .from("record")
    .select("masuk,keluar,company_name,alat_name,tanggal")
    .gte("tanggal", startOfCurrentMonth)
    .lte("tanggal", endOfCurrentMonth);

  if (error) throw error;
  const myData = data?.map((each) => {
    return {
      ...each,
      company_name: {
        name: each.company_name,
      },
      alat_name: {
        name: each.alat_name,
      },
    };
  });
  const parsedData = supabaseWorksheetDataSchema.parse(myData);

  return parsedData;
};
