import { DataTagihanRowSchema, DataTagihanSchema } from '../schema/schema.js';

type Args = {
  mainDataTagihan: DataTagihanSchema;
  rowsToFilter: DataTagihanRowSchema[][];
};

export const filterMainDataTagihan = ({
  mainDataTagihan,
  rowsToFilter,
}: Args): DataTagihanSchema => {
  const dataTagihanRows = rowsToFilter.flat();
  const filterSet = new Set(dataTagihanRows.map((row) => row[1]));

  return mainDataTagihan.filter((row) => !filterSet.has(row[1]));
};
