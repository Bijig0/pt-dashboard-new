import { z } from "zod";

export const worksheetMetadataSchema = z.object({
  outFileName: z.string(),
});

export const worksheetInfoSchema = z.object({
  itemNameColumn: z.number().min(0),
  itemPriceColumn: z.number().min(0),
  itemsStartRow: z.number().min(0),
  itemsEndRow: z.number().min(0),
});

export const worksheetDataSchema =
  worksheetMetadataSchema.merge(worksheetInfoSchema);

export type WorksheetDataSchema = z.infer<typeof worksheetDataSchema>;

export type WorksheetInfo = z.infer<typeof worksheetInfoSchema>;
