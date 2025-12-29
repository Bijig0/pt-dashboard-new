import { z } from "npm:zod";

const stokAlatType = z.enum(["KIRIM", "RETUR"]);

export const stokAlatRowSchema = z.object({
  date: z.string().describe("Date in DD/MM format"),
  alatName: z.string(),
  companyName: z.string(),
  type: stokAlatType,
  amount: z.number(),
});

export const stokAlatResponseSchema = z.object({
  data: z.array(stokAlatRowSchema),
});

export const ocrSchema = stokAlatResponseSchema;

export type StokAlatResponse = z.infer<typeof stokAlatResponseSchema>;
export type StokAlatRow = z.infer<typeof stokAlatRowSchema>;

export type OcrResponse = z.infer<typeof ocrSchema>;
