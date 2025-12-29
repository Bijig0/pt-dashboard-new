import { useQuery } from "@tanstack/react-query";
import console from "console";
import { supabase } from "../supabase";
import { Tables } from "../types/supabase";

export type HargaAlat = Pick<
  Tables<"alat">,
  "name" | "harga_bulanan" | "harga_harian"
>;

export const useGetAllHargaAlat = (selectedCompanyName: string | undefined) => {
  const getAlatNamesForCompany = async (): Promise<HargaAlat[]> => {
    console.log({ selectedCompanyName });

    const { data, error } = await supabase
      .from("alat")
      .select("name, harga_bulanan, harga_harian")
      .eq("company", selectedCompanyName!);

    console.log({ data });

    // const parsedData = alatDetailsSchema.parse(data);

    if (error) throw error;
    return data satisfies HargaAlat[];
  };
  console.log({ selectedCompanyName });

  const result = useQuery({
    queryKey: ["companyAlatsDetails", selectedCompanyName],
    enabled: !!selectedCompanyName,
    queryFn: getAlatNamesForCompany,
    gcTime: 0,
  });

  return result;
};
