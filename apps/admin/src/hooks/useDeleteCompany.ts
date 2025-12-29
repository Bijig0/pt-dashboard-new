import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

type UseMutationOptionsDefault = UseMutationOptions<
  void,
  unknown,
  string,
  unknown
>;

const useDeleteCompany = (
  options?: Omit<UseMutationOptionsDefault, "mutationFn">
) => {
  const deleteCompany = async (companyName: string) => {
    const { error } = await supabase
      .from("company")
      .delete()
      .eq("name", companyName);

    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: deleteCompany,
    ...options,
  });
  return mutation;
};

export default useDeleteCompany;
