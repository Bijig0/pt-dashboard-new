import { CorrectCompanyName } from "../../pages/services/first-one/generate-rekapan/group-company-typo-names/types";
import { TypoCompanyName } from "./generateAllRekapansJS/generateAllRekapansJS";

export const invertClusteredTypoCompanyNames = (clusteredTypoCompanyNames: {
  [x: CorrectCompanyName]: {
    typoCompanyNames: string[];
    correctCompanyName: CorrectCompanyName;
  };
}) => {
  const typoToCorrectNameMap: Record<TypoCompanyName, CorrectCompanyName> = {};

  Object.values(clusteredTypoCompanyNames).forEach((cluster) => {
    cluster.typoCompanyNames.forEach((typoName) => {
      typoToCorrectNameMap[typoName] = cluster.correctCompanyName;
    });
  });

  return typoToCorrectNameMap;
};
