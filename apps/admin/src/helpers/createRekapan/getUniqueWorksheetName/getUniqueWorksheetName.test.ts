import { createUniqueWorksheetNameGenerator } from "./getUniqueWorksheetName";

describe("createUniqueWorksheetNameGenerator", () => {
  it("should return the same name if it's unique", () => {
    const getUniqueName = createUniqueWorksheetNameGenerator();

    expect(getUniqueName("Company A")).toBe("Company A");
    expect(getUniqueName("Company B")).toBe("Company B");
  });

  it("should append (2) for the first duplicate", () => {
    const getUniqueName = createUniqueWorksheetNameGenerator();

    expect(getUniqueName("Company A")).toBe("Company A");
    expect(getUniqueName("Company A")).toBe("Company A (2)");
  });

  it("should increment the counter for multiple duplicates", () => {
    const getUniqueName = createUniqueWorksheetNameGenerator();

    expect(getUniqueName("Company A")).toBe("Company A");
    expect(getUniqueName("Company A")).toBe("Company A (2)");
    expect(getUniqueName("Company A")).toBe("Company A (3)");
    expect(getUniqueName("Company A")).toBe("Company A (4)");
  });

  it("should handle mixed unique and duplicate names", () => {
    const getUniqueName = createUniqueWorksheetNameGenerator();

    expect(getUniqueName("Company A")).toBe("Company A");
    expect(getUniqueName("Company B")).toBe("Company B");
    expect(getUniqueName("Company A")).toBe("Company A (2)");
    expect(getUniqueName("Company C")).toBe("Company C");
    expect(getUniqueName("Company B")).toBe("Company B (2)");
  });

  it("should truncate base name to fit suffix within 31 chars", () => {
    const getUniqueName = createUniqueWorksheetNameGenerator();

    // 31 character name
    const longName = "A".repeat(31);
    expect(getUniqueName(longName)).toBe(longName);

    // Second use should truncate to make room for " (2)" (4 chars)
    // So base should be 27 chars + " (2)" = 31 chars
    const expected = "A".repeat(27) + " (2)";
    expect(getUniqueName(longName)).toBe(expected);
    expect(getUniqueName(longName).length).toBe(31);
  });

  it("should handle names that are already at 31 chars with higher counters", () => {
    const getUniqueName = createUniqueWorksheetNameGenerator();

    const longName = "A".repeat(31);

    // Use it 10 times to get to (10) which needs 5 chars for suffix
    for (let i = 0; i < 9; i++) {
      getUniqueName(longName);
    }

    // 10th use: " (10)" is 5 chars, so base should be 26 chars
    const result = getUniqueName(longName);
    expect(result).toBe("A".repeat(26) + " (10)");
    expect(result.length).toBe(31);
  });

  it("should handle short names without truncation", () => {
    const getUniqueName = createUniqueWorksheetNameGenerator();

    expect(getUniqueName("ABC")).toBe("ABC");
    expect(getUniqueName("ABC")).toBe("ABC (2)");
    expect(getUniqueName("ABC")).toBe("ABC (3)");
  });

  it("should create independent generators", () => {
    const generator1 = createUniqueWorksheetNameGenerator();
    const generator2 = createUniqueWorksheetNameGenerator();

    expect(generator1("Company A")).toBe("Company A");
    expect(generator2("Company A")).toBe("Company A"); // Independent, so no conflict

    expect(generator1("Company A")).toBe("Company A (2)");
    expect(generator2("Company A")).toBe("Company A (2)");
  });
});
