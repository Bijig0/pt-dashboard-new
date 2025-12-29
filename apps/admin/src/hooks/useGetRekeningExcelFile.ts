import { useQuery } from "@tanstack/react-query";
import { getRekapanData } from "../helpers/getRekapanData/getRekapanData";

const useGetRekeningExcelFile = (date: Date, enabled: boolean) => {
  const result = useQuery({
    queryKey: ["rekenings"],
    queryFn: () => getRekapanData(date),
    enabled: enabled,
    gcTime: 0,
  });

  return result;
};

export default useGetRekeningExcelFile;
