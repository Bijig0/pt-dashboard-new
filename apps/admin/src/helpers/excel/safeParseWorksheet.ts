import { worksheetSchema } from "../excel-types";
import { safeParse } from "../safeParse";

export const safeParseWorksheet = safeParse(worksheetSchema);
