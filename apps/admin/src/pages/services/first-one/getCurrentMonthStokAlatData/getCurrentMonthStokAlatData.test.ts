import { beforeEach, describe, expect, it, vi } from "vitest";
import { supabase } from "../../../../supabase";
import { getCurrentMonthStokAlatData } from "./getCurrentMonthStokAlatData";

// Mock the Supabase client
vi.mock("../../../../supabase", () => ({
  supabase: {
    from: vi.fn(),
  },
}));

describe("getCurrentMonthStokAlatData", () => {
  const rekapanToCreateDate = new Date("2023-12-01");

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("fetches and parses data correctly for the current month", async () => {
    const mockData = [
      {
        tanggal: "2023-12-25",
        masuk: 123,
        keluar: 456,
        company_name: "Company A",
        alat_name: "Alat A",
      },
      {
        tanggal: "2023-12-01",
        masuk: 789,
        keluar: 101,
        company_name: "Company B",
        alat_name: "Alat B",
      },
    ];

    // @ts-ignore
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ data: mockData, error: null }),
    });

    const result = await getCurrentMonthStokAlatData(rekapanToCreateDate);

    expect(result).toEqual([
      {
        tanggal: "25/12/2023",
        masuk: 123,
        keluar: 456,
        company_name: { name: "Company A" },
        alat_name: { name: "Alat A" },
      },
      {
        tanggal: "01/12/2023",
        masuk: 789,
        keluar: 101,
        company_name: { name: "Company B" },
        alat_name: { name: "Alat B" },
      },
    ]);

    expect(supabase.from).toHaveBeenCalledWith("record");
    // @ts-ignore
    expect(supabase.from().select).toHaveBeenCalledWith(
      "masuk,keluar,company_name,alat_name,tanggal"
    );
    // @ts-ignore
    expect(supabase.from().gte).toHaveBeenCalledWith(
      "tanggal",
      "2023-12-01T00:00:00.000Z"
    );
    // @ts-ignore
    expect(supabase.from().lte).toHaveBeenCalledWith(
      "tanggal",
      "2023-12-31T23:59:59.999Z"
    );
  });

  it("throws an error if Supabase query fails", async () => {
    const mockError = new Error("Supabase query failed");

    // @ts-ignore
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ data: null, error: mockError }),
    });

    await expect(
      getCurrentMonthStokAlatData(rekapanToCreateDate)
    ).rejects.toThrow("Supabase query failed");
  });

  it("handles empty data response correctly", async () => {
    // @ts-ignore
    supabase.from.mockReturnValue({
      select: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lte: vi.fn().mockResolvedValue({ data: [], error: null }),
    });

    const result = await getCurrentMonthStokAlatData(rekapanToCreateDate);

    expect(result).toEqual([]);
  });
});
