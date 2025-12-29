import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

type UseMutationOptionsDefault = UseMutationOptions<
  void,
  unknown,
  string,
  unknown
>;

const useRegisterCompany = (
  options?: Omit<UseMutationOptionsDefault, "mutationFn">
) => {
  const registerCompany = async (companyName: string) => {
    const { error } = await supabase
      .from("company")
      .insert({ name: companyName });

    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: registerCompany,
    ...options,
  });
  return mutation;
};

export default useRegisterCompany;
