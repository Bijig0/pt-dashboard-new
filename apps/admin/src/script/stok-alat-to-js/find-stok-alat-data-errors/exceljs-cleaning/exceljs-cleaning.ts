import { z } from "zod";
import { fillEmptyItemsWithUndefined } from "./fillEmptyWithUndefined/fillEmptyWithUndefined";

const arraySchema = z.array(z.any());

export const exceljsCleaning = (cells: any): any[] => {
  const filledCells = fillEmptyItemsWithUndefined(arraySchema.parse(cells));

  const firstSliced = filledCells.slice(1);

  return firstSliced;
};
