import { useMutation, UseMutationOptions } from "@tanstack/react-query";
import { synchronizeCompanyNamesKey } from "./queryKeys";
import { synchronizeCompanyNames } from "./synchronizeCompanyNames/synchronizeCompanyNames";

type Args = {
  companyNames: string[];
  options?: UseMutationOptions;
};

const useSynchronizeCompanyNames = ({ companyNames, options }: Args) => {
  const result = useMutation({
    mutationKey: synchronizeCompanyNamesKey,
    mutationFn: () => synchronizeCompanyNames({ companyNames }),
    ...options,
  });

  return result;
};

export default useSynchronizeCompanyNames;
