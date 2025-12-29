import { calculateTotal } from "./calculateTotal";

describe("calculateTotal", () => {
  it("should calculate total of multiple items", () => {
    const items = [
      { itemName: "Item 1", itemPrice: 10 },
      { itemName: "Item 2", itemPrice: 20 },
      { itemName: "Item 3", itemPrice: 30 },
    ];

    expect(calculateTotal(items)).toBe(60);
  });

  it("should return 0 for an empty array", () => {
    expect(calculateTotal([])).toBe(0);
  });

  it("should handle items with decimal prices", () => {
    const items = [
      { itemName: "Item 1", itemPrice: 10.5 },
      { itemName: "Item 2", itemPrice: 20.25 },
    ];

    expect(calculateTotal(items)).toBe(30.75);
  });

  it("should handle negative prices", () => {
    const items = [
      { itemName: "Item 1", itemPrice: 10 },
      { itemName: "Item 2", itemPrice: -5 },
    ];

    expect(calculateTotal(items)).toBe(5);
  });
});
