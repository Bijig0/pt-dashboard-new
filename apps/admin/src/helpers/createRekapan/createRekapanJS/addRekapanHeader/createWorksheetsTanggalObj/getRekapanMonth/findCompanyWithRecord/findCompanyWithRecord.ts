import { isMainModule } from "../../../../../../isRunningOnBrowser";
import { RekapanWorkbookBody } from "../../../../../types";

// 
export const findCompanyWithRecord = (
  currentMonthRekapanWorkbookBody: RekapanWorkbookBody
): string => {
  const companyNames = Object.keys(currentMonthRekapanWorkbookBody);

  const companyName = companyNames.find((companyName) => {
    const companyRecords =
      currentMonthRekapanWorkbookBody[companyName]?.records;
    if (!companyRecords || companyRecords.length === 0) {
      return false;
    }

    return companyRecords.every(
      (record) => Object.keys(record).length !== 0
    );
  });

  if (!companyName) {
    throw new Error("No company found with non-empty records.");
  }

  return companyName;
};

// @ts-ignore
if (import.meta?.main) {
  const data: RekapanWorkbookBody = {
    CompanyA: {
      records: [],
    },
    CompanyB: {
      records: [],
    },
  };
  const result = findCompanyWithRecord(data);

  console.log({ result });
}
