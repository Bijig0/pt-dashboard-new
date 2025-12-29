import dayjs, { Dayjs } from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export function parseDateDDMMYYYY(dateString: string): Dayjs {
  const date = dayjs.utc(dateString, "DD/MM/YYYY", true);

  if (!date.isValid()) throw new Error("Invalid date");

  return date;
}
