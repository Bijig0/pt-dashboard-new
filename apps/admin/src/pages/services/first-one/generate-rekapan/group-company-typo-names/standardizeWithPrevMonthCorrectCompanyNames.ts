// Put a thing here that iterates through the cluster
// And if there's any company name that's in prevMonthCorrectCompanyNames

import { objectValues } from "../../../../../helpers/objectValues";
import { assert } from "../../../../../utils/assert";
import { ClusteredCompanyNames, Moved } from "./types";

export const separateMovedToNewClustersIntoSeparateClusters = (
  prevClusters: string[][],
  prevMonthCorrectCompanyNames: ClusteredCompanyNames
): string[][] => {
  const newClusters = [];

  // Iterate over each cluster
  for (const cluster of prevClusters) {
    // Initialize a new cluster to hold the remaining company names
    const newCluster = [];

    // Iterate over each company name in the cluster
    for (const companyName of cluster) {
      // Check if the company name has a correction
      const shouldSeparateIntoItsOwnCluster =
        companyName in prevMonthCorrectCompanyNames &&
        prevMonthCorrectCompanyNames[companyName]!.split;

      if (shouldSeparateIntoItsOwnCluster) {
        // If a correction exists, create a new cluster with the corrected name
        newClusters.push([companyName]);
      } else {
        // Otherwise, add the company name to the new cluster
        newCluster.push(companyName);
      }
    }

    // Add the new cluster to the new clusters array, if it's not empty
    if (newCluster.length > 0) {
      newClusters.push(newCluster);
    }
  }
  return newClusters;
};

function getUniqueListBy(arr: any[], key: string) {
  return [...new Map(arr.map((item) => [item[key], item])).values()];
}

export const separateMovedToDestinationCompanyNamesToIntendedDestinations = (
  prevClusters: string[][],
  prevMonthCorrectCompanyNames: ClusteredCompanyNames
): string[][] => {
  const newClusters = [...prevClusters]; // Copy the existing clusters

  const values = objectValues(prevMonthCorrectCompanyNames);

  console.log({ values });

  const movedRows = values.filter((row) => row.moved);

  console.log({ movedRows });

  const movedOnly = movedRows.map((row) => row.moved).flat();

  console.log({ movedOnly });

  assert(movedOnly.length % 2 === 0);

  const uniqueMovedRows = getUniqueListBy(
    movedOnly,
    "typoCompanyNameMoved"
  ) as Moved[];

  assert(movedOnly.length / 2 === uniqueMovedRows.length);

  console.log({ uniqueMovedRows });

  for (const moved of uniqueMovedRows) {
    const movedTypoCompanyNamesIndexInNewClusters = newClusters.findIndex((c) =>
      c.includes(moved.typoCompanyNameMoved)
    );

    if (movedTypoCompanyNamesIndexInNewClusters === -1)
      throw new Error("Moved typo name not found");

    const movedItemIndexInRow = newClusters[
      movedTypoCompanyNamesIndexInNewClusters
    ]?.findIndex((companyName) => {
      return companyName === moved.typoCompanyNameMoved;
    })!;

    newClusters[movedTypoCompanyNamesIndexInNewClusters]?.splice(
      movedItemIndexInRow,
      1
    );

    const toMoveIndexInNewClusters = newClusters.findIndex((c) =>
      c.includes(moved.to)
    );

    if (toMoveIndexInNewClusters === -1)
      throw new Error("Moved typo name not found");

    if (toMoveIndexInNewClusters === movedTypoCompanyNamesIndexInNewClusters)
      throw new Error("Moved typo name to the same cluster");
    newClusters[toMoveIndexInNewClusters]?.push(moved.typoCompanyNameMoved);
  }

  // Iterate over each cluster

  return newClusters;
};

const standardizeWithPrevMonthCorrectCompanyNames =
  (prevMonthCorrectCompanyNames: ClusteredCompanyNames | undefined) =>
  (clusteredCompanyNames: string[][]): string[][] => {
    if (!prevMonthCorrectCompanyNames) return clusteredCompanyNames;

    const separatedClusters = separateMovedToNewClustersIntoSeparateClusters(
      clusteredCompanyNames,
      prevMonthCorrectCompanyNames
    );

    const moved = separateMovedToDestinationCompanyNamesToIntendedDestinations(
      separatedClusters,
      prevMonthCorrectCompanyNames
    );

    return moved;
  };

// @ts-ignore
if (import.meta.main) {
  const currentClusters = [
    ["ACSET AHM", "ACSET ABM", "ACSET AHN"],
    ["ACSET ADM", "ACSET ADD"],
    ["ACSET ASYA", "ACSET ASIA"],
    ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
    ["ACSET GLOBAL", "ACSET GLOBE"],
    ["ACSET TECH", "ACSET TECHNOLOGY"],
  ];

  const prevMonthCorrectCompanyNames: ClusteredCompanyNames = {
    "ACSET AHM": {
      typoCompanyNames: ["ACSET AHM"],
      correctCompanyName: "ACSET AHM",
      possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      moved: [
        {
          typoCompanyNameMoved: "ACSET AHN",
          from: "ACSET AHM",
          to: "ACSET ASYA",
        },
      ],
    },
    "ACSET ADM": {
      typoCompanyNames: ["ACSET ADM", "ACSET ABM"],
      correctCompanyName: "ACSET ADM",
      possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      moved: [],
    },
    "ACSET ASYA": {
      typoCompanyNames: ["ACSET ASYA", "ACSET ASIA", "ACSET AHN"],
      correctCompanyName: "ACSET ASYA",
      possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
      moved: [
        {
          typoCompanyNameMoved: "ACSET AHN",
          from: "ACSET AHM",
          to: "ACSET ASYA",
        },
      ],
    },
    "ACSET GENOVA": {
      typoCompanyNames: ["ACSET GENOVA", "ACSAET GENOVA", "ACSET GENEVA"],
      correctCompanyName: "ACSET GENOVA",
      possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
    },
    "ACSET GLOBAL": {
      typoCompanyNames: ["ACSET GLOBAL", "ACSET GLOBE", "ACSET ADD"],
      correctCompanyName: "ACSET GLOBAL",
      possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
    },
    "ACSET TECH": {
      typoCompanyNames: ["ACSET TECH", "ACSET TECHNOLOGY"],
      correctCompanyName: "ACSET TECH",
      possibleCorrectCompanyNameFromPrevMonthStokAlat: undefined,
    },
  };

  const result = separateMovedToDestinationCompanyNamesToIntendedDestinations(
    currentClusters,
    prevMonthCorrectCompanyNames
  );

  console.log({ result });
}

export default standardizeWithPrevMonthCorrectCompanyNames;
