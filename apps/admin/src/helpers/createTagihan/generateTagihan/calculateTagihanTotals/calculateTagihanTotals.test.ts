import { describe, expect, it, vi } from "vitest";
import { calculateTagihanTotals } from "./calculateTagihanTotals";

vi.mock("./calculatePPN/calculatePPN", () => {
  return {
    calculatePPN: vi.fn((total) => total - 1), // Hardcoded value
  };
});

describe("calculateTagihanTotals", () => {
  it("should correctly calculate totals for a single alat", () => {
    const input = {
      "Alat 1": { recordsSubtotal: 1000 },
    };

    const result = calculateTagihanTotals(input);

    expect(result).toEqual({
      data: input,
      total: 1000,
      ppn: 999,
      totalAfterPPN: 1,
    });
  });

  it("should correctly calculate totals for multiple alat", () => {
    const input = {
      "Alat 1": { recordsSubtotal: 1000 },
      "Alat 2": { recordsSubtotal: 2000 },
      "Alat 3": { recordsSubtotal: 3000 },
    };

    const result = calculateTagihanTotals(input);

    expect(result).toEqual({
      data: input,
      total: 6000,
      ppn: 5999,
      totalAfterPPN: 1,
    });
  });

  it("should handle zero values correctly", () => {
    const input = {
      "Alat 1": { recordsSubtotal: 0 },
      "Alat 2": { recordsSubtotal: 0 },
    };

    const result = calculateTagihanTotals(input);

    expect(result).toEqual({
      data: input,
      total: 0,
      ppn: -1,
      totalAfterPPN: 1,
    });
  });

  it("should handle negative values correctly", () => {
    const input = {
      "Alat 1": { recordsSubtotal: 1000 },
      "Alat 2": { recordsSubtotal: -500 },
    };

    const result = calculateTagihanTotals(input);

    expect(result).toEqual({
      data: input,
      total: 500,
      ppn: 499,
      totalAfterPPN: 1,
    });
  });

  it("should handle empty input correctly", () => {
    const input = {};

    const result = calculateTagihanTotals(input);

    expect(result).toEqual({
      data: {},
      total: 0,
      ppn: -1,
      totalAfterPPN: 1,
    });
  });

  it("should preserve the input data structure", () => {
    const input = {
      "Alat 1": { recordsSubtotal: 1000 },
      "Alat 2": { recordsSubtotal: 2000 },
    };

    const result = calculateTagihanTotals(input);

    expect(result.data).toBe(input);
  });
});
