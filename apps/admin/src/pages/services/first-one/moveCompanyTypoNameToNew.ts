import logger from "@logger";
import { produce } from "immer";
import { ClusteredCompanyNames } from "./generate-rekapan/group-company-typo-names/types";
import { CompanyTypoNameToMove } from "./generate-rekapan/group-company-typo-names/group-company-typo-names-machine";

const moveTypoCompanyNameToNew = (
  prevClustered: ClusteredCompanyNames,
  companyTypoNameToMove: CompanyTypoNameToMove
) => {
  return produce(prevClustered, (draft) => {
    const { correctCompanyNameFrom, typoCompanyNameToMove } =
      companyTypoNameToMove;

    logger.debug({ companyTypoNameToMove });

    if (
      typoCompanyNameToMove in draft &&
      draft[typoCompanyNameToMove]?.typoCompanyNames.length === 1
    )
      return draft;

    const keyForCompanyTypoNameToMove = correctCompanyNameFrom;

    logger.debug({ keyForCompanyTypoNameToMove });

    const filteredTypoCompanynames = draft[
      keyForCompanyTypoNameToMove
    ]?.typoCompanyNames.filter((each) => each !== typoCompanyNameToMove);

    logger.debug({ filteredTypoCompanynames });

    draft![keyForCompanyTypoNameToMove]!.typoCompanyNames =
      filteredTypoCompanynames!;

    // Say the typo company name to move is the first in the list, and has taken the spot
    // for correct company name, then we set the correctCompanyName as the next candidate
    // set this as its own function w its own name

    if (typoCompanyNameToMove === keyForCompanyTypoNameToMove) {
      const nextCandidateKey =
        draft[keyForCompanyTypoNameToMove]!.typoCompanyNames[0];
      draft[nextCandidateKey!] = draft[keyForCompanyTypoNameToMove]!;
      draft[nextCandidateKey!]!.correctCompanyName = nextCandidateKey!;
      delete draft[keyForCompanyTypoNameToMove];
    }

    draft[typoCompanyNameToMove] = {
      typoCompanyNames: [typoCompanyNameToMove],
      correctCompanyName: typoCompanyNameToMove,
      possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      split: true,
    };
  });
};

export default moveTypoCompanyNameToNew;
