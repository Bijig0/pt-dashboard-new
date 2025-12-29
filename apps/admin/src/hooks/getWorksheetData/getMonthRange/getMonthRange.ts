import dayjsutc from "@dayjsutc";

export const getMonthRange = (date: Date) => {
  const nextMonthDate = dayjsutc(date).add(1, "month");

  const startOfNextMonth = nextMonthDate.startOf("month").toISOString();

  const endOfNextMonth = nextMonthDate.endOf("month").toISOString();

  return { startOfNextMonth, endOfNextMonth };
};
