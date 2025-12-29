import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

type AddHargaAlatParams = {
  hargaHarian: number | null;
  hargaBulanan: number | null;
  alatName: string;
  companyName: string;
};

type UseMutationOptionsDefault = UseMutationOptions<
  void,
  Error,
  AddHargaAlatParams,
  unknown
>;

const useAddHargaAlat = (options?: UseMutationOptionsDefault) => {
  const addHargaAlat = async (params: AddHargaAlatParams) => {
    const { hargaHarian, hargaBulanan, alatName, companyName } = params;

    const { data, error } = await supabase
      .from("alat")
      .update({ harga_bulanan: hargaBulanan, harga_harian: hargaHarian })
      .eq("name", alatName)
      .eq("company", companyName)
      .select();

    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: addHargaAlat,
    ...options,
  });

  return mutation;
};

export default useAddHargaAlat;
