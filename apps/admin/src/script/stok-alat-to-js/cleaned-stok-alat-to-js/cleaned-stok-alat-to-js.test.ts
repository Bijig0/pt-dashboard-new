import dayjs from "dayjs";
import ExcelJS from "exceljs";
import { beforeEach, describe, expect, it, vi } from "vitest";
import * as StokAlatSchemaModule from "../stok-alat-schema/stok-alat-schema";
import { cleanedStokAlatToJS } from "./cleaned-stok-alat-to-js";

// Mock the StokAlatSchema for simplicity
vi.mock("../stok-alat-schema/stok-alat-schema", () => ({
  StokAlatSchema: {
    parse: vi.fn(),
  },
}));

describe("cleanedStokAlatToJS", () => {
  let workbook: ExcelJS.Workbook;

  beforeEach(() => {
    workbook = new ExcelJS.Workbook();
    vi.clearAllMocks();
  });

  it("should convert a workbook to an array of stokAlat objects", () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(["tanggal", "company_name", "masuk", "keluar"]);
    worksheet.addRow([new Date("2024-08-09"), "Company A", 10, null]);
    worksheet.addRow([new Date("2024-08-10"), "Company B", null, 20]);

    // Mock the schema parsing
    // @ts-ignore
    StokAlatSchemaModule.StokAlatSchema.parse.mockImplementation(
      // @ts-ignore
      (rowValues) => {
        const [date, company, masuk, keluar] = rowValues.slice(1); // Extract the relevant values
        return { date, company, masuk, keluar };
      }
    );

    const result = cleanedStokAlatToJS({ workbook, alatName: "Alat X" });

    expect(result.stokAlat).toEqual([
      {
        alat_name: "Alat X",
        company_name: "Company A",
        keluar: null,
        masuk: 10,
        tanggal: dayjs.utc(new Date("2024-08-09")).format("YYYY-MM-DD"),
      },
      {
        alat_name: "Alat X",
        company_name: "Company B",
        keluar: 20,
        masuk: null,
        tanggal: dayjs.utc(new Date("2024-08-10")).format("YYYY-MM-DD"),
      },
    ]);

    expect(StokAlatSchemaModule.StokAlatSchema.parse).toHaveBeenCalledTimes(2);
  });

  it("should handle an empty workbook correctly", () => {
    const result = cleanedStokAlatToJS({ workbook, alatName: "Alat X" });

    expect(result.stokAlat).toEqual([]); // Expecting an empty array
    expect(StokAlatSchemaModule.StokAlatSchema.parse).not.toHaveBeenCalled();
  });

  it("should handle a workbook with only a header row", () => {
    const worksheet = workbook.addWorksheet("Sheet1");
    worksheet.addRow(["tanggal", "company_name", "masuk", "keluar"]);

    const result = cleanedStokAlatToJS({ workbook, alatName: "Alat X" });

    expect(result.stokAlat).toEqual([]); // Expecting an empty array
    expect(StokAlatSchemaModule.StokAlatSchema.parse).not.toHaveBeenCalled();
  });
});
