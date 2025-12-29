import { Dayjs } from "dayjs";

type Return = {
  tanggalStart: string;
  tanggalEnd: string;
  daysInPeriod: number;
};

const getTagihanDatePeriods = (periodToCreateTagihanFor: Dayjs): Return => {
  const tanggalStart = periodToCreateTagihanFor
    .startOf("month")
    .format("DD/MM/YYYY");

  const tanggalEnd = periodToCreateTagihanFor
    .endOf("month")
    .format("DD/MM/YYYY");

  const daysInPeriod = periodToCreateTagihanFor.daysInMonth();

  return { tanggalStart, tanggalEnd, daysInPeriod };
};

export default getTagihanDatePeriods;
