import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

type AddInitialStokParams = {
  initialStok: number | null;
  alatName: string;
};

type UseMutationOptionsDefault = UseMutationOptions<
  void,
  Error,
  AddInitialStokParams,
  unknown
>;

const useAddInitialStok = (options?: UseMutationOptionsDefault) => {
  const addInitialStok = async (params: AddInitialStokParams) => {
    const { initialStok, alatName } = params;

    const { data, error } = await supabase
      .from("alat")
      .update({ initial_stok: initialStok })
      .eq("name", alatName)
      .select();

    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: addInitialStok,
    ...options,
  });

  return mutation;
};

export default useAddInitialStok;
