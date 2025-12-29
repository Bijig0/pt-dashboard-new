import { useQuery } from "@tanstack/react-query";
import { worksheetDataKeys } from "../pages/services/first-one/queries";
import { getWorksheetData } from "./getWorksheetData/getWorksheetData";

const useGetWorksheetData = (alatName: string, date: Date) => {
  const result = useQuery({
    queryKey: worksheetDataKeys.detail(alatName, date),
    queryFn: () => getWorksheetData(alatName, date),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    gcTime: 0,
  });

  return result;
};

export default useGetWorksheetData;
