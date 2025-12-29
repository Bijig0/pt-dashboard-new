import { addMonths } from "date-fns";
import { z } from "zod";
import CompanyNameAutocompleteEditor from "../../../../components/CompanyNameAutocompleteEditor";
import CompanyNameCellRenderer from "../../../../components/CompanyNameCellRenderer";
import DateStringEditor, {
  DateStringEditorParams,
} from "../../../../components/DateStringEditor";
import MutuallyExclusiveCellRenderer from "../../../../components/MutualExclusiveCellRenderer";
import MutuallyExclusiveEditor from "../../../../components/MutuallyExclusiveEditor";
import yyyy_mm_dd_formatDate from "../../../../helpers/yyyy_mm_dd_formatDate";
import { tanggalValueFormatter } from "../tanggalValueFormatter/tanggalValueFormatter";

// Put zod in in some later time

type Args = {
  companyNames: string[] | undefined;
  selectedDate: Date;
};

export const createColDefs = (args: Args) => {
  const { companyNames, selectedDate } = args;
  const nextMonthDate = yyyy_mm_dd_formatDate(addMonths(selectedDate, 1));

  console.log({ nextMonthDate });

  const colDefs = [
    {
      field: "tanggal",
      cellDataType: "dateString",
      cellEditor: DateStringEditor,
      cellEditorParams: {
        params: {
          nextMonthDate,
        } as DateStringEditorParams,
      },
      valueFormatter: tanggalValueFormatter,
    },
    {
      headerName: "Company Name",
      field: "company_name",
      cellDataType: "text",
      cellEditor: CompanyNameAutocompleteEditor,
      cellEditorPopup: true, // Required for React editors that use isPopup()
      cellEditorParams: {
        companyNames: companyNames || [],
      },
      cellRenderer: CompanyNameCellRenderer,
      cellRendererParams: {
        companyNames: companyNames || [],
      },
      cellStyle: (params: any) => {
        const companyName = params.value;
        if (!companyName) return {};
        const isUnregistered = !companyNames?.includes(companyName);
        if (isUnregistered) {
          return {
            backgroundColor: "#fef3c7",
            border: "2px solid #eab308",
          };
        }
        return {};
      },
    },
    {
      field: "masuk",
      cellDataType: "number",
      cellEditor: MutuallyExclusiveEditor,
      cellRenderer: MutuallyExclusiveCellRenderer,
      width: 200,
      cellStyle: (params: any) => {
        const masukValue = params.data?.masuk ?? 0;
        const keluarValue = params.data?.keluar ?? 0;
        if (masukValue > 0 && keluarValue > 0) {
          return {
            backgroundColor: "#fef3c7",
            border: "2px solid #eab308",
          };
        }
        return {};
      },
    },
    {
      field: "keluar",
      cellDataType: "number",
      cellEditor: MutuallyExclusiveEditor,
      cellRenderer: MutuallyExclusiveCellRenderer,
      cellStyle: (params: any) => {
        const masukValue = params.data?.masuk ?? 0;
        const keluarValue = params.data?.keluar ?? 0;
        if (masukValue > 0 && keluarValue > 0) {
          return {
            backgroundColor: "#fef3c7",
            border: "2px solid #eab308",
          };
        }
        return {};
      },
    },
  ];

  return colDefs;
};

export const defaultColfDef = {
  editable: true,
};
