import { checkParsableToDateDDMMYYYY } from "../../../../../../../utils/checkParsableToDateDDMMYYYY/checkParsableToDateDDMMYYYY";
import { GroupedRecord } from "../../../../generateTagihan";

export const isValidGroupedRecord = (record: GroupedRecord): boolean => {
  return Object.values(record).every((alatRecord) => {
    const dates = new Set<string>();
    return Object.keys(alatRecord).every((key) => {
      const date = key.split("-")[0];
      if (!date) throw new Error("Date is undefined");
      const isDate = checkParsableToDateDDMMYYYY(date);
      if (!isDate) throw new Error("Date is undefined");
      if (dates.has(date)) {
        return false; // Date already exists
      }
      dates.add(date);
      return true;
    });
  });
};
