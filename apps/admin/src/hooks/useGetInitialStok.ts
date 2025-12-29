import { useQuery } from "@tanstack/react-query";
import { initialStokKeys } from "../react-query";
import { supabase } from "../supabase";
import { InitialStokSchema, initialStokSchema } from "../types/schemas";

const useGetInitialStok = (alatName: string) => {
  const getInitialStok = async (): Promise<InitialStokSchema> => {
    const { data, error } = await supabase
      .from("alat")
      .select("initial_stok")
      .eq("name", alatName);
    const parsedData = initialStokSchema.parse(data);

    if (parsedData.length !== 1)
      throw Error(
        `More than one record of ${alatName} found, unique constraint failure`
      );

    if (error) throw error;
    return parsedData;
  };

  const result = useQuery({
    queryKey: initialStokKeys.lists(),
    queryFn: getInitialStok,
  });

  return result;
};

export default useGetInitialStok;
