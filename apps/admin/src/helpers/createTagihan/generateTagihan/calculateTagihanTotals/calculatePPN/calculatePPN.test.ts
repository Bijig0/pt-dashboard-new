import { calculatePPN } from "./calculatePPN";

describe("calculatePPN", () => {
  it("should calculate ppn correctly", () => {
    const total = 100;
    const expected = 11;
    expect(calculatePPN(total)).toEqual(expected);
  });

  it("should round to two decimal places correctly", () => {
    const total = 100.5;
    const expected = 11.06;
    expect(calculatePPN(total)).toEqual(expected);
  });
});
