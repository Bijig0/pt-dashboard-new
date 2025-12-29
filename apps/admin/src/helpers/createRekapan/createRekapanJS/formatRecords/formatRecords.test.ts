import { SupabaseWorksheetDataSchema } from "../../../../pages/services/first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";
import formatRecords from "./formatRecords";

describe("formatRecords", () => {
  it("should format records correctly", () => {
    const records: SupabaseWorksheetDataSchema = [
      {
        tanggal: "01/01/2024",
        masuk: 10,
        keluar: null,
        company_name: { name: "Company A" },
        alat_name: { name: "Alat 1" },
      },
      {
        tanggal: "02/01/2024",
        masuk: null,
        keluar: 5,
        company_name: { name: "Company B" },
        alat_name: { name: "Alat 2" },
      },
      {
        tanggal: "01/01/2024",
        masuk: 0,
        keluar: 5,
        company_name: { name: "Company A" },
        alat_name: { name: "Alat 1" },
      },
    ];

    const expected = [
      {
        companyName: "Company A",
        alatName: "Alat 1",
        masuk: -10,
        keluar: 0,
        tanggal: "01/01/2024",
        stokDifference: -10,
      },
      {
        companyName: "Company B",
        alatName: "Alat 2",
        masuk: 0,
        keluar: 5,
        tanggal: "02/01/2024",
        stokDifference: 5,
      },
      {
        companyName: "Company A",
        alatName: "Alat 1",
        masuk: 0,
        keluar: 5,
        tanggal: "01/01/2024",
        stokDifference: 5,
      },
    ];

    const result = formatRecords(records);
    expect(result).toEqual(expected);
  });
});
