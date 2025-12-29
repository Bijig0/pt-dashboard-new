import { describe, expect, it, vi } from "vitest";
import { getMonthRange } from "./getMonthRange/getMonthRange";
import { getSupabaseWorksheetData } from "./getSupabaseWorksheetData/getSupabaseWorksheetData";
import { getWorksheetData } from "./getWorksheetData";

vi.mock("./getSupabaseWorksheetData/getSupabaseWorksheetData");
vi.mock("./getMonthRange/getMonthRange");

describe("getWorksheetData", () => {
  // Postgres/Supabase tanggal format is YYYY-MM-DD
  const mockData = [
    {
      masuk: 1,
      keluar: 2,
      tanggal: "2023-01-15",
      company_name: "Company A",
      alat_name: "Alat A",
    },
    {
      masuk: 3,
      keluar: 4,
      tanggal: "2023-01-16",
      company_name: "Company B",
      alat_name: "Alat A",
    },
  ];

  it("should return parsed data correctly", async () => {
    const alatName = "Alat A";
    const date = new Date("2022-12-31");

    (getSupabaseWorksheetData as any).mockResolvedValue({
      data: mockData,
      error: null,
    });

    (getMonthRange as any).mockReturnValue({
      startOfNextMonth: "2023-01-01T00:00:00.000Z",
      endOfNextMonth: "2023-01-31T23:59:59.999Z",
    });

    const result = await getWorksheetData(alatName, date);

    expect(result).toEqual([
      {
        masuk: 1,
        keluar: 2,
        tanggal: "15/01/2023",
        company_name: "Company A",
        alat_name: "Alat A",
      },
      {
        masuk: 3,
        keluar: 4,
        tanggal: "16/01/2023",
        company_name: "Company B",
        alat_name: "Alat A",
      },
    ]);
  });

  it("should correctly transform the tanggal from YYYY-MM-DD to DD/MM/YYYY", async () => {
    const alatName = "Alat A";
    const date = new Date("2022-12-31");

    (getSupabaseWorksheetData as any).mockResolvedValue({
      data: mockData,
      error: null,
    });

    (getMonthRange as any).mockReturnValue({
      startOfNextMonth: "2023-01-01T00:00:00.000Z",
      endOfNextMonth: "2023-01-31T23:59:59.999Z",
    });

    const result = await getWorksheetData(alatName, date);

    expect(result).toEqual([
      {
        masuk: 1,
        keluar: 2,
        tanggal: "15/01/2023",
        company_name: "Company A",
        alat_name: "Alat A",
      },
      {
        masuk: 3,
        keluar: 4,
        tanggal: "16/01/2023",
        company_name: "Company B",
        alat_name: "Alat A",
      },
    ]);
  });

  it("should throw an error when getSupabaseWorksheetData returns an error", async () => {
    const alatName = "Alat A";
    const date = new Date("2022-12-31");

    (getSupabaseWorksheetData as any).mockResolvedValue({
      data: null,
      error: new Error("Test error"),
    });

    (getMonthRange as any).mockReturnValue({
      startOfNextMonth: "2023-01-01T00:00:00.000Z",
      endOfNextMonth: "2023-01-31T23:59:59.999Z",
    });

    await expect(getWorksheetData(alatName, date)).rejects.toThrow();
  });

  it("should return data with actual getMonthRange implementation", async () => {
    const alatName = "Alat A";
    const date = new Date("2022-12-31");

    vi.unmock("./getMonthRange");

    (getSupabaseWorksheetData as any).mockResolvedValue({
      data: mockData,
      error: null,
    });

    const result = await getWorksheetData(alatName, date);

    expect(result).toEqual([
      {
        masuk: 1,
        keluar: 2,
        tanggal: "15/01/2023",
        company_name: "Company A",
        alat_name: "Alat A",
      },
      {
        masuk: 3,
        keluar: 4,
        tanggal: "16/01/2023",
        company_name: "Company B",
        alat_name: "Alat A",
      },
    ]);

    vi.mock("./getMonthRange");
  });
});
