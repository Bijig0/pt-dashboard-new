import { AgGridReact } from "ag-grid-react";
import dayjs from "dayjs";
import { Button, Label } from "flowbite-react";
import clone from "just-clone";
import { ForwardedRef, forwardRef, useImperativeHandle, useRef, useState } from "react";
import { useInterval } from "usehooks-ts";
import { useLocale } from "../../../../context/LocaleContext";
import { useToastContext } from "../../../../context/ToastContext";
import getFromLocalStorage from "../../../../helpers/auth/getFromLocalStorage";
import setToLocalStorage from "../../../../helpers/auth/setToLocalStorage";
import useAddRowsAutomatically from "../../../../hooks/useAddRowsAutomatically";
import { useGetCompanyNames } from "../../../../hooks/useGetCompanyNames";
import useGetWorksheetData from "../../../../hooks/useGetWorksheetData";
import { supabase } from "../../../../supabase";
import { Row } from "../../../../types/globals";
import { WorksheetDataSchema } from "../../../../types/schemas";
import AddNewStokAlatFromExcel from "../metadata-sidebar/add-new-stok-alat-from-excel/add-new-stok-alat-from-excel";
import { createColDefs, defaultColfDef } from "./colDefs";

export type SaveState = "Not Saved" | "Saving" | "Saved" | "Error Saving";

export type MyGridRef = {
  gridRef: AgGridReact<Row> | null;
  handleSaveWorksheet: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  getGridData: () => Row[] | undefined;
};

type MyGridProps = {
  worksheetName: string;
  selectedDate: Date;
  onSaveStateChange?: (state: SaveState) => void;
  disabled?: boolean;
};

