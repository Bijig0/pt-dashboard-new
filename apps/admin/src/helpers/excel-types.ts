import { z, ZodSchema } from "zod";
import { safeParse } from "./safeParse";

export type RemoveUndefinedHeadUtil<T> = T extends [undefined, ...infer Rest]
  ? Rest
  : never;

export type RemoveUndefinedHead<T> = T extends (infer U)[]
  ? RemoveUndefinedHeadUtil<U>[]
  : never;

const totalSewaAlatAmountSchema = z.tuple([z.string()]).rest(z.number());

export const prevBulanTotalSewaAlatAmountSchema = totalSewaAlatAmountSchema;

export type PrevBulanTotalSewaAlatAmountSchema = z.infer<
  typeof prevBulanTotalSewaAlatAmountSchema
>;

export const safeParsePrevBulanTotalSewaAlatAmount = safeParse(
  prevBulanTotalSewaAlatAmountSchema
);

export const currentBulanTotalSewaAlatAmount = totalSewaAlatAmountSchema;

export type CurrentBulanTotalSewaAlatAmountSchema = z.infer<
  typeof currentBulanTotalSewaAlatAmount
>;

export const safeParseCurrentBulanTotalSewaAlatAmount = safeParse(
  currentBulanTotalSewaAlatAmount
);

const nonEmptyWorksheetRowSchema = z
  .tuple([z.undefined()])
  .rest(z.string().or(z.number()).or(z.date()).or(z.undefined()));

// Define the schema that allows either the non-empty row schema or an empty array
export const worksheetRowSchema = z.union([
  nonEmptyWorksheetRowSchema,
  z.array(z.never()).length(0),
]);

export const worksheetSchema = z.array(
  z.union([
    z.undefined(), // Allow undefined values
    worksheetRowSchema,
  ])
);

export const workbookSchema = z.array(worksheetSchema);

export type WorksheetRowSchema = z.infer<typeof worksheetRowSchema>;

export type CleanedWorksheetRowSchema =
  RemoveUndefinedHeadUtil<WorksheetRowSchema>;

export type WorksheetSchema = z.infer<typeof worksheetSchema>;

export type CleanedWorksheetSchema = RemoveUndefinedHead<WorksheetSchema>;

export type WorkbookSchema = z.infer<typeof workbookSchema>;

export type ClenaedWorkbookSchema = RemoveUndefinedHead<WorkbookSchema>[];

export type InferZodSchema<Schema extends ZodSchema> = z.infer<Schema>;
