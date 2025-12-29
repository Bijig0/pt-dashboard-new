import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

dayjs.extend(customParseFormat);

export function checkParsableToDateDDMMYYYY(dateString: string): boolean {
  // Use strict parsing to ensure the format is exactly DD/MM/YYYY
  const date = dayjs(dateString, "DD/MM/YYYY", true);
  return date.isValid();
}
function main() {
  const dateString = "21/06/2024";
  const result = checkParsableToDateDDMMYYYY(dateString);

  console.log({ result });
}

// @ts-ignore
if (import.meta.main) {
  main();
}
