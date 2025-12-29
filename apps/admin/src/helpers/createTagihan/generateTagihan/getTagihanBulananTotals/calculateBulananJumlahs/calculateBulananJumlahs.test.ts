import { calculateBulananJumlahs } from "./calculateBulananJumlahs";

describe("calculateBulananJumlahs", () => {
  it("should correctly calculate bulananJumlah for a single alat", () => {
    const input = {
      prevBulanObj: {
        "Alat 1": { prevBulanTotalSewaAlatAmount: 100 },
      },
      firstDateAmountIfPresent: {
        "Alat 1": { firstDateAmount: 50 },
      },
      sumOfAllNegatives: {
        "Alat 1": { negativesSum: -20 },
      },
    };

    const result = calculateBulananJumlahs(input);

    expect(result).toEqual({
      "Alat 1": { bulananJumlah: 130 },
    });
  });

  it("should handle multiple alat calculations", () => {
    const input = {
      prevBulanObj: {
        "Alat 1": { prevBulanTotalSewaAlatAmount: 100 },
        "Alat 2": { prevBulanTotalSewaAlatAmount: 200 },
      },
      firstDateAmountIfPresent: {
        "Alat 1": { firstDateAmount: 50 },
        "Alat 2": { firstDateAmount: 75 },
      },
      sumOfAllNegatives: {
        "Alat 1": { negativesSum: -20 },
        "Alat 2": { negativesSum: -30 },
      },
    };

    const result = calculateBulananJumlahs(input);

    expect(result).toEqual({
      "Alat 1": { bulananJumlah: 130 },
      "Alat 2": { bulananJumlah: 245 },
    });
  });

  it("should handle missing data for some alat", () => {
    const input = {
      prevBulanObj: {
        "Alat 1": { prevBulanTotalSewaAlatAmount: 100 },
        "Alat 2": { prevBulanTotalSewaAlatAmount: 200 },
      },
      firstDateAmountIfPresent: {
        "Alat 1": { firstDateAmount: 50 },
      },
      sumOfAllNegatives: {
        "Alat 2": { negativesSum: -30 },
      },
    };

    const result = calculateBulananJumlahs(input);

    expect(result).toEqual({
      "Alat 1": { bulananJumlah: 150 },
      "Alat 2": { bulananJumlah: 170 },
    });
  });

  it("should handle empty input", () => {
    const input = {
      prevBulanObj: {},
      firstDateAmountIfPresent: {},
      sumOfAllNegatives: {},
    };

    const result = calculateBulananJumlahs(input);

    expect(result).toEqual({});
  });

  it("should handle negative results", () => {
    const input = {
      prevBulanObj: {
        "Alat 1": { prevBulanTotalSewaAlatAmount: 100 },
      },
      firstDateAmountIfPresent: {
        "Alat 1": { firstDateAmount: -150 },
      },
      sumOfAllNegatives: {
        "Alat 1": { negativesSum: -50 },
      },
    };

    const result = calculateBulananJumlahs(input);

    expect(result).toEqual({
      "Alat 1": { bulananJumlah: -100 },
    });
  });

  it("should handle the provided input correctly", () => {
    const input = {
      sumOfAllNegatives: {
        "Alat 1": {
          negativesSum: 0,
        },
      },
      firstDateAmountIfPresent: {
        "Alat 1": {
          firstDateAmount: 0,
        },
      },
      prevBulanObj: {
        "Alat 1": {
          prevBulanTotalSewaAlatAmount: 10,
        },
        "Alat 2": {
          prevBulanTotalSewaAlatAmount: 20,
        },
      },
    };

    const result = calculateBulananJumlahs(input);

    expect(result).toEqual({
      "Alat 1": { bulananJumlah: 10 },
      "Alat 2": { bulananJumlah: 20 },
    });
  });
});
