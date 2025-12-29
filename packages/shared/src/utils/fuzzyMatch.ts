import { distance } from "fastest-levenshtein";

/**
 * Result of a fuzzy match operation
 */
export interface MatchResult {
  name: string;
  distance: number;
  similarity: number;
  isExactMatch: boolean;
}

/**
 * Calculate normalized similarity score (0-1) between two strings
 * 1.0 = exact match, 0.0 = completely different
 */
export function getSimilarity(a: string, b: string): number {
  const dist = distance(a.toLowerCase(), b.toLowerCase());
  const maxLength = Math.max(a.length, b.length);
  if (maxLength === 0) return 1;
  return 1 - dist / maxLength;
}

/**
 * Find closest matches for an input string from a list of candidates
 * Returns matches sorted by similarity (highest first)
 */
export function findClosestMatches(
  input: string,
  candidates: string[],
  limit: number = 5,
  threshold: number = 0.6
): MatchResult[] {
  const inputLower = input.toLowerCase();

  const results: MatchResult[] = candidates.map((name) => {
    const dist = distance(inputLower, name.toLowerCase());
    const maxLength = Math.max(input.length, name.length);
    const similarity = maxLength === 0 ? 1 : 1 - dist / maxLength;

    return {
      name,
      distance: dist,
      similarity,
      isExactMatch: dist === 0,
    };
  });

  return results
    .filter((r) => r.similarity >= threshold)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Check if a string has an exact match in a list of candidates (case-insensitive)
 */
export function hasExactMatch(input: string, candidates: string[]): boolean {
  const inputLower = input.toLowerCase();
  return candidates.some((c) => c.toLowerCase() === inputLower);
}

/**
 * Find the best match for an input string from a list of candidates
 * Returns undefined if no match meets the threshold
 */
export function findBestMatch(
  input: string,
  candidates: string[],
  threshold: number = 0.6
): MatchResult | undefined {
  const matches = findClosestMatches(input, candidates, 1, threshold);
  return matches[0];
}

/**
 * Cluster similar words based on Levenshtein distance
 * Words within the threshold distance are grouped together
 */
export function clusterSimilarWords(
  words: string[],
  threshold: number
): string[][] {
  if (threshold === 0) return words.map((word) => [word]);
  const clusters: string[][] = words.map((word) => [word]);

  let merged = true;
  while (merged) {
    merged = false;
    for (let i = 0; i < clusters.length; i++) {
      for (let j = i + 1; j < clusters.length; j++) {
        // Check if all words in clusters[i] are within the threshold distance of all words in clusters[j]
        if (
          clusters[i]!.every((word1) =>
            clusters[j]!.every((word2) => distance(word1, word2) <= threshold)
          )
        ) {
          clusters[i] = clusters[i]!.concat(clusters[j]!);
          clusters.splice(j, 1);
          merged = true;
          break;
        }
      }
      if (merged) break;
    }
  }

  // Remove duplicates within each cluster
  return clusters.map((cluster) => Array.from(new Set(cluster)));
}

/**
 * Find the list/cluster with the word most similar to the search word
 */
export function findMostSimilarList(
  lists: string[][],
  searchWord: string,
  threshold: number
): string[] | undefined {
  let minDistance = Infinity;
  let mostSimilarList: string[] = [];

  lists.forEach((list) => {
    list.forEach((word) => {
      const currentDistance = distance(word, searchWord);
      if (currentDistance < minDistance) {
        minDistance = currentDistance;
        mostSimilarList = list;
      }
    });
  });

  if (minDistance <= threshold) {
    return mostSimilarList;
  } else {
    return undefined;
  }
}

// Re-export distance function from fastest-levenshtein for convenience
export { distance as levenshteinDistance } from "fastest-levenshtein";
