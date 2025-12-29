import { getSumOfAllNegatives } from "./getSumOfAllNegatives";

describe("getSumOfAllNegatives", () => {
  it("should correctly sum all negative numbers for each alat", () => {
    const input = {
      "Alat 1": {
        records: [
          { jumlah: -5 },
          { jumlah: 10 },
          { jumlah: -3 },
          { jumlah: -2 },
        ],
      },
      "Alat 2": {
        records: [{ jumlah: 5 }, { jumlah: -1 }, { jumlah: -4 }],
      },
    };

    const result = getSumOfAllNegatives(input);

    expect(result).toEqual({
      "Alat 1": { negativesSum: -10 },
      "Alat 2": { negativesSum: -5 },
    });
  });

  it("should return 0 when there are no negative numbers", () => {
    const input = {
      "Alat 3": {
        records: [{ jumlah: 5 }, { jumlah: 3 }, { jumlah: 2 }],
      },
    };

    const result = getSumOfAllNegatives(input);

    expect(result).toEqual({
      "Alat 3": { negativesSum: 0 },
    });
  });

  it("should handle empty records array", () => {
    const input = {
      "Alat 4": {
        records: [],
      },
    };

    const result = getSumOfAllNegatives(input);

    expect(result).toEqual({
      "Alat 4": { negativesSum: 0 },
    });
  });

  it("should handle multiple alat with mixed positive and negative numbers", () => {
    const input = {
      "Alat 5": {
        records: [{ jumlah: -1 }, { jumlah: 2 }, { jumlah: -3 }],
      },
      "Alat 6": {
        records: [{ jumlah: 5 }, { jumlah: -2 }, { jumlah: 3 }, { jumlah: -4 }],
      },
      "Alat 7": {
        records: [{ jumlah: 1 }, { jumlah: 2 }, { jumlah: 3 }],
      },
    };

    const result = getSumOfAllNegatives(input);

    expect(result).toEqual({
      "Alat 5": { negativesSum: -4 },
      "Alat 6": { negativesSum: -6 },
      "Alat 7": { negativesSum: 0 },
    });
  });
});
