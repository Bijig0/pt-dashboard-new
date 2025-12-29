import { z } from "zod";
import { tanggalValueFormatter } from "../../../tanggalValueFormatter/tanggalValueFormatter";

// Put zod in in some later time

type Args = {
  companyNames: string[] | undefined;
};

export const createColDefs = (args: Args) => {
  const { companyNames } = args;

  const colDefs = [
    {
      field: "tanggal",
      cellDataType: "dateString",
      valueFormatter: tanggalValueFormatter,
    },
    {
      headerName: "Company Name",
      field: "company_name",
      cellDataType: "text",
      valueFormatter: (params: { value: unknown }) => {
        if (params.value === null) return params.value;
        const companyName = z.string().parse(params.value);
        if (!companyNames?.includes(companyName)) return "TYPO FOUND";
        return params.value;
      },
    },
    {
      field: "masuk",
      cellDataType: "number",
      width: 200,
    },
    {
      field: "keluar",
      cellDataType: "number",
    },
  ];

  return colDefs;
};
