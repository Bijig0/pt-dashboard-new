// import ExcelJS from "exceljs";

// async function readExcelFile() {
//   const workbook = new ExcelJS.Workbook();

//   try {
//     await workbook.xlsx.readFile(
//       "src/script/stok-alat-to-consumable/clean-stok-alat-excel/clean-stok-alat/input/multiple-sheets.xlsx"
//     );
//     const worksheet = workbook.getWorksheet(1); // Get the first worksheet

//     worksheet.eachRow((row, rowNumber) => {
//       console.log(`Row ${rowNumber}: ${row.values[4]}`);
//     });
//   } catch (error) {
//     console.error("Error reading file:", error);
//   }
// }

// readExcelFile();
