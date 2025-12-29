import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

type CreateAlatParams = {
  hargaHarian: number;
  hargaBulanan: number;
  alatName: string;
  companyName: string;
};

type UseMutationOptionsDefault = UseMutationOptions<
  void,
  Error,
  CreateAlatParams,
  unknown
>;

const useCreateAlat = (options?: UseMutationOptionsDefault) => {
  const createAlat = async (params: CreateAlatParams) => {
    const { hargaHarian, hargaBulanan, alatName, companyName } = params;

    const { error } = await supabase
      .from("alat")
      .insert({
        name: alatName,
        harga_bulanan: hargaBulanan,
        harga_harian: hargaHarian,
        company: companyName,
      });

    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: createAlat,
    ...options,
  });

  return mutation;
};

export default useCreateAlat;
