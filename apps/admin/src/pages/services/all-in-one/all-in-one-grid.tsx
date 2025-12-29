import { usePrevious } from "@uidotdev/usehooks";
import { AgGridReact } from "ag-grid-react";
import ExcelJS from "exceljs";
import { Button, FileInput, Label } from "flowbite-react";
import clone from "just-clone";
import {
  ChangeEvent,
  ForwardedRef,
  forwardRef,
  useEffect,
  useState,
} from "react";
import { useInterval } from "usehooks-ts";
import DateStringEditor from "../../../components/DateStringEditor";
import PositiveIntegerEditor from "../../../components/PositiveIntegerEditor";
import { useLocale } from "../../../context/LocaleContext";
import { useToastContext } from "../../../context/ToastContext";
import getFromLocalStorage from "../../../helpers/auth/getFromLocalStorage";
import setToLocalStorage from "../../../helpers/auth/setToLocalStorage";
import downloadExcelFile from "../../../helpers/downloadExcelFile";
import yyyy_mm_dd_formatDate from "../../../helpers/yyyy_mm_dd_formatDate";
import useAddRowsAutomatically from "../../../hooks/useAddRowsAutomatically";
import useGetCompanyNames from "../../../hooks/useGetCompanyNames";
import useGetWorksheetData from "../../../hooks/useGetWorksheetData";
import { supabase } from "../../../supabase";
import { Row } from "../../../types/globals";
import { WorksheetDataSchema } from "../../../types/schemas";
import { supabaseWorksheetDataSchema } from "../first-one/getCurrentMonthStokAlatData/supabaseWorksheetDataSchema/supabaseWorksheetDataSchema";

type MyGridProps = {
  worksheetName: string;
  selectedDate: Date;
};

const retrieveWorksheetLocally = (worksheetName: string) => {
  const stringifiedWorksheet = getFromLocalStorage(worksheetName);
  if (!stringifiedWorksheet) return;
  const worksheet = JSON.parse(stringifiedWorksheet);
  return worksheet;
};

const saveWorkbookLocally = (worksheetName: string, worksheetData: any) => {
  const stringifiedWorksheetData = JSON.stringify(worksheetData);
  setToLocalStorage(worksheetName, stringifiedWorksheetData);
};

