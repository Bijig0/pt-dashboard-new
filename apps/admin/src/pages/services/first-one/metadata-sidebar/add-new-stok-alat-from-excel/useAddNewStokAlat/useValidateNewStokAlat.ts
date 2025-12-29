import { UseMutationOptions, useMutation } from "@tanstack/react-query";
import {
  AddNewStokAlatArgs,
  Return,
  validateNewStokAlat,
} from "./validateNewStokAlat/validateNewStokAlat";

type UseMutationOptionsDefault = UseMutationOptions<
  Return,
  Error,
  AddNewStokAlatArgs,
  unknown
>;

const useValidateNewStokAlat = (options?: UseMutationOptionsDefault) => {
  const mutation = useMutation({
    mutationFn: validateNewStokAlat,
    ...options,
  });

  return mutation;
};

export default useValidateNewStokAlat;
