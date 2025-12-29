import { assert } from "tsafe";
import { parseDateDDMMYYYY } from "../../../../../../utils/parseDateDDMMYYYY/parseDateDDMMYYYY";
import { RekapanWorkbookBody } from "../../../../types";
import { findCompanyWithRecord } from "./findCompanyWithRecord/findCompanyWithRecord";

// This is the goofiest shit, for some reason no error is being thrown like what
export const getRekapanMonth = (
  currentMonthRekapanWorkbookBody: RekapanWorkbookBody
): number => {
  console.log({ currentMonthRekapanWorkbookBody });
  const companyNameForCompanyWithRecords = findCompanyWithRecord(
    currentMonthRekapanWorkbookBody
  );
  console.log({ companyNameForCompanyWithRecords });
  const anyOne =
    currentMonthRekapanWorkbookBody[companyNameForCompanyWithRecords];
  if (anyOne === undefined)
    throw new Error(
      "company records for company name whihc should have assocated values returned none"
    );
  console.log({ anyOne });
  const anyoneRecords = anyOne.records;
  const firstRecord = anyoneRecords[0];
  console.log({ firstRecord });
  assert(firstRecord);
  const singleTanggal = firstRecord.tanggal;
  console.log({ singleTanggal });
  const asDate = parseDateDDMMYYYY(singleTanggal);
  const month = asDate.month();
  console.log({ month });
  return month;
};

// @ts-ignore
if (import.meta.main) {
  const input: RekapanWorkbookBody = {
    "Company A": {
      records: [
        {
          tanggal: "03/12/2024",
          stokDifference: 10,
          masuk: 20,
          keluar: 10,
          alatName: "Tool A",
          companyName: "Company A",
        },
      ],
    },
  };

  console.log(getRekapanMonth(input));
}
