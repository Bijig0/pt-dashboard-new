import * as A from "fp-ts/Array";
import { pipe } from "fp-ts/lib/function";
import { objectFromEntries } from "ts-extras";
import { RekapanWorkbookObj } from "../../../../../../hooks/useGetRekapanData";

// Per-company initial total sewa alat values
// Structure: { [companyName]: { [alatName]: initialTotal } }
export type InitialTotalSewaAlat = Record<string, Record<string, number>>;

/**
 * Builds an initial RekapanWorkbookObj from manually entered initial total values.
 * This is used for the first month of rekapan generation instead of starting from 0.
 *
 * @param currentMonthData - The records for the current month
 * @param initialTotalSewaAlat - Manual initial values per alat (defaults to 0)
 * @returns A RekapanWorkbookObj with initial values as currentBulanTotalSewaAlatAmount
 */
export const buildInitialRekapanFromValues = (
  currentMonthData: Array<{ company_name: { name: string }; alat_name: { name: string } }>,
  initialTotalSewaAlat: InitialTotalSewaAlat
): RekapanWorkbookObj => {
  console.log(
    "[buildInitialRekapanFromValues] Building initial rekapan from manual values:",
    initialTotalSewaAlat
  );

  // Get unique companies
  const uniqueCompanies = [
    ...new Set(currentMonthData.map((record) => record.company_name.name)),
  ];

  // Build RekapanWorkbookObj structure
  const initialRekapan = pipe(
    uniqueCompanies,
    A.map((companyName) => {
      // Get all alat records for this company from current month
      const companyAlats = currentMonthData
        .filter((record) => record.company_name.name === companyName)
        .map((record) => record.alat_name.name);

      const uniqueCompanyAlats = [...new Set(companyAlats)];

      // Build currentBulanTotalSewaAlatAmount object for this company
      const currentBulanTotalSewaAlatAmount = pipe(
        uniqueCompanyAlats,
        A.map((alatName) => {
          // Use company-specific initial value, default to 0
          const initialTotal = initialTotalSewaAlat[companyName]?.[alatName] ?? 0;

          console.log(
            `[buildInitialRekapanFromValues] ${companyName} - ${alatName}: initial = ${initialTotal}`
          );

          return [alatName, initialTotal] as const;
        }),
        objectFromEntries
      );

      // Build header object with alat names as keys
      // This is needed so listWorksheetsAlatNames can find the alat names
      // when this company has no records in subsequent months
      const header = pipe(
        uniqueCompanyAlats,
        A.mapWithIndex((index, alatName) => [alatName, { colIndex: index + 1 }] as const),
        objectFromEntries,
        (alatHeaders) => ({ Tanggal: { colIndex: 0 }, ...alatHeaders })
      );

      return [
        companyName,
        {
          currentBulanTotalSewaAlatAmount,
          prevBulanTotalSewaAlatAmount: {},
          header,
          records: [],
        },
      ] as const;
    }),
    objectFromEntries
  );

  console.log(
    "[buildInitialRekapanFromValues] Built initial rekapan:",
    JSON.stringify(initialRekapan, null, 2)
  );

  return initialRekapan;
};
