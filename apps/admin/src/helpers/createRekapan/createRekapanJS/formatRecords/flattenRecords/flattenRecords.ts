import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";

export const flattenRecords = <
  WorksheetRecord extends {
    company_name: { name: string };
    alat_name: { name: string };
  },
>(
  records: WorksheetRecord[]
): (Omit<WorksheetRecord, "company_name" | "alat_name"> & {
  companyName: string;
  alatName: string;
})[] => {
  return pipe(
    records,
    A.map((record) => {
      const { company_name, alat_name, ...rest } = record;
      return {
        ...rest,
        companyName: company_name.name,
        alatName: alat_name.name,
      };
    })
  );
};
