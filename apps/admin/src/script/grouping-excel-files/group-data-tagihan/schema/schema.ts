import { z } from "zod";
import { testPPAPattern } from "./testPPAPattern.js";

export const dataTagihanRowSchema = z
  .array(z.any())
  .refine(
    (arr) => {
      if (arr.length < 2) return false;

      const secondElement = arr[1];
      return testPPAPattern(secondElement);
    },
    {
      message: `The second element must be in the format '####/PPA-I/24' where # is a digit`,
    }
  )
  .catch(() => []); // Returns an empty array if validation fails

export type DataTagihanRowSchema = z.infer<typeof dataTagihanRowSchema>;

export const dataTagihanSchema = z.array(dataTagihanRowSchema);

export type DataTagihanSchema = z.infer<typeof dataTagihanSchema>;

// @ts-ignore
if (import.meta.main) {
  const row = ["any", "invalid"];

  const parsed = dataTagihanRowSchema.parse(row);

  console.log({ parsed });
}
