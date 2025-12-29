import { getMonthRange } from "./getMonthRange/getMonthRange";
import { getSupabaseWorksheetData } from "./getSupabaseWorksheetData/getSupabaseWorksheetData";
import {
  WorksheetDataSchema,
  worksheetDataSchema,
} from "./worksheetDataSchema/worksheetDataSchema";

export const getWorksheetData = async (
  alatName: string,
  date: Date
): Promise<WorksheetDataSchema> => {
  // date will be say 31st of december,
  // we want to thus pull data from 1st Jan to 31st Jan

  const { startOfNextMonth, endOfNextMonth } = getMonthRange(date);

  console.log({ endOfNextMonth });

  console.log({ alatName });

  const { data, error } = await getSupabaseWorksheetData({
    alatName,
    startOfNextMonth,
    endOfNextMonth,
  });

  console.log({ data });
  const parsedData = worksheetDataSchema.parse(data);

  console.log({ parsedData });

  if (error) throw error;
  return parsedData;
};
