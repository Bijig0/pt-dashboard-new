import { ItemsSchema } from "../createItems/schema/schema";
import { sortItemsByName } from "./sortItemsByName";

describe("sortItemsByName", () => {
  it("should sort items alphabetically in a case-insensitive manner", () => {
    const unsortedItems: ItemsSchema = [
      { itemName: "Zebra", itemPrice: 10 },
      { itemName: "apple", itemPrice: 5 },
      { itemName: "Banana", itemPrice: 7 },
    ];

    const expectedSortedItems: ItemsSchema = [
      { itemName: "apple", itemPrice: 5 },
      { itemName: "Banana", itemPrice: 7 },
      { itemName: "Zebra", itemPrice: 10 },
    ];

    const sortedItems = sortItemsByName(unsortedItems);
    expect(sortedItems).toEqual(expectedSortedItems);
  });

  it("should return an empty array when input is empty", () => {
    const unsortedItems: ItemsSchema = [];

    const sortedItems = sortItemsByName(unsortedItems);
    expect(sortedItems).toEqual([]);
  });
});
