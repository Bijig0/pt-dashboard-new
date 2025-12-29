import { z } from "zod";
import { parseDateYYYYMMDD } from "../../../utils/parseDateYYYY-MM-DD/parseDateYYYYMMDD";

export const worksheetDataSchema = z.array(
  z.object({
    masuk: z.coerce.number().optional(),
    keluar: z.coerce.number().optional(),
    tanggal: z
      .string()
      .transform((str) => parseDateYYYYMMDD(str).format("DD/MM/YYYY")),
    company_name: z.string(),
    alat_name: z.string(),
  })
);

export type WorksheetDataSchema = z.infer<typeof worksheetDataSchema>;
