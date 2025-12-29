import { AlatName } from "#src/helpers/createRekapan/types.js";

export type AgGridRow = { [key: AlatName]: string | number } & {
  tanggal: string;
};
