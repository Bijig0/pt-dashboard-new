import arrayEquals from "array-equal";
import * as A from "fp-ts/Array";
import * as O from "fp-ts/Option";
import * as R from "fp-ts/Record";
import { identity, pipe } from "fp-ts/lib/function";
import { produce } from "immer";
import { objectEntries } from "ts-extras";
import { invertClusteredTypoCompanyNames } from "../../../../../../helpers/createRekapan/invertClusteredTypoCompanyName";
import { objectValues } from "../../../../../../helpers/objectValues";
import { findMostSimilarList } from "../findMostSimilarList/findMostSimilarList";
import {
  CorrectCompanyName,
  PossibleCorrectCompanyNameFromPrevMonthStokAlat,
} from "../types";
import logger from "@logger";

const annotateClustered = (
  prevCorrectCompanyNames:
    | Record<
        CorrectCompanyName,
        { typoCompanyNames: string[]; correctCompanyName: CorrectCompanyName }
      >
    | undefined,
  currentClustered: Record<
    CorrectCompanyName,
    { typoCompanyNames: string[]; correctCompanyName: CorrectCompanyName }
  >
): Record<
  CorrectCompanyName,
  {
    typoCompanyNames: string[];
    correctCompanyName: CorrectCompanyName;
    possibleCorrectCompanyNameFromPrevMonthStokAlat:
      | PossibleCorrectCompanyNameFromPrevMonthStokAlat
      | undefined;
  }
> => {
  if (prevCorrectCompanyNames === undefined) {
    return pipe(
      currentClustered,
      R.map(({ typoCompanyNames, correctCompanyName }) => ({
        typoCompanyNames,
        correctCompanyName,
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      }))
    );
  }

  const prevMonthCorrectedCompanyName = invertClusteredTypoCompanyNames(
    prevCorrectCompanyNames
  );

  const annotated = pipe(
    currentClustered,
    R.map(({ typoCompanyNames, correctCompanyName }) => {
      const possibleCorrectCompanyNameFromPrevMonthStokAlat = pipe(
        typoCompanyNames,
        A.findFirst(
          (typoCompanyName) =>
            prevMonthCorrectedCompanyName[typoCompanyName] !== undefined
        ),
        O.match(
          () => undefined,
          (typoCompanyName) => prevMonthCorrectedCompanyName[typoCompanyName]
        )
      );
      return {
        typoCompanyNames,
        correctCompanyName,
        possibleCorrectCompanyNameFromPrevMonthStokAlat,
      };
    })
  );

  logger.debug({ annotated });

  const updateAnnotatedWithSimilarities = (
    annotated: Record<
      CorrectCompanyName,
      {
        typoCompanyNames: string[];
        correctCompanyName: CorrectCompanyName;
        possibleCorrectCompanyNameFromPrevMonthStokAlat:
          | CorrectCompanyName
          | undefined;
      }
    >,
    prevMonthCorrectCompanyNames: string[]
  ): Record<
    CorrectCompanyName,
    {
      typoCompanyNames: string[];
      correctCompanyName: CorrectCompanyName;
      possibleCorrectCompanyNameFromPrevMonthStokAlat:
        | CorrectCompanyName
        | undefined;
    }
  > => {
    return produce(annotated, (draft) => {
      const allCurrentMonthTypoCompanyNames = pipe(
        draft,
        objectValues,
        A.filter(
          ({ possibleCorrectCompanyNameFromPrevMonthStokAlat }) =>
            possibleCorrectCompanyNameFromPrevMonthStokAlat !== undefined
        ),
        A.map((each) => each.typoCompanyNames)
      );

      const similarityThreshold = 2;

      for (const prevMonthCorrectCompanyName of prevMonthCorrectCompanyNames) {
        const mostSimilarList = findMostSimilarList(
          allCurrentMonthTypoCompanyNames,
          prevMonthCorrectCompanyName,
          similarityThreshold
        );

        if (mostSimilarList === undefined) continue;

        const recordToAddPrevMonthCorrectCompanyNameTo = pipe(
          draft,
          objectEntries,
          A.findFirst(([_, { typoCompanyNames }]) => {
            return arrayEquals(typoCompanyNames, mostSimilarList);
          }),
          O.map(([correctCompanyName, _]) => correctCompanyName),
          O.match(() => {
            throw new Error("No record found");
          }, identity)
        );

        draft[
          recordToAddPrevMonthCorrectCompanyNameTo
        ]!.possibleCorrectCompanyNameFromPrevMonthStokAlat =
          prevMonthCorrectCompanyName;

        // Find in annotated the object where mostSimilarList is the typoCompanyNames
        // Then update the possibleCorrectCompanyNameFromPrevMonthStokAlat
      }
    });
  };

  const annotatedAndUpdated = updateAnnotatedWithSimilarities(
    annotated,
    pipe(prevCorrectCompanyNames, R.keys)
  );

  logger.debug({ annotated });

  logger.debug({ annotatedAndUpdated });

  return annotatedAndUpdated;

  // So get the inverse again
  // Then from the values, you have all the correct names
  // Then use levenshtein to find the most similar one
};

export default annotateClustered;
