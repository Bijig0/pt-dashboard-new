import { createWorksheetCurrentBulanTotalSewaAlatAmountObj } from "./createWorksheetCurrentBulanTotalSewaAlatAmountObj";

describe("createWorksheetCurrentBulanTotalSewaAlatAmountObj", () => {
  it("should correctly calculate currentBulanTotalSewaAlatAmount for single alat", () => {
    const worksheet = {
      records: [
        { stokDifference: 5, alatName: "Alat1" },
        { stokDifference: 3, alatName: "Alat1" },
        { stokDifference: 2, alatName: "Alat1" },
      ],
    };

    const prevBulanObj = {
      Alat1: { prevBulanTotalSewaAlatAmount: 10 },
    };

    const result = createWorksheetCurrentBulanTotalSewaAlatAmountObj(
      worksheet,
      prevBulanObj
    );

    expect(result).toEqual({
      Alat1: { currentBulanTotalSewaAlatAmount: 20 }, // 5 + 3 + 2 + 10
    });
  });

  it("should correctly calculate currentBulanTotalSewaAlatAmount for multiple alat", () => {
    const worksheet = {
      records: [
        { stokDifference: 5, alatName: "Alat1" },
        { stokDifference: 3, alatName: "Alat2" },
        { stokDifference: 2, alatName: "Alat1" },
        { stokDifference: 4, alatName: "Alat2" },
      ],
    };

    const prevBulanObj = {
      Alat1: { prevBulanTotalSewaAlatAmount: 10 },
      Alat2: { prevBulanTotalSewaAlatAmount: 15 },
    };

    const result = createWorksheetCurrentBulanTotalSewaAlatAmountObj(
      worksheet,
      prevBulanObj
    );

    expect(result).toEqual({
      Alat1: { currentBulanTotalSewaAlatAmount: 17 }, // 5 + 2 + 10
      Alat2: { currentBulanTotalSewaAlatAmount: 22 }, // 3 + 4 + 15
    });
  });

  it("should handle empty records", () => {
    const worksheet = {
      records: [],
    };

    const prevBulanObj = {
      Alat1: { prevBulanTotalSewaAlatAmount: 10 },
    };

    const result = createWorksheetCurrentBulanTotalSewaAlatAmountObj(
      worksheet,
      prevBulanObj
    );

    expect(result).toEqual({
      Alat1: { currentBulanTotalSewaAlatAmount: 10 }, // Only prevBulanTotalSewaAlatAmount
    });
  });

  it("should throw error when stokDifference is null", () => {
    const worksheet = {
      records: [{ stokDifference: null, alatName: "Alat1" }],
    };

    const prevBulanObj = {
      Alat1: { prevBulanTotalSewaAlatAmount: 10 },
    };

    expect(() => {
      createWorksheetCurrentBulanTotalSewaAlatAmountObj(
        worksheet,
        prevBulanObj
      );
    }).toThrow("stokDifference is null");
  });

  it("should handle new alat not present in prevBulanObj", () => {
    const worksheet = {
      records: [
        { stokDifference: 5, alatName: "Alat1" },
        { stokDifference: 3, alatName: "Alat2" },
      ],
    };

    const prevBulanObj = {
      Alat1: { prevBulanTotalSewaAlatAmount: 10 },
    };

    const result = createWorksheetCurrentBulanTotalSewaAlatAmountObj(
      worksheet,
      prevBulanObj
    );

    expect(result).toEqual({
      Alat1: { currentBulanTotalSewaAlatAmount: 15 }, // 5 + 10
      Alat2: { currentBulanTotalSewaAlatAmount: 3 }, // 3 + 0 (no prev month amount)
    });
  });
});
