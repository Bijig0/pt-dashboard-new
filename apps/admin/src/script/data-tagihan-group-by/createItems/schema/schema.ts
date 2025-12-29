import { z } from "zod";

export const dataTagihanRowSchema = z.array(z.any());

export type DataTagihanRowSchema = z.infer<typeof dataTagihanRowSchema>;

export const dataTagihanSchema = z.array(dataTagihanRowSchema);

export type DataTagihanSchema = z.infer<typeof dataTagihanSchema>;

export const cleanedDataTagihanSchema = z.array(
  z.tuple([
    z.string(), // First column (item name)
    z.number(), // Second column (item price)
  ])
);

export type CleanedDataTagihanSchema = z.infer<typeof cleanedDataTagihanSchema>;

export const itemSchema = z.object({
  itemName: z.string(),
  itemPrice: z.number(),
});

export const itemsSchema = z.array(itemSchema);

export type ItemSchema = z.infer<typeof itemSchema>;

export type ItemsSchema = z.infer<typeof itemsSchema>;
