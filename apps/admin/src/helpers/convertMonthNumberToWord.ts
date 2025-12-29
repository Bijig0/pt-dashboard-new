import dayjs from "dayjs";

const convertMonthNumberToWord = (monthNumber: number): string => {
  const date = dayjs.utc().month(monthNumber);

  // Format the date to get the month name
  const monthName = date.format("MMMM");

  return monthName;
};

export default convertMonthNumberToWord;
