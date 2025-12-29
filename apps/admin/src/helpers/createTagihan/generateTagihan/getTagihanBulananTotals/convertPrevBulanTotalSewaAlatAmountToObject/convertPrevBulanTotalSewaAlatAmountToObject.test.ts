import { convertPrevBulanTotalSewaAlatAmountToObject } from "./convertPrevBulanTotalSewaAlatAmountToObject";

describe("convertPrevBulanTotalSewaAlatAmountToObject", () => {
  it("should convert an array of alat names and jumlahAlat to an object", () => {
    const input = [
      { alatName: "alat1", jumlahAlat: 10 },
      { alatName: "alat2", jumlahAlat: 20 },
    ];

    const expectedOutput = {
      alat1: {
        prevBulanTotalSewaAlatAmount: 10,
      },
      alat2: {
        prevBulanTotalSewaAlatAmount: 20,
      },
    };

    expect(convertPrevBulanTotalSewaAlatAmountToObject(input)).toEqual(
      expectedOutput
    );
  });

  it("should handle an empty input array", () => {
    const input: { alatName: string; jumlahAlat: number }[] = [];

    const expectedOutput = {};

    expect(convertPrevBulanTotalSewaAlatAmountToObject(input)).toEqual(
      expectedOutput
    );
  });

  it.todo("should run a test to handle the weird error don't know");

  it("should handle input with duplicate alat names", () => {
    const input = [
      { alatName: "alat1", jumlahAlat: 10 },
      { alatName: "alat1", jumlahAlat: 20 },
    ];

    const expectedOutput = {
      alat1: {
        prevBulanTotalSewaAlatAmount: 10,
      },
    };

    expect(convertPrevBulanTotalSewaAlatAmountToObject(input)).toEqual(
      expectedOutput
    );
  });
});
