import { convertExcelFileToWorkbookFormatted } from "#src/helpers/convertExcelFileToWorkbookFormatted.js";
import { convertExcelJSWorkbookToWorkbookFormatted } from "#src/helpers/convertExcelJSWorkbookToWorkbookFormatted/convertExcelJSWorkbookToWorkbookFormatted.js";
import { groupDataTagihan } from "./group-data-tagihan.js";

describe("group-data-tagihan", () => {
  const groupedInputs = [
    ["2", "3"],
    ["5", "6"],
  ];
  it("should work for the normal one", async () => {
    const inFilePath = "/group-data-tagihan/in/normal.xlsx";

    const workbook = await groupDataTagihan({
      groupedInputs,
      inputWorkbookFilePath: inFilePath,
    });

    const resultAsWorkbookFormatted =
      await convertExcelJSWorkbookToWorkbookFormatted(workbook);

    const dirname = new URL(".", import.meta.url).pathname;
    const excelExpectedFilePath = "/out/normal-grouped.xlsx";

    const expectedWorkbookFormatted = await convertExcelFileToWorkbookFormatted(
      {
        dirname,
        path: excelExpectedFilePath,
      }
    );

    expect(resultAsWorkbookFormatted).toEqual(expectedWorkbookFormatted);
    expect(expectedWorkbookFormatted).toMatchSnapshot();

    // workbook.xlsx.writeFile(path);
  });
});
