import { useMutation } from "@tanstack/react-query";
import axiosClient from "../axios";

type Params = {
  onSuccess: (...args: any) => any | void;
  onError: (...args: any) => any | void;
};

const url = "/api/edge-backend";

const useGenerateReport = ({ onSuccess, onError }: Params) => {
  const mutation = useMutation({
    mutationFn: () => {
      return axiosClient.post(url);
    },
    onSuccess: onSuccess,
    onError: onError,
  });
  return mutation;
};

export default useGenerateReport;
