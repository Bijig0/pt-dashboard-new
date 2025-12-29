import { findMostSimilarList } from "./findMostSimilarList";

describe("findMostSimilarList", () => {
  test("finds the most similar list when within threshold", () => {
    const lists = [
      ["cat", "bat"],
      ["dog", "bog"],
    ];
    const searchWord = "bag";
    const threshold = 1;
    const expected = ["cat", "bat"];
    expect(findMostSimilarList(lists, searchWord, threshold)).toEqual(expected);
  });

  test("returns undefined when no list is within threshold", () => {
    const lists = [
      ["cat", "bat"],
      ["dog", "bog"],
    ];
    const searchWord = "tree";
    const threshold = 2;
    expect(findMostSimilarList(lists, searchWord, threshold)).toBeUndefined();
  });

  test("handles empty input lists", () => {
    const lists: never[] = [];
    const searchWord = "test";
    const threshold = 1;
    expect(findMostSimilarList(lists, searchWord, threshold)).toBeUndefined();
  });

  test("handles case where search word is in a list", () => {
    const lists = [
      ["hello", "world"],
      ["test", "case"],
    ];
    const searchWord = "test";
    const threshold = 2;
    const expected = ["test", "case"];
    expect(findMostSimilarList(lists, searchWord, threshold)).toEqual(expected);
  });

  test("returns the first list if multiple lists have words at the same minimum distance", () => {
    const lists = [
      ["apple", "orange"],
      ["cat", "bat"],
      ["dog", "bog"],
    ];
    const searchWord = "bat";
    const threshold = 0;
    const expected = ["cat", "bat"];
    expect(findMostSimilarList(lists, searchWord, threshold)).toEqual(expected);
  });
});
