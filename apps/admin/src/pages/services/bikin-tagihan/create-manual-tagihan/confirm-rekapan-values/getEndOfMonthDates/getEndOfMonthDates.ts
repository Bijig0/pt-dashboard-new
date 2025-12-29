import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

export function getEndOfMonthDates() {
  const currentYear = dayjs.utc().year();
  const startDate = dayjs.utc(`${currentYear - 1}-07-01`); // July 1st of previous year
  const endDate = dayjs.utc(`${currentYear + 1}-06-30`); // June 30th of next year

  const dates = [];
  let currentDate = startDate;

  while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, "day")) {
    dates.push(currentDate.endOf("month"));
    currentDate = currentDate.add(1, "month");
  }

  return dates;
}
