import standardizeWithPrevMonthCorrectCompanyNames, {
  separateMovedToDestinationCompanyNamesToIntendedDestinations,
} from "./standardizeWithPrevMonthCorrectCompanyNames";
import { ClusteredCompanyNames } from "./types";

describe("separateMovedToDestinationCompanyNamesToIntendedDestinations", () => {
  it("should handle multiple moves across various clusters", () => {
    const currentClusters = [
      ["ACSET AHM", "ACSET ABM", "ACSET AHN"],
      ["ACSET ADM", "ACSET ADD"],
      ["ACSET ASYA", "ACSET ASIA"],
      ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
      ["ACSET GLOBAL", "ACSET GLOBE"],
      ["ACSET TECH", "ACSET TECHNOLOGY"],
    ];

    const prevMonthCorrectCompanyNames: ClusteredCompanyNames = {
      "ACSET AHM": {
        typoCompanyNames: ["ACSET AHM"],
        correctCompanyName: "ACSET AHM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET ABM",
            from: "ACSET AHM",
            to: "ACSET ADM",
          },
          {
            typoCompanyNameMoved: "ACSET AHN",
            from: "ACSET AHM",
            to: "ACSET ASYA",
          },
        ],
      },
      "ACSET ADM": {
        typoCompanyNames: ["ACSET ADM", "ACSET ABM"],
        correctCompanyName: "ACSET ADM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET ABM",
            from: "ACSET AHM",
            to: "ACSET ADM",
          },
        ],
      },
      "ACSET ASYA": {
        typoCompanyNames: ["ACSET ASYA", "ACSET ASIA", "ACSET AHN"],
        correctCompanyName: "ACSET ASYA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET AHN",
            from: "ACSET AHM",
            to: "ACSET ASYA",
          },
        ],
      },
      "ACSET GENOVA": {
        typoCompanyNames: ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
        correctCompanyName: "ACSET GENOVA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET GLOBAL": {
        typoCompanyNames: ["ACSET GLOBAL", "ACSET GLOBE", "ACSET ADD"],
        correctCompanyName: "ACSET GLOBAL",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET TECH": {
        typoCompanyNames: ["ACSET TECH", "ACSET TECHNOLOGY"],
        correctCompanyName: "ACSET TECH",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
    };

    const result = separateMovedToDestinationCompanyNamesToIntendedDestinations(
      currentClusters,
      prevMonthCorrectCompanyNames
    );

    const expected = [
      ["ACSET AHM"],
      ["ACSET ADM", "ACSET ADD", "ACSET ABM"],
      ["ACSET ASYA", "ACSET ASIA", "ACSET AHN"],
      ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
      ["ACSET GLOBAL", "ACSET GLOBE"],
      ["ACSET TECH", "ACSET TECHNOLOGY"],
    ];

    expect(result).toEqual(expected);
  });

  it("should handle moves from a further iterated cluster into a previously iterated cluster", () => {
    const currentClusters = [
      ["ACSET AHM", "ACSET ABM"],
      ["ACSET ADM", "ACSET ADD"],
      ["ACSET ASYA", "ACSET ASIA", "ACSET AHN"],
      ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
      ["ACSET GLOBAL", "ACSET GLOBE"],
      ["ACSET TECH", "ACSET TECHNOLOGY"],
    ];

    const prevMonthCorrectCompanyNames: ClusteredCompanyNames = {
      "ACSET AHM": {
        typoCompanyNames: ["ACSET AHM", "ACSET AHN"],
        correctCompanyName: "ACSET AHM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET AHN",
            from: "ACSET ASYA",
            to: "ACSET AHM",
          },
        ],
      },
      "ACSET ADM": {
        typoCompanyNames: ["ACSET ADM", "ACSET ABM"],
        correctCompanyName: "ACSET ADM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET ASYA": {
        typoCompanyNames: ["ACSET ASYA", "ACSET ASIA"],
        correctCompanyName: "ACSET ASYA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET AHN",
            from: "ACSET ASYA",
            to: "ACSET AHM",
          },
        ],
      },
      "ACSET GENOVA": {
        typoCompanyNames: ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
        correctCompanyName: "ACSET GENOVA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET GLOBAL": {
        typoCompanyNames: ["ACSET GLOBAL", "ACSET GLOBE", "ACSET ADD"],
        correctCompanyName: "ACSET GLOBAL",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET TECH": {
        typoCompanyNames: ["ACSET TECH", "ACSET TECHNOLOGY"],
        correctCompanyName: "ACSET TECH",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
    };

    const result = separateMovedToDestinationCompanyNamesToIntendedDestinations(
      currentClusters,
      prevMonthCorrectCompanyNames
    );

    const expected = [
      ["ACSET AHM", "ACSET ABM", "ACSET AHN"],
      ["ACSET ADM", "ACSET ADD"],
      ["ACSET ASYA", "ACSET ASIA"],
      ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
      ["ACSET GLOBAL", "ACSET GLOBE"],
      ["ACSET TECH", "ACSET TECHNOLOGY"],
    ];

    expect(result).toEqual(expected);
  });

  it("should return the same array if nothing was moved", () => {
    const prevClusters = [["ACSET AHM"], ["ACSET ADM"], ["ACSET GENOVA"]];

    const prevMonthCorrectCompanyNames: ClusteredCompanyNames = {
      "ACSET AHM": {
        typoCompanyNames: ["ACSET AHM"],
        correctCompanyName: "ACSET AHM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [],
      },
      "ACSET ADM": {
        typoCompanyNames: ["ACSET ADM"],
        correctCompanyName: "ACSET ADM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET GENOVA": {
        typoCompanyNames: ["ACSET GENOVA"],
        correctCompanyName: "ACSET GENOVA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
    };

    const result = separateMovedToDestinationCompanyNamesToIntendedDestinations(
      prevClusters,
      prevMonthCorrectCompanyNames
    );

    expect(prevClusters).toEqual(result);
  });
});

