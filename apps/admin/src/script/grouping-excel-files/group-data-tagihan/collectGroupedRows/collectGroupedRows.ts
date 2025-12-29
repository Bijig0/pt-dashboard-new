import {
  DataTagihanRowSchema,
  DataTagihanSchema,
  dataTagihanSchema,
} from '../schema/schema.js';

type Args = {
  workbookRows: DataTagihanSchema;
  rowsToCollect: string[][];
};

export const collectGroupedRows = async ({
  workbookRows,
  rowsToCollect,
}: Args): Promise<DataTagihanRowSchema[][]> => {
  // Validate the input workbookRows
  const validatedWorkbookRows = dataTagihanSchema.parse(workbookRows);

  const result: DataTagihanRowSchema[][] = [];

  for (const group of rowsToCollect) {
    const matchingRows = validatedWorkbookRows.filter((row) => {
      const [firstPart] = row[1].split('/');
      const trimmedNumber = parseInt(firstPart, 10).toString();
      return group.includes(trimmedNumber);
    });

    // Sort the matching rows according to the order in the group
    const sortedMatchingRows = group
      .map((item) => {
        const matchedRow = matchingRows.find((row) => {
          const [firstPart] = row[1].split('/');
          const trimmedNumber = parseInt(firstPart, 10).toString();
          return trimmedNumber === item;
        });

        if (!matchedRow) {
          throw new Error(`No match found for ${item}`);
        }

        return matchedRow;
      })
      .filter((row): row is DataTagihanRowSchema => row !== undefined);

    result.push(sortedMatchingRows);
  }

  return result;
};
