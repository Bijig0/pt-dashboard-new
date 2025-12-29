import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import uploadStokAlatData from "./uploadStokAlatData";

const useUploadStokAlatData = (options?: UseMutationOptions) => {
  const mutation = useMutation({
    mutationFn: uploadStokAlatData,
    ...options,
  });

  return mutation;
};

export default useUploadStokAlatData;
