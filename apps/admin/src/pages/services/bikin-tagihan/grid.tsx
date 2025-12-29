import { cleanAGGridColumnName } from "#src/helpers/cleanAGGridColumnName.js";
import { AgGridReact } from "ag-grid-react";
import * as A from "fp-ts/Array";
import { keys } from "fp-ts/lib/Record";
import { flow, pipe } from "fp-ts/lib/function";
import { objectEntries, objectFromEntries } from "ts-extras";
import { checkParsableToDateDDMMYYYY } from "../../../utils/checkParsableToDateDDMMYYYY/checkParsableToDateDDMMYYYY";
import { parseDateDDMMYYYY } from "../../../utils/parseDateDDMMYYYY/parseDateDDMMYYYY";
import ConfirmGenerateTagihanModal from "./confirm-generate-tagihan/confirm-generate-tagihan-modal/confirm-generate-tagihan-modal";
import CreateManualTagihan from "./create-manual-tagihan/create-manual-tagihan";
import { useRekapanContext } from "./rekapan-provider";
import SynchronizeCompanyNamesManager from "./synchronize-company-names-manager/synchronize-company-names-manager";
import { AgGridRow } from "./types";
type AlatName = string;

type ExcelRow = string[];

const convertExcelRowsToAgGridRows = (
  valueRows: ExcelRow[],
  header: ExcelRow
): AgGridRow[] => {
  const result = valueRows.map((valueRow) => {
    const obj: AgGridRow = {};
    valueRow.forEach((value, index) => {
      const associatedHeaderTitle = header[index];
      if (associatedHeaderTitle === undefined)
        throw new Error("Header not found");
      obj[associatedHeaderTitle] = value;
    });
    return obj;
  });
  return result;
};

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

const createColumns = (row: ExcelRow) => {
  const alatNames = row.filter((cell) => cell.toLowerCase() !== "tanggal");
  const columns = [];
  columns.push({
    field: "Tanggal",
    cellDataType: "text",
    cellEditorParams: {
      selectedMonth: 0,
    },
    valueFormatter: (params: any) => {
      if (params.value === null) return null;
      const text = params.value;
      console.log({ text });
      const isValidDateString = checkParsableToDateDDMMYYYY(text);
      console.log({ isValidDateString, text });
      if (!isValidDateString) return text;

      const date = parseDateDDMMYYYY(text);

      console.log({ date });

      const formattedDate = date.format("D MMMM");
      return formattedDate;
    },
  });
  for (const alatName of alatNames) {
    columns.push({
      field: alatName,
      cellEditor: "numericCellEditor",
      cellDataType: "numeric",
    });
  }
  return columns;
};

const Grid = () => {
  const { worksheetData, isLoading, selectedCompanyName, companyNamesList } =
    useRekapanContext();

    

  if (isLoading || !worksheetData) return null;

  const header = worksheetData.header;

  console.log({ header });

  if (!header) return null;

  const colDefs = createColumns(
    pipe(header, keys, A.map(cleanAGGridColumnName))
  );

  console.log({ colDefs });

  console.log({ worksheetData });

  const defaultColfDef = {
    editable: false,
  };

  const cleanWorksheetDataAlatNames = flow(
    objectEntries,
    A.map(([alatName, _]) => [cleanAGGridColumnName(alatName), _] as const),
    objectFromEntries
  );

  const worksheetDataWithoutHeader = [
    cleanWorksheetDataAlatNames(worksheetData.prevBulanTotalSewaAlatAmount),
    ...worksheetData.records.map(cleanWorksheetDataAlatNames),
    cleanWorksheetDataAlatNames(worksheetData.currentBulanTotalSewaAlatAmount),
  ];

  console.log({ colDefs });

  console.log({ worksheetDataWithoutHeader });

  // console.log("TIEROD 0.6M" in worksheetDataWithoutHeader[0]);

  console.log(colDefs.filter((colDef) => colDef.field === "TIEROD 0.6M"));

  const agGridData = worksheetDataWithoutHeader;

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      {/* The AG Grid component */}
      <AgGridReact
        // onGridReady={onGridReady}
        // onCellValueChanged={handleSaveWorksheet}
        rowData={agGridData}
        defaultColDef={defaultColfDef}
        // @ts-ignore
        columnDefs={colDefs}
      />
      <SynchronizeCompanyNamesManager
        excelFileCompanyNames={companyNamesList}
      />
      <ConfirmGenerateTagihanModal
        selectedCompanyName={selectedCompanyName}
        worksheetData={agGridData!}
      />
      <CreateManualTagihan />
    </div>
  );
};

export default Grid;
