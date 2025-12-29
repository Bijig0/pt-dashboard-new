import { DataError } from "../../find-stok-alat-data-errors";

type Args = {
  worksheetName: string;
  rowNumber: number;
  errorMessage: string;
};

export const createStokAlatDataError = ({
  worksheetName,
  rowNumber,
  errorMessage,
}: Args): DataError => {
  return {
    worksheetName,
    rowNumber,
    errorMessage,
  };
};
