import { supabase } from "../../../supabase";

export const getSupabaseWorksheetData = async ({
  alatName,
  startOfNextMonth,
  endOfNextMonth,
}: {
  alatName: string;
  startOfNextMonth: string;
  endOfNextMonth: string;
}) => {
  const { data, error } = await supabase
    .from("record")
    .select("masuk,keluar,company_name,alat_name,tanggal")
    .eq("alat_name", alatName)
    .gte("tanggal", startOfNextMonth)
    .lte("tanggal", endOfNextMonth);

  return { data, error };
};
