import { z } from "zod";
import { queryErrorSchema } from "./schemas";

export type LocalStorageKeys = {
  accessToken: string;
  refreshToken: string;
  workbooks: Record<string, any>;
};

export type Row = {
  tanggal: string;
  masuk: number;
  keluar: number;
  company_name: string;
  alat_name: string;
};

export type TQueryError = z.infer<typeof queryErrorSchema>;

import "@testing-library/jest-dom";
