import { z } from "zod";

type StokAlat = z.infer<typeof StokAlatSchema>;

export const COMPANY_NAME_NOT_STRING_ERROR_MESSAGE =
  "Company name must be a string";

export const StokAlatSchema = z
  .array(z.unknown())
  .refine((arr) => arr.length >= 4, {
    message: "Array must have at least 4 elements",
  })
  .transform((arr) => arr.slice(0, 4)) // Prune to first 4 elements
  .pipe(
    z.tuple([
      z.date(),
      z.string({ message: COMPANY_NAME_NOT_STRING_ERROR_MESSAGE }),
      z.number().nullable().optional(),
      z.number().nullable().optional(),
    ])
  )
  .refine((data) => !data[2] !== !data[3], {
    message:
      "Either the third or fourth element must be a number, but not both",
    path: ["masuk", "keluar"],
  })
  .transform(([date, company, masuk, keluar]) => ({
    date,
    company,
    masuk,
    keluar,
  }));