const useSaveWorkbookLocally = (worksheetName: string, worksheetData: any) => {
  useInterval(() => {
    saveWorkbookLocally(worksheetName, worksheetData);
  }, 1000);
};
const MyGrid = (
  props: MyGridProps,
  gridRef: ForwardedRef<AgGridReact<Row>>
) => {
  const { t } = useLocale();
  const { data: companyNames, isLoading: isFetchingCompanyNames } =
    useGetCompanyNames();

  const colDefs = [
    {
      field: "tanggal",
      cellDataType: "dateString",
      cellEditor: DateStringEditor,
      cellEditorParams: {
        selectedMonth: 0,
      },
      valueFormatter: (params) => {
        if (params.value === null) return null;

        const date = new Date(params.value);
        const formattedDate = date.toLocaleString("en-GB", {
          day: "numeric",
          month: "long",
        });
        return formattedDate;
      },
    },
    {
      headerName: "Company Name",
      field: "company_name",
      cellDataType: "text",
      valueFormatter: (params) => {
        if (params.value === null) return params.value;
        if (!companyNames?.includes(params.value)) return "TYPO FOUND";
        return params.value;
      },
    },
    {
      field: "masuk",
      cellDataType: "number",
      cellEditor: PositiveIntegerEditor,
      width: 200,
    },
    {
      field: "keluar",
      cellDataType: "number",
      cellEditor: PositiveIntegerEditor,
    },
  ];

  const { worksheetName, selectedDate } = props;

  const previousWorksheetName = usePrevious(worksheetName);
  const previousDate = usePrevious(selectedDate);

  const [enabled, setEnabled] = useState(true);

  // only refetch if worksheetName has changed or init is false

  const {
    data: remoteWorksheetData,
    isLoading: isFetchingWorksheetDataRemotely,
    error,
  } = useGetWorksheetData(worksheetName, selectedDate, enabled);

  if (error) throw error;

  const emptyRemoteWorksheetData =
    !isFetchingWorksheetDataRemotely && !remoteWorksheetData;

  const worksheetData = emptyRemoteWorksheetData
    ? retrieveWorksheetLocally(worksheetName)
    : remoteWorksheetData;

  useEffect(() => {
    //
    const worksheetChanged =
      worksheetName !== previousWorksheetName && previousWorksheetName !== null;

    const selectedDateChanged =
      selectedDate !== previousDate && previousDate !== null;

    const allowRefetch = () => setEnabled(true);

    if (worksheetChanged || selectedDateChanged) {
      allowRefetch();
      return;
    }
  }, [selectedDate, worksheetName]);

  useEffect(() => {
    if (worksheetData) {
      setEnabled(false);
    }
  }, [worksheetData]);

  const [gridApi, setGridApi] = useState<any>(null);

  const getAllRows = () => {
    if (gridApi === null) return;
    let rowData: WorksheetDataSchema = [];
    gridApi.forEachNode((node: any) => rowData.push(node.data as Row));
    return rowData;
  };

  useSaveWorkbookLocally(props.worksheetName, getAllRows());

  useAddRowsAutomatically(worksheetName, worksheetData, gridRef);

  const defaultColfDef = {
    editable: true,
  };

  const cleanRows = (rows: WorksheetDataSchema): WorksheetDataSchema => {
    const truncateRows = (rows: WorksheetDataSchema): WorksheetDataSchema => {
      const rowsCopy = clone(rows);
      const finalLength = rowsCopy.length;
      let toTruncateCounter = 0;

      const rowsCopyToReversed = clone(rows);
      rowsCopyToReversed.reverse();

      for (const row of rowsCopyToReversed) {
        const rowAsArray = Object.entries(row);
        const isEmptyRow = rowAsArray.every(([key, value]) => {
          if (key === "alat_name") {
            console.assert(value !== null);
            return true;
          }
          return value === null;
        });
        if (isEmptyRow) toTruncateCounter++;
        if (!isEmptyRow) break;
      }
      const endTruncateAt = finalLength - toTruncateCounter;
      const truncatedRows = rowsCopy.slice(0, endTruncateAt);
      return truncatedRows;
    };
    const truncatedRows = truncateRows(rows);

    return truncatedRows;
  };

  type WorksheetDataAsColumns = {
    tanggal: string[];
    company_names: string[];
    alat_names: string[];
    masuk: number[];
    keluar: number[];
  };

  function convertRowsToColumns(data: WorksheetDataSchema) {
    return data.reduce(
      (accumulator: WorksheetDataAsColumns, currentValue) => {
        accumulator.tanggal.push(currentValue.tanggal);
        accumulator.company_names.push(currentValue.company_name);
        accumulator.alat_names.push(currentValue.alat_name);
        accumulator.masuk.push(currentValue.masuk ?? 0);
        accumulator.keluar.push(currentValue.keluar ?? 0);
        return accumulator;
      },
      {
        tanggal: [],
        company_names: [],
        alat_names: [],
        masuk: [],
        keluar: [],
      } satisfies WorksheetDataAsColumns
    );
  }

  const [saveState, setSaveState] = useState<SaveState>("Not Saved");

  const { showToast } = useToastContext();

  const handleSaveWorksheet = async () => {
    if (!worksheetData) throw new Error("Worksheet data not found");
    try {
      setSaveState("Saving");
      showToast("loading", "Saving worksheet");
      const allRows = getAllRows();

      // Validate for mutual exclusivity BEFORE processing
      const invalidRows = allRows.filter((row) => {
        const masukValue = row.masuk ?? 0;
        const keluarValue = row.keluar ?? 0;
        return masukValue > 0 && keluarValue > 0;
      });

      if (invalidRows.length > 0) {
        setSaveState("Not Saved");
        showToast(
          "error",
          `${t.validation.cannotSave} ${invalidRows.length} ${t.validation.rowsWithBothValues}`
        );
        return; // Abort save
      }

      const cleanedRows = cleanRows(allRows);
      const columns = convertRowsToColumns(cleanedRows);

      const { error } = await supabase.rpc("save_worksheet", {
        alat_name: worksheetName,
        ...columns,
      });
      if (error) throw error;
      setSaveState("Saved");
      showToast("success", "Worksheet saved successfully");
    } catch (error) {
      setSaveState("Error Saving");
      saveWorkbookLocally(worksheetName, worksheetData);
      showToast(
        "error",
        "Worksheet failed to save online, saving locally, reconnect to internet ASAP to prevent loss of data, also might be empty or invalid tanggal / company name please fix "
      );
    } finally {
      setTimeout(() => {
        setSaveState("Not Saved");
      }, 5000);
    }
  };

  const uploadReportRemotely = async (workbook: ExcelJS.Workbook) => {
    const buffer = await workbook.xlsx.writeBuffer();
    const formattedSelectedDate = yyyy_mm_dd_formatDate(selectedDate);
    const { data, error } = await supabase.storage
      .from("pt-backend")
      .update(`rekenings/${formattedSelectedDate}.xlsx`, buffer, {
        contentType:
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        upsert: true,
      });
  };

  const handleGenerateReport = async () => {
    const { data, error } = await supabase
      .from("record")
      .select(
        "id,masuk,keluar,tanggal,alat_name:alat (name),company_name:company (name)"
      );

    if (error) throw error;

    const parsedData = supabaseWorksheetDataSchema.parse(data);

    // const report = generateReport(parsedData);

    // downloadExcelFile(report, "output.xlsx");

    // uploadReportRemotely(report);
  };

  const handleDownloadAsExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    workbook.addWorksheet("Sheet1");
    const sheet = workbook.getWorksheet("Sheet1");

    sheet?.addRows(
      worksheetData.map((row) => [
        row.tanggal,
        row.company_name,
        row.masuk,
        row.keluar,
      ])
    );
    downloadExcelFile(workbook, "output.xlsx");
  };

  const [fileToImport, setfileToImport] = useState(undefined);

  const handleImportFromExcel = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = event.target.files;
    if (fileList?.length === 0 || fileList === null)
      throw new Error("No file was entered");

    function readFile(fileRes) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(fileRes);
        reader.onload = () => {
          resolve(reader.result);
        };
      });
    }

    const fileRes = fileList[0];

    if (fileRes === undefined) throw new Error("File is undefined");
    const buffer = await readFile(fileRes);
    const workbook = new ExcelJS.Workbook();
    const excelFile = await workbook.xlsx.load(buffer as Buffer);
    const sheetName = excelFile.worksheets[0]!.name;
    const sheet = await excelFile.getWorksheet(sheetName)!;
    sheet.eachRow(function (row, rowNumber) {});
  };

  const isLoading = isFetchingCompanyNames || isFetchingWorksheetDataRemotely;

  if (isLoading) return null;

  return (
    <div className="ag-theme-quartz" style={{ height: 500 }}>
      {/* The AG Grid component */}
      <AgGridReact
        loadingCellRenderer={LoadingSpinner}
        loadingCellRendererParams={"Is Loading"}
        // onGridReady={onGridReady}
        onCellValueChanged={handleSaveWorksheet}
        ref={gridRef}
        rowData={worksheetData}
        defaultColDef={defaultColfDef}
        columnDefs={colDefs}
      />
      <div className="my-4"></div>

      <SaveWorksheetButton
        handleSaveWorksheet={handleSaveWorksheet}
        saveState={saveState}
      />

      <div className="my-2"></div>
      <Button onClick={() => handleGenerateReport()}>Generate report</Button>
      <div className="my-2"></div>
      <div>
        <div className="mb-2 block">
          <Label
            className="cursor-pointer"
            htmlFor="file-upload"
            value="Upload file"
          />
        </div>
        <FileInput onChange={handleImportFromExcel} id="file-upload" />
        <Button onClick={handleDownloadAsExcel}>Download as Excel</Button>
      </div>
    </div>
  );
};

type SaveState = "Not Saved" | "Saving" | "Saved" | "Error Saving";

type SaveWorksheetButtonProps = {
  handleSaveWorksheet: () => any;
  saveState: SaveState;
};

const SaveWorksheetButton = (props: SaveWorksheetButtonProps) => {
  const { handleSaveWorksheet, saveState } = props;
  return (
    <>
      <Button onClick={handleSaveWorksheet}>
        {saveState === "Saving" ? <LoadingSpinner /> : "Save worksheet"}
      </Button>
    </>
  );
};

const LoadingSpinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

export default forwardRef<AgGridReact<Row>, MyGridProps>(MyGrid);
