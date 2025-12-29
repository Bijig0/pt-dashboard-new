import { useQuery } from "@tanstack/react-query";
import { getCurrentMonthStokAlatData } from "../pages/services/first-one/getCurrentMonthStokAlatData/getCurrentMonthStokAlatData";

export const useGetCurrentMonthStokAlatData = (date: Date | undefined) => {
  return useQuery({
    queryKey: ["currentMonthStokAlatData", date?.toISOString()],
    queryFn: () => getCurrentMonthStokAlatData(date!),
    enabled: !!date,
  });
};

export default useGetCurrentMonthStokAlatData;
