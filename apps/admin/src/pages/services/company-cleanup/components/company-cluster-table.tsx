import { Badge, Checkbox, Table } from "flowbite-react";
import { useState } from "react";
import { HiChevronDown, HiChevronRight } from "react-icons/hi";
import { RecordCompanyName } from "../../../../hooks/useCompanyNameCorrections";

type CompanyClusterTableProps = {
  clusters: string[][];
  companyNames: RecordCompanyName[];
  corrections: Map<string, string>;
  onCorrectionChange: (oldName: string, newName: string) => void;
  pendingExclusions: Set<string>;
  onExclusionChange: (name: string, exclude: boolean) => void;
};

const CompanyClusterTable = ({
  clusters,
  companyNames,
  corrections,
  onCorrectionChange,
  pendingExclusions,
  onExclusionChange,
}: CompanyClusterTableProps) => {
  const [expandedClusters, setExpandedClusters] = useState<Set<number>>(
    new Set(clusters.map((_, i) => i)) // All expanded by default
  );

  const toggleCluster = (index: number) => {
    const newExpanded = new Set(expandedClusters);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedClusters(newExpanded);
  };

  const getRecordCount = (name: string): number => {
    return companyNames.find((c) => c.company_name === name)?.record_count ?? 0;
  };

  // Find the name with most records in a cluster (suggested canonical name)
  const getSuggestedCanonical = (cluster: string[]): string => {
    let maxCount = -1;
    let suggested = cluster[0];
    for (const name of cluster) {
      const count = getRecordCount(name);
      if (count > maxCount) {
        maxCount = count;
        suggested = name;
      }
    }
    return suggested;
  };

  return (
    <div className="space-y-4">
      {clusters.map((cluster, clusterIndex) => {
        const isExpanded = expandedClusters.has(clusterIndex);
        const suggestedCanonical = getSuggestedCanonical(cluster);
        const clusterCorrections = cluster.filter(
          (name) =>
            corrections.has(name) && corrections.get(name) !== name
        );

        return (
          <div
            key={clusterIndex}
            className="rounded-lg border border-gray-200 dark:border-gray-700"
          >
            {/* Cluster Header */}
            <button
              onClick={() => toggleCluster(clusterIndex)}
              className="flex w-full items-center justify-between bg-gray-50 px-4 py-3 text-left dark:bg-gray-800"
            >
              <div className="flex items-center gap-3">
                {isExpanded ? (
                  <HiChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <HiChevronRight className="h-5 w-5 text-gray-500" />
                )}
                <span className="font-medium text-gray-900 dark:text-white">
                  Cluster {clusterIndex + 1}
                </span>
                <Badge color="gray">{cluster.length} names</Badge>
                {clusterCorrections.length > 0 && (
                  <Badge color="green">
                    {clusterCorrections.length} selected
                  </Badge>
                )}
              </div>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                Suggested: {suggestedCanonical}
              </span>
            </button>

            {/* Cluster Content */}
            {isExpanded && (
              <div className="overflow-x-auto">
                <Table>
                  <Table.Head>
                    <Table.HeadCell className="w-24">Keep Same</Table.HeadCell>
                    <Table.HeadCell>Company Name</Table.HeadCell>
                    <Table.HeadCell className="text-right">
                      Records
                    </Table.HeadCell>
                    <Table.HeadCell>Correct To</Table.HeadCell>
                  </Table.Head>
                  <Table.Body className="divide-y">
                    {cluster.map((name) => {
                      const recordCount = getRecordCount(name);
                      const selectedCorrection = corrections.get(name);
                      const isBeingCorrected =
                        selectedCorrection && selectedCorrection !== name;
                      const isExcluded = pendingExclusions.has(name);

                      return (
                        <Table.Row
                          key={name}
                          className={
                            isExcluded
                              ? "bg-gray-100 dark:bg-gray-800"
                              : isBeingCorrected
                                ? "bg-yellow-50 dark:bg-yellow-900/20"
                                : ""
                          }
                        >
                          <Table.Cell>
                            <Checkbox
                              checked={isExcluded}
                              onChange={(e) =>
                                onExclusionChange(name, e.target.checked)
                              }
                            />
                          </Table.Cell>
                          <Table.Cell className="font-medium text-gray-900 dark:text-white">
                            <div className="flex items-center gap-2">
                              {name}
                              {name === suggestedCanonical && (
                                <Badge color="blue" size="xs">
                                  Most records
                                </Badge>
                              )}
                            </div>
                          </Table.Cell>
                          <Table.Cell className="text-right">
                            {recordCount}
                          </Table.Cell>
                          <Table.Cell>
                            <select
                              value={selectedCorrection ?? name}
                              onChange={(e) =>
                                onCorrectionChange(name, e.target.value)
                              }
                              disabled={isExcluded}
                              className={`block w-full rounded-lg border border-gray-300 bg-gray-50 p-2 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 ${
                                isExcluded ? "opacity-50 cursor-not-allowed" : ""
                              }`}
                            >
                              <option value={name}>
                                Keep as "{name}"
                              </option>
                              {cluster
                                .filter((n) => n !== name)
                                .map((otherName) => (
                                  <option key={otherName} value={otherName}>
                                    Change to "{otherName}"
                                  </option>
                                ))}
                            </select>
                          </Table.Cell>
                        </Table.Row>
                      );
                    })}
                  </Table.Body>
                </Table>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CompanyClusterTable;
