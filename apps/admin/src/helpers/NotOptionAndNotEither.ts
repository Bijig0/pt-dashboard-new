import { Either } from "fp-ts/lib/Either";
import { Option } from "fp-ts/lib/Option";

type IsOption<T> = T extends Option<any> ? true : false;
type IsEither<T> = T extends Either<any, any> ? true : false;

export type NotOptionAndNotEither<T> = IsOption<T> extends true
  ? never
  : IsEither<T> extends true
  ? never
  : T;
