import annotateClustered from "./annotateClustered";

describe("annotateClustered", () => {
  // Assuming invertClusteredTypoCompanyNames and findMostSimilarList are functions
  // that can be mocked directly. If they are not, you might need to adjust the mocking strategy.

  beforeEach(() => {
    // Assuming you need to clear or reset mocks before each test.
    // If bun:test does not provide clearAllMocks or resetAllMocks, you might need to manually reset your mocks.
    // For example, if you're using Jest, you could use jest.clearAllMocks() or jest.resetAllMocks() instead.
  });

  afterEach(() => {
    // Similar to beforeEach, adjust based on the available methods in bun:test or your testing framework.
  });

  it("should annotate clustered data with undefined when no previous data is provided", () => {
    const currentClustered = {
      "Company A": {
        typoCompanyNames: ["Comapny A", "Cmpany A"],
        correctCompanyName: "Company A",
      },
    };

    const expected = {
      "Company A": {
        typoCompanyNames: ["Comapny A", "Cmpany A"],
        correctCompanyName: "Company A",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
    };

    expect(annotateClustered(undefined, currentClustered)).toEqual(expected);
  });

  it("should annotate current clustered data's possibleCorrectCompanyNameFromPrevMonthStokAlat with previous month's correct company name when possible", () => {
    const prevCorrectCompanyNames = {
      "Company A": {
        typoCompanyNames: ["Cmpany A"],
        correctCompanyName: "Company A",
      },
    };

    const currentClustered = {
      "Company A": {
        typoCompanyNames: ["Comapny A", "Cmpany A"],
        correctCompanyName: "Company A",
      },
    };

    const expected = {
      "Company A": {
        typoCompanyNames: ["Comapny A", "Cmpany A"],
        correctCompanyName: "Company A",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: "Company A",
      },
    };

    expect(
      annotateClustered(prevCorrectCompanyNames, currentClustered)
    ).toEqual(expected);
    // Assuming you have a way to assert that the mocked functions were called as expected.
    // For example, with Jest, you could use expect(mockFunction).toHaveBeenCalledWith(expectedArgument);
  });

  it("should leave possibleCorrectCompanyNameFromPrevMonthStokAlat undefined when no previous data company has a correctCompanyName the same as current month's correctCompanyName", () => {
    const prevCorrectCompanyNames = {
      "Company B": {
        typoCompanyNames: ["Cmpany B"],
        correctCompanyName: "Company B",
      },
    };

    const currentClustered = {
      "Company A": {
        typoCompanyNames: ["Comapny A", "Cmpany A"],
        correctCompanyName: "Company A",
      },
    };

    const expected = {
      "Company A": {
        typoCompanyNames: ["Comapny A", "Cmpany A"],
        correctCompanyName: "Company A",
        possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      },
    };

    expect(
      annotateClustered(prevCorrectCompanyNames, currentClustered)
    ).toEqual(expected);
    // Assuming you have a way to assert that the mocked functions were called as expected.
    // For example, with Jest, you could use expect(mockFunction).toHaveBeenCalledWith(expectedArgument);
  });

  // Add more tests as needed...
});
