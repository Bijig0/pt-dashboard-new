import { createExcelExpectedFilePath } from "#src/helpers/createExcelExpectedFilePath/createExcelExpectedFilePath.js";
import * as ExcelFileToExcelJsModule from "#src/helpers/excelFileToExcelJs.js";
import { fromPartial } from "@total-typescript/shoehorn";
import ExcelJS from "exceljs";
import { beforeEach, describe, test, vi } from "vitest";
import { validateNewStokAlat } from "../validateNewStokAlat";

/**
 * Scenarios:
 *
 * 1. Ok so excel file with cut off gets cleaned
 * All th rrors are shown
 * Dates are fixed at least a little bit
 * -
 *
 * Should add a thing to just say add this as a company name
 */

describe("processExcelFile", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // describe("error cases", () => {
  //   it("should go badly for a bad file", () => {});
  // });

  // test("should process Excel file and return cell values", async () => {
  //   const dirname = new URL(".", import.meta.url).pathname;
  //   const excelExpectedFilePath = "/in/STOK ALAT 2018 uncleaned.xlsx";
  //   const filePath = createExcelExpectedFilePath({
  //     dirname,
  //     path: excelExpectedFilePath,
  //   });
  //   const workbook = new ExcelJS.Workbook();
  //   await workbook.xlsx.readFile(filePath);

  //   const excelFileToExcelJsSpy = vi
  //     .spyOn(ExcelFileToExcelJsModule, "excelFileToExcelJs")
  //     .mockResolvedValue(workbook);

  //   const result = await validateNewStokAlat(
  //     fromPartial({
  //       stokAlatFile: {},
  //       allowedCompanyNames: [],
  //     })
  //   );

  //   console.dir({ result }, { depth: null });
  // });

  test.todo("should work with the regular excel files", async () => {
    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath = "/in/normal.xlsx";
    const filePath = createExcelExpectedFilePath({
      dirname,
      path: excelExpectedFilePath,
    });
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(filePath);

    const excelFileToExcelJsSpy = vi
      .spyOn(ExcelFileToExcelJsModule, "excelFileToExcelJs")
      .mockResolvedValue(workbook);

    const { data } = await validateNewStokAlat(
      fromPartial({
        stokAlatFile: {},
        allowedCompanyNames: [],
      })
    );

    expect(data).toBeDefined();
  });
});
