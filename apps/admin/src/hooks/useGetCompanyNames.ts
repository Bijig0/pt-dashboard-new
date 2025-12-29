import { useQuery } from "@tanstack/react-query";
import { companyNamesKeys } from "../react-query";
import { supabase } from "../supabase";
import { companyNamesSchema } from "../types/schemas";

const getCompanyNames = async (): Promise<string[]> => {
  const { data, error } = await supabase.from("company").select("name");
  const parsedData = companyNamesSchema.parse(data);
  const companyNames = parsedData.map((company) => company.name).toSorted();

  if (error) throw error;

  return companyNames;
};
export const useGetCompanyNames = () => {
  const result = useQuery({
    queryKey: companyNamesKeys.lists(),
    queryFn: getCompanyNames,
  });

  return result;
};

export default useGetCompanyNames;
