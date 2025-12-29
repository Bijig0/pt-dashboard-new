import ExcelJS, { Row } from "exceljs";

export const getAllRows = (worksheet: ExcelJS.Worksheet): Row[] => {
  const rows: Row[] = [];

  worksheet.eachRow((row) => {
    // @ts-ignore
    rows.push(row.values);
  });

  return rows;
};
