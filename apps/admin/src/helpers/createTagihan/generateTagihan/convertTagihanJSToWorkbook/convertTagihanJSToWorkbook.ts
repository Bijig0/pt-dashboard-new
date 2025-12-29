import ExcelJS, { Workbook } from "exceljs";
import { TagihanJS } from "../../types";
import { createHargaSewaToDisplay } from "./createHargaSewaToDisplay/createHargaSewaToDisplay";
import { createLamaSewa } from "./createLamaSewa/createLamaSewa";

export const convertTagihanJSToWorkbook = (
  input: TagihanJS
): ExcelJS.Workbook => {
  const initializeWorkbook = (rekapanName: string): Workbook => {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet(rekapanName);
    return workbook;
  };

  const resizeWorksheetColumnWidth = (worksheet: ExcelJS.Worksheet) => {
    worksheet.getColumn("A").width = 25;
    worksheet.getColumn("B").width = 35;
    worksheet.getColumn("C").width = 25;
    worksheet.getColumn("C").width = 15;
    worksheet.getColumn("E").width = 15;
    worksheet.getColumn("G").width = 15;
  };

  const writeHeadersBuffer = (worksheet: ExcelJS.Worksheet) => {
    const bufferLength = 3;
    for (let i = 0; i < bufferLength; i++) {
      worksheet.addRows([null]);
    }
  };

  const writeHeaders = (worksheet: ExcelJS.Worksheet) => {
    worksheet.addRow([
      "NAMA ALAT",
      "PERIODE",
      "LAMA SEWA",
      "JUMLAH ALAT",
      "HARGA SEWA",
      "TOTAL",
      "SUBTOTAL",
    ]);
  };

  const writeTagihanRecords = (worksheet: ExcelJS.Worksheet) => {
    for (const [alatName, alatDetails] of Object.entries(input.data)) {
      const records = alatDetails.records;
      const newRecords = records.map((record) => {
        const periode = `${record.tanggalRange.start} - ${record.tanggalRange.end}`;
        const lamaSewa = createLamaSewa(record.days, record.tanggalRange.start);
        const jumlahAlat = record.jumlah;
        console.dir(
          {
            record,
            hargaBulanan: alatDetails.hargaBulanan,
            hargaHarian: alatDetails.hargaHarian,
          },
          { depth: null }
        );
        const hargaSewa = createHargaSewaToDisplay({
          hargaBulanan: alatDetails.hargaBulanan,
          hargaHarian: alatDetails.hargaHarian,
          record,
        });
        console.log({ hargaSewa });
        const total = record.totalSubtotal;
        return [null, periode, lamaSewa, jumlahAlat, hargaSewa, total, null];
      });

      if (newRecords[0] === undefined) throw new Error("No records");

      newRecords[0][0] = alatName;

      if (newRecords[newRecords.length - 1] === undefined)
        throw new Error("No records");

      newRecords[newRecords.length - 1]![6] = alatDetails.recordsSubtotal;

      const bulananSewaAmount = `Sewa=${alatDetails.hargaBulanan}`;
      if (newRecords.length >= 2) {
        if (newRecords[1] === undefined) throw new Error("No records");
        newRecords[1][0] = bulananSewaAmount;
      }
      worksheet.addRows(newRecords);

      if (newRecords.length < 2) {
        worksheet.addRow([
          bulananSewaAmount,
          null,
          null,
          null,
          null,
          null,
          null,
        ]);
      }
      worksheet.addRow([null, null, null, null, null, null, null]);
    }
  };

  const writeTotals = (worksheet: ExcelJS.Worksheet) => {
    worksheet.addRow([
      "Jumlah",
      null,
      null,
      null,
      null,
      input.total,
      input.total,
    ]);
    worksheet.addRow(["PPN", null, null, null, null, null, input.ppn]);
    worksheet.addRow([
      "Total",
      null,
      null,
      null,
      null,
      null,
      input.totalAfterPPN,
    ]);

    return worksheet;
  };

  const workbook = initializeWorkbook("FEBRI");
  const worksheet = workbook.getWorksheet("FEBRI")!;

  resizeWorksheetColumnWidth(worksheet);
  writeHeadersBuffer(worksheet);
  writeHeaders(worksheet);
  writeTagihanRecords(worksheet);
  writeTotals(worksheet);

  return workbook;
};

// @ts-ignore
if (import.meta.main) {
  const mockData = {
    data: {
      Alat1: {
        records: [
          {
            tanggalRange: {
              start: "01/07/2024",
              end: "31/07/2024",
            },
            days: 31,
            jumlah: 1,
            totalSubtotal: 13950,
          },
        ],
        hargaBulanan: 450,
        hargaHarian: 15,
        recordsSubtotal: 13950,
      },
      Alat2: {
        records: [
          {
            tanggalRange: {
              start: "05/07/2024",
              end: "31/07/2024",
            },
            days: 27,
            jumlah: 2,
            totalSubtotal: 8640,
          },
        ],
        hargaBulanan: 160,
        hargaHarian: 3.33,
        recordsSubtotal: 8640,
      },
    },
    total: 22590,
    ppn: 100,
    totalAfterPPN: 22490,
  } satisfies TagihanJS;

  const result = convertTagihanJSToWorkbook(mockData);

  const OUTFILE_PATH = `src/helpers/createTagihan/convertTagihanJSToWorkbook/mockData/excel-files/`;

  result.xlsx.writeFile(
    `${OUTFILE_PATH}/convertTagihanJSToWorkbook-multiple-alats-multiple-records-each.xlsx`
  );
}
