import { describe, expect, it, vi } from "vitest";
import { dataTagihanRowSchema, dataTagihanSchema } from "./schema";
import * as TestPPAPatternModule from "./testPPAPattern";

const testPPAPatternSpy = vi.spyOn(TestPPAPatternModule, "testPPAPattern");

describe("dataTagihanRowSchema", () => {
  beforeEach(() => {
    vi.restoreAllMocks(); // Restore mocks before each test
  });

  it("should pass when the second element matches the PPA pattern", () => {
    testPPAPatternSpy.mockReturnValue(true);

    const validData = ["any", "1234/PPA-I/24"];
    const result = dataTagihanRowSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail and return an empty array when the second element does not match the PPA pattern", () => {
    testPPAPatternSpy.mockReturnValue(false);

    const invalidData = ["any", "invalid"];
    const result = dataTagihanRowSchema.safeParse(invalidData);
    expect(result.data).toEqual([]); // Expect the data to be an empty array
  });

  it("should fail and return an empty array when the array has less than 2 elements", () => {
    const invalidData = ["onlyOne"];
    const result = dataTagihanRowSchema.safeParse(invalidData);
    expect(result.data).toEqual([]); // Expect the data to be an empty array
  });

  it("should correctly return an empty array when the validation fails", () => {
    testPPAPatternSpy.mockReturnValue(false);

    const invalidData = ["any", "invalid"];
    const result = dataTagihanRowSchema.safeParse(invalidData);
    expect(result.data).toEqual([]); // Ensure the returned data is an empty array
  });
});

describe("dataTagihanSchema", () => {
  it("should pass when all rows match the schema", () => {
    testPPAPatternSpy.mockReturnValue(true);

    const validData = [
      ["any", "1234/PPA-I/24"],
      ["another", "5678/PPA-I/24"],
    ];
    const result = dataTagihanSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it("should fail and return empty arrays for rows that do not match the schema", () => {
    testPPAPatternSpy.mockReturnValueOnce(true).mockReturnValueOnce(false);

    const invalidData = [
      ["any", "1234/PPA-I/24"],
      ["another", "invalid"],
    ];
    const result = dataTagihanSchema.safeParse(invalidData);
    expect(result.success).toBe(true); // The schema itself is valid
    expect(result.data).toEqual([["any", "1234/PPA-I/24"], []]); // Expect the invalid row to be an empty array
  });
});