const retrieveWorksheetLocally = (worksheetName: string) => {
  const stringifiedWorksheet = getFromLocalStorage(worksheetName);
  if (!stringifiedWorksheet) return;
  if (stringifiedWorksheet === "undefined") return [];
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
  ref: ForwardedRef<MyGridRef>
) => {
  const { t } = useLocale();
  const { data: companyNames, isLoading: isFetchingCompanyNames } =
    useGetCompanyNames();

  const { worksheetName, selectedDate, disabled = false } = props;

  const colDefs = createColDefs({ companyNames, selectedDate });

  const [gridApi, setGridApi] = useState<any>(null);
  const internalGridRef = useRef<AgGridReact<Row>>(null);

  // only refetch if worksheetName has changed or init is false

  const {
    data: remoteWorksheetData,
    isLoading: isFetchingWorksheetDataRemotely,
    error,
  } = useGetWorksheetData(worksheetName, selectedDate);

  console.log({ remoteWorksheetData, isFetchingWorksheetDataRemotely, error });

  if (error) throw error;

  const emptyRemoteWorksheetData =
    !isFetchingWorksheetDataRemotely && !remoteWorksheetData;

  // const worksheetData = emptyRemoteWorksheetData
  //   ? retrieveWorksheetLocally(worksheetName)
  //   : remoteWorksheetData;

  const worksheetData = remoteWorksheetData;

  const getAllRows = () => {
    if (gridApi === null) return;
    let rowData: WorksheetDataSchema = [];
    gridApi.forEachNode((node: any) => rowData.push(node.data as Row));
    return rowData;
  };

  // useSaveWorkbookLocally(props.worksheetName, getAllRows());

  useAddRowsAutomatically(worksheetName, worksheetData, internalGridRef);

  // lol clean this use fp-ts or some functional way lmao wtf bro
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

  // Don't understand this but it's also ugly as fuck lol

  function convertRowsToColumns(data: WorksheetDataSchema) {
    return data.reduce(
      (accumulator: WorksheetDataAsColumns, currentValue) => {
        // Convert tanggal from DD/MM/YYYY to YYYY-MM-DD format for database
        const tanggalInDDMMYYYY = currentValue.tanggal;
        const tanggalInYYYYMMDD = dayjs(tanggalInDDMMYYYY, "DD/MM/YYYY").format("YYYY-MM-DD");
        accumulator.tanggal.push(tanggalInYYYYMMDD);
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

  const updateSaveState = (state: SaveState) => {
    setSaveState(state);
    props.onSaveStateChange?.(state);
  };

  const { showToast } = useToastContext();

  const handleSaveWorksheet = async () => {
    if (!worksheetData) throw new Error("Worksheet data not found");
    try {
      updateSaveState("Saving");
      showToast("loading", "Saving worksheet");
      const allRows = getAllRows();
      console.log("DEBUG: All rows from grid:", allRows);
      if (!allRows) throw new Error("No rows found");

      // Validate for mutual exclusivity BEFORE processing
      const mutualExclusivityRows = allRows.filter((row) => {
        const masukValue = row.masuk ?? 0;
        const keluarValue = row.keluar ?? 0;
        return masukValue > 0 && keluarValue > 0;
      });

      if (mutualExclusivityRows.length > 0) {
        updateSaveState("Not Saved");
        showToast(
          "error",
          `${t.validation.cannotSave} ${mutualExclusivityRows.length} ${t.validation.rowsWithBothValues}`
        );
        return; // Abort save
      }

      // Validate for unregistered companies BEFORE processing
      const unregisteredCompanyRows = allRows.filter((row) => {
        const companyName = row.company_name;
        return companyName && !companyNames?.includes(companyName);
      });

      if (unregisteredCompanyRows.length > 0) {
        updateSaveState("Not Saved");
        const companyNamesList = unregisteredCompanyRows
          .map((row) => row.company_name)
          .filter((name, index, self) => self.indexOf(name) === index)
          .join(", ");
        showToast(
          "error",
          `Cannot save: ${unregisteredCompanyRows.length} row(s) have unregistered company names (${companyNamesList}). Please register these companies or fix the names.`
        );
        return; // Abort save
      }

      const cleanedRows = cleanRows(allRows);
      console.log("DEBUG: Cleaned rows:", cleanedRows);
      const columns = convertRowsToColumns(cleanedRows);
      console.log("DEBUG: Converted columns:", columns);

      const payload = {
        alat_name: worksheetName,
        ...columns,
      };
      console.log("DEBUG: Payload being sent to save_worksheet:", payload);

      const { error } = await supabase.rpc("save_worksheet", payload);
      if (error) {
        console.error("DEBUG: Error from save_worksheet:", error);
        throw error;
      }
      updateSaveState("Saved");
      showToast("success", "Worksheet saved successfully");
    } catch (error) {
      console.error("DEBUG: Caught error in handleSaveWorksheet:", error);
      updateSaveState("Error Saving");
      saveWorkbookLocally(worksheetName, worksheetData);
      showToast(
        "error",
        "Worksheet failed to save online, saving locally, reconnect to internet ASAP to prevent loss of data, also might be empty or invalid tanggal / company name please fix "
      );
    } finally {
      setTimeout(() => {
        updateSaveState("Not Saved");
      }, 5000);
    }
  };

  const onGridReady = (params: any) => {
    setGridApi(params.api);
  };

  // Expose save functions and undo/redo via ref
  useImperativeHandle(ref, () => ({
    gridRef: internalGridRef.current,
    handleSaveWorksheet,
    undo: () => {
      gridApi?.undoCellEditing();
    },
    redo: () => {
      gridApi?.redoCellEditing();
    },
    canUndo: () => {
      return gridApi?.getCurrentUndoSize() > 0;
    },
    canRedo: () => {
      return gridApi?.getCurrentRedoSize() > 0;
    },
    getGridData: getAllRows,
  }));

  const isLoading = isFetchingCompanyNames || isFetchingWorksheetDataRemotely;

  if (isLoading) return <LoadingSpinner />;

  const isStokAlatPreviouslyFilled = worksheetData!.length > 0;

  return (
    <div
      className={`ag-theme-quartz ${disabled ? "opacity-50 pointer-events-none" : ""}`}
      style={{ height: 500 }}
    >
      {/* The AG Grid component */}

      {/* @ts-ignore */}
      <AgGridReact
        loadingCellRenderer={LoadingSpinner}
        loadingCellRendererParams={"Is Loading"}
        onGridReady={onGridReady}
        onCellValueChanged={disabled ? undefined : handleSaveWorksheet}
        ref={internalGridRef}
        rowData={worksheetData}
        defaultColDef={{
          ...defaultColfDef,
          editable: disabled ? false : defaultColfDef.editable,
        }}
        columnDefs={colDefs}
        undoRedoCellEditing={!disabled}
        undoRedoCellEditingLimit={50}
        suppressClickEdit={disabled}
      />
      <div className="my-4"></div>

      <AddNewStokAlatFromExcel
        selectedDate={dayjs.utc(selectedDate)}
        isStokAlatPreviouslyFilled={isStokAlatPreviouslyFilled}
      />

      <div>
        <div className="mb-2 block">
          <Label
            className="cursor-pointer"
            htmlFor="file-upload"
            value="Upload file"
          />
        </div>
        {/* <FileInput onChange={handleImportFromExcel} id="file-upload" /> */}
      </div>
    </div>
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

export default forwardRef<MyGridRef, MyGridProps>(MyGrid);
