import { z } from "zod";
import { Row } from "./types";

export const convertFormulaCellsToResult = (rows: Row[]): Row[] => {
  return rows.map((row) => {
    return row.map((cell) => {
      // Check if the cell is an object and has a 'formula' property
      if (typeof cell === "object" && cell !== null && "result" in cell) {
        return z.number().parse(cell.result); // Return the result of the formula
      } else if (
        typeof cell === "object" &&
        cell !== null &&
        ("formula" in cell || "sharedFormula" in cell)
      ) {
        return 0;
      }
      return cell; // If it's not a formula cell, return the cell as is
    });
  });
};
