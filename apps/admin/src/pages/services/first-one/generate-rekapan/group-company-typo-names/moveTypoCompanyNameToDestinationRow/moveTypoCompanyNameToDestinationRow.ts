import { produce } from "immer";
import {
  CompanyTypoNameToMove,
  DestinationCompanyName,
} from "../group-company-typo-names-machine";
import { ClusteredCompanyNames } from "../types";

const moveTypoCompanyNameToDestinationRow = (
  prevClustered: ClusteredCompanyNames,
  companyTypoNameToMove: CompanyTypoNameToMove,
  companyTypoNameDestination: DestinationCompanyName
) => {
  return produce(prevClustered, (draft) => {
    const { correctCompanyNameFrom, typoCompanyNameToMove } =
      companyTypoNameToMove;
    const { correctCompanyName: destinationCompanyName } =
      companyTypoNameDestination;

    const movedInfo = {
      typoCompanyNameMoved: typoCompanyNameToMove,
      from: correctCompanyNameFrom,
      to: destinationCompanyName,
    };

    // Update source company
    const sourceCompany = draft[correctCompanyNameFrom];
    if (sourceCompany) {
      sourceCompany.typoCompanyNames = sourceCompany.typoCompanyNames.filter(
        (name) => name !== typoCompanyNameToMove
      );
      sourceCompany.moved = sourceCompany.moved || [];
      sourceCompany.moved.push(movedInfo);
    }

    // Update destination company
    const destinationCompany = draft[destinationCompanyName];
    if (destinationCompany) {
      destinationCompany.typoCompanyNames.push(typoCompanyNameToMove);
      destinationCompany.moved = destinationCompany.moved || [];
      destinationCompany.moved.push(movedInfo);
    }
  });
};

export default moveTypoCompanyNameToDestinationRow;
