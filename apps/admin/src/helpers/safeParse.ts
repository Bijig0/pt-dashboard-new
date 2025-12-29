import * as E from "fp-ts/Either";
import { Either } from "fp-ts/lib/Either";
import { ZodError, ZodSchema } from "zod";
import { NotOptionAndNotEither } from "./NotOptionAndNotEither";
import { InferZodSchema } from "./excel-types";

export const safeParse =
  <Schema extends ZodSchema, Data extends unknown>(schema: Schema) =>
  (
    data: NotOptionAndNotEither<Data>
  ): Either<ZodError, InferZodSchema<Schema>> => {
    const parsedResult = schema.safeParse(data);
    if (!parsedResult.success) {
      return E.left(parsedResult.error);
    }
    return E.right(parsedResult.data);
  };