describe("standardizeWithPrevMonthCorrectCompanyNames", () => {
  const clusteredCompanyNames = [
    ["ACSET ADM", "ACSET AHM"],
    ["ACSET ASYA"],
    ["ACSET ASYA SENTARIUM"],
    ["ACSET GENOVA", "ACSAET GENOVA"],
  ];

  it("should return the same array if no corrections provided", () => {
    const result = standardizeWithPrevMonthCorrectCompanyNames(undefined)(
      clusteredCompanyNames
    );

    expect(result).toEqual(clusteredCompanyNames);
  });

  it("should return the corrected array if corrections provided", () => {
    const clusteredCompanyNames = [
      ["ACSET ADM", "ACSET AHM"],
      ["ACSET ASYA"],
      ["ACSET ASYA SENTARIUM"],
      ["ACSET GENOVA", "ACSAET GENOVA"],
    ];

    const prevMonthCorrectCompanyNames = {
      "ACSET GENOVA": {
        typoCompanyNames: ["ACSET GENOVA"],
        correctCompanyName: "ACSET GENOVA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET ADM": {
        typoCompanyNames: ["ACSET ADM"],
        correctCompanyName: "ACSET ADM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET AHM": {
        typoCompanyNames: ["ACSET AHM"],
        correctCompanyName: "ACSET AHM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        split: true,
      },
    } satisfies ClusteredCompanyNames;
    const result = standardizeWithPrevMonthCorrectCompanyNames(
      prevMonthCorrectCompanyNames
    )(clusteredCompanyNames);

    const expected = [
      ["ACSET AHM"],
      ["ACSET ADM"],
      ["ACSET ASYA"],
      ["ACSET ASYA SENTARIUM"],
      ["ACSET GENOVA", "ACSAET GENOVA"],
    ];

    expect(result).toEqual(expected);
  });

  it("should fail if given current not clustered, yet previously clustered into new company names", () => {
    const clusteredCompanyNames = [
      ["ACSET ADM", "ACSET AHM", "ACSET ABM"],
      ["ACSET ASYA"],
      ["ACSET ASYA SENTARIUM"],
      ["ACSET GENOVA", "ACSAET GENOVA"],
    ];

    const prevMonthCorrectCompanyNames = {
      "ACSET GENOVA": {
        typoCompanyNames: ["ACSET GENOVA"],
        correctCompanyName: "ACSET GENOVA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET GENEVA",
            from: "ACSET GENOVA",
            to: "ACSET AHM",
          },
        ],
      },
      "ACSET AHM": {
        typoCompanyNames: ["ACSET AHM", "ACSET GENEVA"],
        correctCompanyName: "ACSET AHM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET GENEVA",
            from: "ACSET GENOVA",
            to: "ACSET AHM",
          },
        ],
      },
      "ACSET ADM": {
        typoCompanyNames: ["ACSET ADM", "ACSET ABM"],
        correctCompanyName: "ACSET ADM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
    } satisfies ClusteredCompanyNames;
    expect(() =>
      separateMovedToDestinationCompanyNamesToIntendedDestinations(
        clusteredCompanyNames,
        prevMonthCorrectCompanyNames
      )
    ).toThrow();
  });

  it("should separate a typo company name into its previously moved cluster if it previously was moved", () => {
    const clusteredCompanyNames = [
      ["ACSET AHM", "ACSET ABM"],
      ["ACSET ADM"],
      ["ACSET ASYA"],
      ["ACSET ASYA SENTARIUM"],
      ["ACSET GENOVA", "ACSAET GENOVA"],
    ];

    const prevMonthCorrectCompanyNames = {
      "ACSET GENOVA": {
        typoCompanyNames: ["ACSET GENOVA"],
        correctCompanyName: "ACSET GENOVA",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
      "ACSET AHM": {
        typoCompanyNames: ["ACSET AHM"],
        correctCompanyName: "ACSET AHM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET ABM",
            from: "ACSET AHM",
            to: "ACSET ADM",
          },
        ],
      },
      "ACSET ADM": {
        typoCompanyNames: ["ACSET ADM", "ACSET ABM"],
        correctCompanyName: "ACSET ADM",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
        moved: [
          {
            typoCompanyNameMoved: "ACSET ABM",
            from: "ACSET AHM",
            to: "ACSET ADM",
          },
        ],
      },
    } satisfies ClusteredCompanyNames;
    const result = standardizeWithPrevMonthCorrectCompanyNames(
      prevMonthCorrectCompanyNames
    )(clusteredCompanyNames);

    const expected = [
      ["ACSET AHM"],
      ["ACSET ADM", "ACSET ABM"],
      ["ACSET ASYA"],
      ["ACSET ASYA SENTARIUM"],
      ["ACSET GENOVA", "ACSAET GENOVA"],
    ];

    expect(result).toEqual(expected);
  });
});
