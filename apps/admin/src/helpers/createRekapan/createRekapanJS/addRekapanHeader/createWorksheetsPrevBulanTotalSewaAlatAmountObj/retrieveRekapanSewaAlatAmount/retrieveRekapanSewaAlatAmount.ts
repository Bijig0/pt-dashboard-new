import * as E from "fp-ts/Either";
import * as O from "fp-ts/Option";
import { flow, identity, pipe } from "fp-ts/lib/function";
import { RekapanWorkbookObj } from "../../../../../../hooks/useGetRekapanData";

const assertNumber = flow(
  E.fromPredicate(
    (x): x is number => typeof x === "number", // Type guard to check if x is a number
    (x) => new Error(`Expected a number, but got ${typeof x}`) // Error message if the check fails
  )
);

export const retrieveRekapanSewaAlatAmount =
  (workbook: RekapanWorkbookObj) =>
  (alatName: string, worksheetName: string): number => {
    const worksheet = pipe(workbook[worksheetName], O.fromNullable);

    return pipe(
      worksheet,
      O.map((worksheet) => worksheet["currentBulanTotalSewaAlatAmount"]),
      O.chain((currentBulanTotalSewaAlatAmount) =>
        pipe(
          currentBulanTotalSewaAlatAmount[alatName],
          O.fromNullable,
          O.map(assertNumber)
        )
      ),
      O.match(
        () => 0,
        E.match((error) => {
          throw error;
        }, identity)
      )
    );
  };
