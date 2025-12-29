import dayjsutc from "@dayjsutc";
import { Dayjs } from "dayjs";

export const parseDateYYYYMMDD = (dateString: string): Dayjs => {
  const date = dayjsutc(dateString, "YYYY-MM-DD", true);

  if (!date.isValid()) throw new Error("Invalid date");

  return date;
};
