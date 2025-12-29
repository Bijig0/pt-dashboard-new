import { useMutation, UseMutationOptions } from "@tanstack/react-query";

export const useCreateManualTagihan = (options?: UseMutationOptions) => {
  const mutation = useMutation({
    ...options,
  });

  return mutation;
};
