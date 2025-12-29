import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import utc from "dayjs/plugin/utc";
import { assert } from "tsafe";
import { parseDateDDMMYYYY } from "../../../../../../utils/parseDateDDMMYYYY/parseDateDDMMYYYY";

dayjs.extend(utc);
dayjs.extend(customParseFormat);

export const checkBorrowPeriodForWholeMonth = (
  daysBorrowedFor: number,
  tanggalWithinMonth: string
) => {
  console.log({ daysBorrowedFor, tanggalWithinMonth });
  console.log(daysBorrowedFor >= 0);
  assert(
    daysBorrowedFor >= 0,
    "Days borrowed must be greater than or equal to 0, you can't borrow for a negative number of days"
  );
  const daysInMonth = parseDateDDMMYYYY(tanggalWithinMonth).daysInMonth();
  if (daysBorrowedFor > daysInMonth)
    throw new Error("Days borrowed is greater than days in month");
  return daysBorrowedFor === daysInMonth;
};

// @ts-ignore
if (import.meta.main) {
  const result = checkBorrowPeriodForWholeMonth(31, "01/07/2024");
  console.log({ result });
}
