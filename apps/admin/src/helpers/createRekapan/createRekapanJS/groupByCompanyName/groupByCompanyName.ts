import { group } from "radash";
import { z } from "zod";
import { CompanyName } from "../../types";

export const groupByCompanyName = <
  WorksheetRecord extends { companyName: string },
>(
  records: WorksheetRecord[]
): Record<CompanyName, WorksheetRecord[]> => {
  return group(records, (record) => record.companyName) as Record<CompanyName, WorksheetRecord[]>;
};
