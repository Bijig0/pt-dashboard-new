import {
  CompanyTypoNameToMove,
  DestinationCompanyName,
} from "../group-company-typo-names-machine";
import { ClusteredCompanyNames } from "../types";
import moveTypoCompanyNameToDestinationRow from "./moveTypoCompanyNameToDestinationRow";

const clusteredCompanyNames = {
  "Tech Innovations Inc": {
    typoCompanyNames: ["Tech Innovations Inc", "Tech Innov Inc"],
    correctCompanyName: "Tech Innovations Inc",
    possibleCorrectCompanyNameFromPrevMonthStokAlat: "Tech Innovations",
  },
  "Green Energy Solutions": {
    typoCompanyNames: ["Green Energy Solutions"],
    correctCompanyName: "Green Energy Solutions",
    possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
  },
} satisfies ClusteredCompanyNames;

const companyTypoNameToMove = {
  correctCompanyNameFrom: "Tech Innovations Inc",
  typoCompanyNameToMove: "Tech Innov Inc",
} satisfies CompanyTypoNameToMove;

const companyTypoNameDestination = {
  correctCompanyName: "Green Energy Solutions",
} satisfies DestinationCompanyName;

describe("moveTypoCompanyNameToDestinationRow", () => {
  it("should move the typo company name to the destination row", () => {
    const result = moveTypoCompanyNameToDestinationRow(
      clusteredCompanyNames,
      companyTypoNameToMove,
      companyTypoNameDestination
    );

    const expected = {
      "Tech Innovations Inc": {
        typoCompanyNames: ["Tech Innovations Inc"],
        correctCompanyName: "Tech Innovations Inc",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: "Tech Innovations",
      },
      "Green Energy Solutions": {
        typoCompanyNames: ["Green Energy Solutions", "Tech Innov Inc"],
        correctCompanyName: "Green Energy Solutions",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
    } satisfies ClusteredCompanyNames;

    expect(result).toMatchObject(expected);
  });

  it("should contain a moved object with the typo company name moved and the correct company name to", () => {
    const result = moveTypoCompanyNameToDestinationRow(
      clusteredCompanyNames,
      companyTypoNameToMove,
      companyTypoNameDestination
    );

    const expected = {
      "Tech Innovations Inc": {
        typoCompanyNames: ["Tech Innovations Inc"],
        correctCompanyName: "Tech Innovations Inc",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: "Tech Innovations",
        moved: [
          {
            typoCompanyNameMoved: "Tech Innov Inc",
            from: "Tech Innovations Inc",
            to: "Green Energy Solutions",
          },
        ],
      },
      "Green Energy Solutions": {
        typoCompanyNames: ["Green Energy Solutions", "Tech Innov Inc"],
        correctCompanyName: "Green Energy Solutions",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "Tech Innov Inc",
            from: "Tech Innovations Inc",
            to: "Green Energy Solutions",
          },
        ],
      },
    } satisfies ClusteredCompanyNames;

    expect(result).toEqual(expected);
  });
});
