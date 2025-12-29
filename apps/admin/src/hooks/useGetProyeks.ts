import { useQuery } from "@tanstack/react-query";
import { supabase } from "../supabase";
import { ProyeksSchema, proyeksSchema } from "../types/schemas";

const useGetProyeks = () => {
  const getProyeks = async (): Promise<ProyeksSchema> => {
    const { data, error } = await supabase.from("company").select("name");
    const parsedData = proyeksSchema.parse(data);
    if (error) throw error;
    return parsedData;
  };

  const result = useQuery({
    queryKey: ["proyeks"],
    queryFn: getProyeks,
  });

  return result;
};

export default useGetProyeks;
