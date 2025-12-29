import { pipe } from "fp-ts/lib/function";
import { Input } from "../../generateTagihan";
import { convertToSingleAlatRows } from "../../makeRecords/convertToSingleAlatRows/convertToSingleAlatRows";
import { removeUndefinedJumlahs } from "../../makeRecords/removeUndefinedJumlahs/removeUndefinedJumlahs";

export const prepareRecords = (records: Input) => {
  const normalRecords = records.slice(1);

  return pipe(normalRecords, convertToSingleAlatRows, removeUndefinedJumlahs);
};
