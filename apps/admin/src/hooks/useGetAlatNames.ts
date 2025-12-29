import { useQuery } from "@tanstack/react-query";
import { alatNamesKeys } from "../pages/services/first-one/queries";
import { supabase } from "../supabase";
import { alatNamesSchema } from "../types/schemas";

type Args = {
  startDate: Date | undefined;
  endDate: Date | undefined;
};

const getAlatNames = async (startDate: Date, endDate: Date): Promise<string[]> => {
  console.log("[getAlatNames] Input dates:", {
    startDate: startDate.toUTCString(),
    endDate: endDate.toUTCString(),
  });

  const { data, error } = await supabase.rpc(
    "get_unique_alat_names_between_dates",
    {
      start_date: startDate.toUTCString(),
      end_date: endDate.toUTCString(),
    }
  );

  console.log("[getAlatNames] RPC response:", { data, error });

  if (error) throw error;

  if (!data) {
    console.error("[getAlatNames] No data returned from RPC");
    return [];
  }

  console.log("[getAlatNames] Parsing data, length:", data?.length);
  const parsedData = alatNamesSchema.parse(data);
  const alatNames = parsedData.map((each) => each.name);
  console.log("[getAlatNames] Successfully parsed alat names:", alatNames);
  return alatNames;
};

export const useGetAlatNames = (args: Args) => {
  const { startDate, endDate } = args;

  const result = useQuery({
    queryKey: alatNamesKeys.detail(startDate, endDate),
    queryFn: () => getAlatNames(startDate!, endDate!),
    enabled: !!startDate && !!endDate,
    gcTime: 0,
  });

  return result;
};

export default useGetAlatNames;
