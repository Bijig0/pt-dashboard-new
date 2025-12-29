import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import {
  validateRekapan,
  ValidateRekapanArgs,
  ValidateRekapanReturn,
} from "./validateManualTagihan/validateRekapan";

type UseMutationOptionsDefault = UseMutationOptions<
  ValidateRekapanReturn,
  Error,
  ValidateRekapanArgs,
  unknown
>;

const useValidateRekapan = (options?: UseMutationOptionsDefault) => {
  const mutation = useMutation({
    mutationFn: validateRekapan,
    ...options,
  });

  return mutation;
};

export default useValidateRekapan;
