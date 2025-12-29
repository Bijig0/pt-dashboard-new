import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import { supabase } from "../supabase";

type UpdateCompanyParams = {
  oldName: string;
  newName: string;
};

type UseMutationOptionsDefault = UseMutationOptions<
  void,
  unknown,
  UpdateCompanyParams,
  unknown
>;

const useUpdateCompany = (
  options?: Omit<UseMutationOptionsDefault, "mutationFn">
) => {
  const updateCompany = async (params: UpdateCompanyParams) => {
    const { oldName, newName } = params;

    const { error } = await supabase
      .from("company")
      .update({ name: newName })
      .eq("name", oldName);

    if (error) throw error;
  };

  const mutation = useMutation({
    mutationFn: updateCompany,
    ...options,
  });
  return mutation;
};

export default useUpdateCompany;
