import * as A from "fp-ts/Array";
import * as R from "fp-ts/Record";
import { contramap } from "fp-ts/lib/Ord";
import { pipe } from "fp-ts/lib/function";
import * as S from "fp-ts/string";
import { produce } from "immer";
import { objectFromEntries } from "ts-extras";
import annotateClustered from "./annotateClustered/annotateClustered";
import { clusterSimilarWords } from "./clusterSimilarWords/clusterSimilarWords";
import standardizeWithPrevMonthCorrectCompanyNames from "./standardizeWithPrevMonthCorrectCompanyNames";
import { ClusteredCompanyNames, CorrectCompanyName, Row } from "./types";

const firstStringOrd = contramap((names: string[]) => names[0]!)(S.Ord);

export const clusterCompanyNames = (
  companyNames: string[],
  prevMonthCorrectCompanyNames: Record<CorrectCompanyName, Row> | undefined
): ClusteredCompanyNames => {
  console.log({ companyNames });
  console.log({ prevMonthCorrectCompanyNames });
  return pipe(
    clusterSimilarWords(companyNames, 0), // Set to 0 for manual grouping - no automatic clustering
    (x) => {
      console.log({ x });
      return x;
    },
    standardizeWithPrevMonthCorrectCompanyNames(prevMonthCorrectCompanyNames),
    (x) => {
      console.log({ x });
      return x;
    },
    A.sort(firstStringOrd),
    A.map((each) => {
      return [
        each[0]!,
        { typoCompanyNames: each, correctCompanyName: each[0]! },
      ] as const;
    }),
    objectFromEntries,
    (x) => {
      console.log({ x });
      return x;
    },
    (clustered) => annotateClustered(prevMonthCorrectCompanyNames, clustered),
    (x) => {
      console.log({ x });
      return x;
    },
    R.map((each) => {
      return produce(each, (draft) => {
        if (draft.correctCompanyName === "ACSET ADM") {
          console.log({ draft });
        }
        if (draft.possibleCorrectCompanyNameFromPrevMonthStokAlat === undefined)
          return;
        draft.correctCompanyName =
          draft.possibleCorrectCompanyNameFromPrevMonthStokAlat;
      });
    })
  ) satisfies ClusteredCompanyNames as ClusteredCompanyNames;
};
