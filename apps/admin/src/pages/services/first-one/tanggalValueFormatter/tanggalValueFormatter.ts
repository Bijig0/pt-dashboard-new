import { z } from "zod";
import { parseDateDDMMYYYY } from "../../../../utils/parseDateDDMMYYYY/parseDateDDMMYYYY";

// TODO make this throw on params.value === null
export const tanggalValueFormatter = (params: {
  value: unknown;
}): string | null => {
  if (params.value === null) return null;
  const dateString = z.string().parse(params.value);
  console.log({ dateString });
  const date = parseDateDDMMYYYY(dateString);
  console.log({ date });
  const formattedDate = date.format("D MMMM");
  console.log({ formattedDate });
  return formattedDate;
};

// @ts-ignore
if (import.meta.main) {
}
