import { z } from "zod";
import { TQueryError } from "./globals";

export const companyNamesSchema = z.array(
  z.object({
    name: z.string(),
  })
);

export const proyekSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const proyeksSchema = z.array(proyekSchema);

export const alatNameSchema = z.object({
  name: z.string(),
});

export const alatNamesSchema = z.array(alatNameSchema);

export const alatDetailSchema = z.object({
  name: z.string(),
  harga: z.number(),
});

export const alatDetailsSchema = z.array(alatDetailSchema);

export type AlatDetailsSchema = z.infer<typeof alatDetailsSchema>;

export const worksheetDataSchema = z.array(
  z.object({
    masuk: z.coerce.number().optional(),
    keluar: z.coerce.number().optional(),
    tanggal: z.string(),
    company_name: z.string(),
    alat_name: z.string(),
  })
);

export const queryErrorSchema = z.object({
  message: z.string(),
  code: z.string(),
  hint: z.string().nullable(),
  details: z.string().nullable(),
});

export const singleHargaAlatSchema = z.object({
  name: z.string(),
  harga_bulanan: z.number(),
  harga_harian: z.number(),
});

export const hargaAlatSchema = z.array(singleHargaAlatSchema);

export const initialStokSchema = z.array(
  z.object({
    initial_stok: z.number().nullable(),
  })
);

export const isQueryError = (error: unknown): error is TQueryError => {
  const result = queryErrorSchema.safeParse(error);

  if (!result.success) throw result.error;

  return result.success;
};

export type InitialStokSchema = z.infer<typeof initialStokSchema>;
export type CompanyNamesSchema = z.infer<typeof companyNamesSchema>;
export type AlatNameSchema = z.infer<typeof alatNameSchema>;
export type AlatNamesSchema = z.infer<typeof alatNamesSchema>;
export type WorksheetDataSchema = z.infer<typeof worksheetDataSchema>;
export type ProyeksSchema = z.infer<typeof proyeksSchema>;
export type ProyekSchema = z.infer<typeof proyekSchema>;
export type SingleHargaAlatSchema = z.infer<typeof singleHargaAlatSchema>;
export type HargaAlatSchema = z.infer<typeof hargaAlatSchema>;
