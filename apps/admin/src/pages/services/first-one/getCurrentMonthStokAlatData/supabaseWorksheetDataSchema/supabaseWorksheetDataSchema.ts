import { z } from "zod";
import { parseDateYYYYMMDD } from "../../../../../utils/parseDateYYYY-MM-DD/parseDateYYYYMMDD";

export const supabaseWorksheetDataSchema = z.array(
  z.object({
    tanggal: z
      .string()
      // Supabase/postgres date format is YYYY-MM-DD
      .transform((str) => parseDateYYYYMMDD(str).format("DD/MM/YYYY")),
    masuk: z.number().nullable(),
    keluar: z.number().nullable(),
    company_name: z.object({
      name: z.string(),
    }),
    alat_name: z.object({
      name: z.string(),
    }),
  })
);

export type SupabaseWorksheetDataSchema = z.infer<
  typeof supabaseWorksheetDataSchema
>;