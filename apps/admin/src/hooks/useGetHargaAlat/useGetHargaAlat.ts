import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../supabase";
import { HargaAlatSchema, hargaAlatSchema } from "../../types/schemas";

const useGetHargaAlat = (companyName: string, alatName: string) => {
  const getHargaAlat = async (): Promise<HargaAlatSchema> => {
    console.log("Running");

    const { data, error } = await supabase
      .from("alat")
      .select("harga_harian, harga_bulanan, name")
      .eq("company", companyName)
      .eq("name", alatName)
      .limit(1);

    console.log({ data, error });

    const parsedData = hargaAlatSchema.parse(data);

    console.log({ parsedData });

    if (error) throw error;
    return parsedData;
  };

  const result = useQuery({
    queryKey: ["hargaAlat"],
    queryFn: getHargaAlat,
  });

  return result;
};

export default useGetHargaAlat;
