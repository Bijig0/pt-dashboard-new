import ExcelJS, { Row } from "exceljs";

export const getAllRows = (worksheet: ExcelJS.Worksheet): Row[] => {
  const rows: Row[] = [];

  worksheet.eachRow((row) => {
    console.log({ row: row.values });
    // @ts-ignore
    rows.push(row.values);
  });

  return rows;
};
