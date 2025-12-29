import { describe, expect, it } from "vitest";
import { groupItemsByName } from "./groupItems";

describe("groupItemsByName", () => {
  it("should merge items with the same name and sum their prices", () => {
    const input = [
      { itemName: "Apple", itemPrice: 10 },
      { itemName: "Banana", itemPrice: 5 },
      { itemName: "Apple", itemPrice: 15 },
    ];

    const expected = {
      items: [
        { itemName: "Apple", itemPrice: 25 },
        { itemName: "Banana", itemPrice: 5 },
      ],
      total: 30,
    };

    const result = groupItemsByName({ items: input });
    expect(result).toEqual(expected);
  });

  it("should handle empty array", () => {
    const input: { itemName: string; itemPrice: number }[] = [];
    const result = groupItemsByName({ items: input });
    expect(result).toEqual({ items: [], total: 0 });
  });
});
