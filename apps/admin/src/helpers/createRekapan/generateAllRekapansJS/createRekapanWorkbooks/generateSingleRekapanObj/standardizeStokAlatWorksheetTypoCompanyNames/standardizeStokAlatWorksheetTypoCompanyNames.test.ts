import { SupabaseWorksheetDataSchema } from "../../../../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import {
  CorrectCompanyName,
  TypoCompanyName,
  standardizeStokAlatWorksheetTypoCompanyNames,
} from "./standardizeStokAlatWorksheetTypoCompanyNames";

describe("standardizeStokAlatWorksheetTypoCompanyNames", () => {
  it("should standardize company names based on typo corrections", () => {
    const invertedClusteredTypoCompanyNames: Record<
      TypoCompanyName,
      CorrectCompanyName
    > = {
      "Compny A": "Company A",
      "Compny B": "Company B",
      "Company C": "Company C",
    };

    const stokAlatWorksheetData = [
      { company_name: { name: "Compny A" } },
      { company_name: { name: "Compny B" } },
      { company_name: { name: "Company C" } },
    ] as SupabaseWorksheetDataSchema;

    const expectedOutput = [
      { company_name: { name: "Company A" } },
      { company_name: { name: "Company B" } },
      { company_name: { name: "Company C" } },
    ] as SupabaseWorksheetDataSchema;

    const result = standardizeStokAlatWorksheetTypoCompanyNames(
      invertedClusteredTypoCompanyNames,
      stokAlatWorksheetData
    );

    expect(result).toEqual(expectedOutput);
  });

  //   it("should return the same data if no typos are present", () => {
  //     const invertedClusteredTypoCompanyNames: Record<
  //       TypoCompanyName,
  //       CorrectCompanyName
  //     > = {
  //       "Compny A": "Company A",
  //     };

  //     const stokAlatWorksheetData = [
  //       { company_name: { name: "Company A" } },
  //       { company_name: { name: "Company B" } },
  //       { company_name: { name: "Company C" } },
  //     ] as SupabaseWorksheetDataSchema;

  //     const expectedOutput = [
  //       { company_name: { name: "Company A" } },
  //       { company_name: { name: "Company B" } },
  //       { company_name: { name: "Company C" } },
  //     ] as SupabaseWorksheetDataSchema;

  //     const result = standardizeStokAlatWorksheetTypoCompanyNames(
  //       invertedClusteredTypoCompanyNames,
  //       stokAlatWorksheetData
  //     );

  //     expect(result).toEqual(expectedOutput);
  //   });

  //   it("should handle empty data", () => {
  //     const invertedClusteredTypoCompanyNames: Record<
  //       TypoCompanyName,
  //       CorrectCompanyName
  //     > = {
  //       "Compny A": "Company A",
  //     };

  //     const stokAlatWorksheetData = [] as SupabaseWorksheetDataSchema;

  //     const expectedOutput = [] as SupabaseWorksheetDataSchema;

  //     const result = standardizeStokAlatWorksheetTypoCompanyNames(
  //       invertedClusteredTypoCompanyNames,
  //       stokAlatWorksheetData
  //     );

  //     expect(result).toEqual(expectedOutput);
  //   });

  //   it("should handle empty typo corrections", () => {
  //     const invertedClusteredTypoCompanyNames: Record<
  //       TypoCompanyName,
  //       CorrectCompanyName
  //     > = {};

  //     const stokAlatWorksheetData = [
  //       { company_name: { name: "Compny A" } },
  //       { company_name: { name: "Compny B" } },
  //       { company_name: { name: "Company C" } },
  //     ] as SupabaseWorksheetDataSchema;

  //     const expectedOutput = [
  //       { company_name: { name: "Compny A" } },
  //       { company_name: { name: "Compny B" } },
  //       { company_name: { name: "Company C" } },
  //     ] as SupabaseWorksheetDataSchema;

  //     const result = standardizeStokAlatWorksheetTypoCompanyNames(
  //       invertedClusteredTypoCompanyNames,
  //       stokAlatWorksheetData
  //     );

  //     expect(result).toEqual(expectedOutput);
  //   });
});
