import { clusterSimilarWords } from "./clusterSimilarWords";

describe("clusterSimilarWords", () => {
  test("clusters words with a small threshold", () => {
    const words = ["cat", "bat", "rat", "dog", "bog"];
    const threshold = 1;
    const expected = [
      ["cat", "bat", "rat"],
      ["dog", "bog"],
    ];
    expect(clusterSimilarWords(words, threshold)).toEqual(expected);
  });

  test("clusters words with a larger threshold", () => {
    const words = ["hello", "hallo", "hullo", "world", "word"];
    const threshold = 2;
    const expected = [
      ["hello", "hallo", "hullo"],
      ["world", "word"],
    ];
    expect(clusterSimilarWords(words, threshold)).toEqual(expected);
  });

  test("returns individual words when threshold is zero", () => {
    const words = ["one", "two", "three"];
    const threshold = 0;
    const expected = words.map((word) => [word]);
    expect(clusterSimilarWords(words, threshold)).toEqual(expected);
  });

  test("handles empty input", () => {
    const words: never[] = [];
    const threshold = 1;
    const expected: never[] = [];
    expect(clusterSimilarWords(words, threshold)).toEqual(expected);
  });

  test("removes duplicate words within clusters", () => {
    const words = ["see", "sea", "see", "tea", "tee", "tea"];
    const threshold = 1;
    const expected = [
      ["see", "sea"],
      ["tea", "tee"],
    ];
    const result = clusterSimilarWords(words, threshold);
    console.log({ result });

    expect(clusterSimilarWords(words, threshold)).toEqual(expected);
  });
});
