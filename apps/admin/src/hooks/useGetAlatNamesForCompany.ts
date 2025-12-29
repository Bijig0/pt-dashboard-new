import { useQuery } from "@tanstack/react-query";
import console from "console";
import { supabase } from "../supabase";
import { alatNamesSchema } from "../types/schemas";

const useGetAlatNamesForCompany = (selectedCompanyName: string | undefined) => {
  console.log({ selectedCompanyName });

  const getAlatNamesForCompany = async (): Promise<string[]> => {
    console.log({ selectedCompanyName });

    const { data, error } = await supabase
      .from("alat")
      .select("name")
      .eq("company", selectedCompanyName!);

    console.log({ data });

    const parsedData = alatNamesSchema.parse(data);

    const alatNames = parsedData.map((each) => each.name);
    if (error) throw error;
    // Remove duplicates to prevent React key warnings and multiple record issues
    return Array.from(new Set(alatNames));
  };

  const result = useQuery({
    queryKey: ["proyekAlats", selectedCompanyName],
    enabled: !!selectedCompanyName,
    queryFn: getAlatNamesForCompany,
    gcTime: 0,
  });

  return result;
};

export default useGetAlatNamesForCompany;
