import { Alert, Button, Card, Modal, Tabs } from "flowbite-react";
import { useState, useMemo } from "react";
import {
  HiClipboardCheck,
  HiExclamation,
  HiInformationCircle,
  HiRefresh,
  HiTrash,
} from "react-icons/hi";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import { LoadingSpinner, useToastContext } from "../../../context/ToastContext";
import {
  useGetAllRecordCompanyNames,
  useApplyCorrections,
  useGetCorrectionHistory,
  useRollbackCorrections,
  useGetUnusedCompanies,
  useDeleteUnusedCompanies,
  useGetExcludedCompanyNames,
  useAddExcludedCompanyNames,
  CorrectionPayload,
} from "../../../hooks/useCompanyNameCorrections";
import { clusterSimilarWords } from "../first-one/generate-rekapan/group-company-typo-names/clusterSimilarWords/clusterSimilarWords";
import CompanyClusterTable from "./components/company-cluster-table";
import RollbackPanel from "./components/rollback-panel";
import ExclusionsPanel from "./components/exclusions-panel";

const LEVENSHTEIN_THRESHOLD = 2;

const CompanyCleanup = () => {
  const { showToast } = useToastContext();

  // Data fetching
  const { data: companyNames, isLoading: isLoadingNames, refetch: refetchNames } = useGetAllRecordCompanyNames();
  const { data: correctionHistory, isLoading: isLoadingHistory } = useGetCorrectionHistory();
  const { data: unusedCompanies, isLoading: isLoadingUnused } = useGetUnusedCompanies();
  const { data: excludedNames } = useGetExcludedCompanyNames();

  // Mutations
  const applyMutation = useApplyCorrections();
  const rollbackMutation = useRollbackCorrections();
  const deleteUnusedMutation = useDeleteUnusedCompanies();
  const addExclusionsMutation = useAddExcludedCompanyNames();

  // UI state
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastResult, setLastResult] = useState<{ batchId: string; recordsUpdated: number; companiesMerged: number } | null>(null);
  const [corrections, setCorrections] = useState<Map<string, string>>(new Map());
  const [pendingExclusions, setPendingExclusions] = useState<Set<string>>(new Set());

  // Cluster company names using Levenshtein distance
  const clusters = useMemo(() => {
    if (!companyNames || companyNames.length === 0) return [];

    const names = companyNames.map(c => c.company_name);
    const clustered = clusterSimilarWords(names, LEVENSHTEIN_THRESHOLD);

    // Only return clusters with more than 1 item (potential typos)
    const rawClusters = clustered.filter(cluster => cluster.length > 1);

    // Filter out clusters where ALL names are already excluded
    const excludedSet = new Set(excludedNames?.map(e => e.company_name) ?? []);
    return rawClusters.filter(cluster =>
      cluster.some(name => !excludedSet.has(name))
    );
  }, [companyNames, excludedNames]);

  // Build corrections payload from user selections
  const buildCorrectionsPayload = (): CorrectionPayload[] => {
    const payload: CorrectionPayload[] = [];

    corrections.forEach((newName, oldName) => {
      if (oldName !== newName) {
        payload.push({ old_name: oldName, new_name: newName });
      }
    });

    return payload;
  };

  // Handle correction selection
  const handleCorrectionChange = (oldName: string, newName: string) => {
    const newCorrections = new Map(corrections);
    if (oldName === newName) {
      newCorrections.delete(oldName);
    } else {
      newCorrections.set(oldName, newName);
    }
    setCorrections(newCorrections);
  };

  // Handle exclusion checkbox change
  const handleExclusionChange = (name: string, exclude: boolean) => {
    const newExclusions = new Set(pendingExclusions);
    if (exclude) {
      newExclusions.add(name);
      // Clear any correction for this name
      const newCorrections = new Map(corrections);
      newCorrections.delete(name);
      setCorrections(newCorrections);
    } else {
      newExclusions.delete(name);
    }
    setPendingExclusions(newExclusions);
  };

  // Preview changes
  const handlePreview = () => {
    if (corrections.size === 0 && pendingExclusions.size === 0) {
      showToast("error", "No corrections or exclusions selected");
      return;
    }
    setShowPreviewModal(true);
  };

  // Apply corrections and exclusions
  const handleApply = async () => {
    const payload = buildCorrectionsPayload();
    if (payload.length === 0 && pendingExclusions.size === 0) {
      showToast("error", "No corrections or exclusions to apply");
      return;
    }

    try {
      showToast("loading", "Applying changes...");

      let recordsUpdated = 0;
      let companiesMerged = 0;
      let batchId = "";

      // Apply corrections if any
      if (payload.length > 0) {
        const result = await applyMutation.mutateAsync(payload);
        recordsUpdated = result.records_updated;
        companiesMerged = result.companies_merged;
        batchId = result.batch_id;
      }

      // Save pending exclusions if any
      if (pendingExclusions.size > 0) {
        await addExclusionsMutation.mutateAsync(Array.from(pendingExclusions));
      }

      setLastResult({
        batchId: batchId || "exclusions-only",
        recordsUpdated,
        companiesMerged,
      });

      setShowPreviewModal(false);
      setShowSuccessModal(true);
      setCorrections(new Map());
      setPendingExclusions(new Set());
      refetchNames();

      const messages = [];
      if (recordsUpdated > 0) messages.push(`Updated ${recordsUpdated} records`);
      if (pendingExclusions.size > 0) messages.push(`Excluded ${pendingExclusions.size} names`);
      showToast("success", messages.join(", ") || "Changes applied");
    } catch (error) {
      console.error("Error applying changes:", error);
      showToast("error", "Failed to apply changes");
    }
  };

  // Handle rollback
  const handleRollback = async (batchId: string) => {
    try {
      showToast("loading", "Rolling back corrections...");
      const result = await rollbackMutation.mutateAsync(batchId);

      if (result.success) {
        showToast("success", `Restored ${result.records_restored} records`);
        refetchNames();
      } else {
        showToast("error", "Batch already rolled back or not found");
      }
    } catch (error) {
      console.error("Error rolling back:", error);
      showToast("error", "Failed to rollback corrections");
    }
  };

  // Handle delete unused companies
  const handleDeleteUnused = async () => {
    try {
      showToast("loading", "Deleting unused companies...");
      const count = await deleteUnusedMutation.mutateAsync();
      showToast("success", `Deleted ${count} unused companies`);
    } catch (error) {
      console.error("Error deleting unused:", error);
      showToast("error", "Failed to delete unused companies");
    }
  };

  if (isLoadingNames) {
    return (
      <NavbarSidebarLayout>
        <LoadingSpinner />
      </NavbarSidebarLayout>
    );
  }

  const totalRecordsToUpdate = Array.from(corrections.entries()).reduce((sum, [oldName]) => {
    const company = companyNames?.find(c => c.company_name === oldName);
    return sum + (company?.record_count ?? 0);
  }, 0);

  return (
    <NavbarSidebarLayout>
      <div className="px-8 pt-8 pb-8 min-h-screen bg-gray-100 dark:bg-gray-900">
        <div className="max-w-7xl space-y-6">
          {/* Header Card */}
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Company Name Cleanup
                </h1>
                <p className="mt-2 text-gray-600 dark:text-gray-400">
                  Fix company name typos permanently in the database
                </p>
              </div>
              <Button color="light" onClick={() => refetchNames()}>
                <HiRefresh className="mr-2 h-4 w-4" />
                Refresh
              </Button>
            </div>
          </Card>

          {/* Main Content Tabs */}
          <Card>
            <Tabs.Group aria-label="Company cleanup tabs" style="underline">
              {/* Cleanup Tab */}
              <Tabs.Item active title="Cleanup">
                <div className="space-y-6">
                  {/* Info Alert */}
                  <Alert color="info" icon={HiInformationCircle}>
                    <div>
                      <p className="font-medium">How it works:</p>
                      <p className="text-sm mt-1">
                        Names are grouped by similarity using Levenshtein distance (threshold: {LEVENSHTEIN_THRESHOLD}).
                        Select the correct name for each group, then click "Preview & Apply" to update all records.
                      </p>
                    </div>
                  </Alert>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                      <p className="text-sm text-blue-600 dark:text-blue-400">Total Company Names</p>
                      <p className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                        {companyNames?.length ?? 0}
                      </p>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-4 dark:bg-yellow-900/20">
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Potential Typo Groups</p>
                      <p className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                        {clusters.length}
                      </p>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                      <p className="text-sm text-green-600 dark:text-green-400">Selected Corrections</p>
                      <p className="text-2xl font-bold text-green-800 dark:text-green-200">
                        {corrections.size}
                      </p>
                    </div>
                  </div>

                  {/* Cluster Table */}
                  {clusters.length > 0 ? (
                    <CompanyClusterTable
                      clusters={clusters}
                      companyNames={companyNames ?? []}
                      corrections={corrections}
                      onCorrectionChange={handleCorrectionChange}
                      pendingExclusions={pendingExclusions}
                      onExclusionChange={handleExclusionChange}
                    />
                  ) : (
                    <div className="rounded-lg border border-gray-200 p-8 text-center dark:border-gray-700">
                      <HiClipboardCheck className="mx-auto h-12 w-12 text-green-500" />
                      <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">
                        No typos detected!
                      </h3>
                      <p className="mt-1 text-gray-500 dark:text-gray-400">
                        All company names appear to be unique. Try adjusting the similarity threshold.
                      </p>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {(corrections.size > 0 || pendingExclusions.size > 0) && (
                    <div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {corrections.size > 0 && `${corrections.size} correction(s) will affect ${totalRecordsToUpdate} record(s)`}
                        {corrections.size > 0 && pendingExclusions.size > 0 && " • "}
                        {pendingExclusions.size > 0 && `${pendingExclusions.size} name(s) marked as Keep Same`}
                      </p>
                      <Button color="blue" onClick={handlePreview}>
                        Preview & Apply
                      </Button>
                    </div>
                  )}
                </div>
              </Tabs.Item>

              {/* History Tab */}
              <Tabs.Item title="History">
                <RollbackPanel
                  history={correctionHistory ?? []}
                  isLoading={isLoadingHistory}
                  onRollback={handleRollback}
                  isRollingBack={rollbackMutation.isPending}
                />
              </Tabs.Item>

              {/* Cleanup Unused Tab */}
              <Tabs.Item title="Unused Companies">
                <div className="space-y-4">
                  <Alert color="warning" icon={HiExclamation}>
                    <p className="text-sm">
                      These companies exist in the database but are not referenced by any records.
                      You can delete them to clean up the database.
                    </p>
                  </Alert>

                  {isLoadingUnused ? (
                    <LoadingSpinner />
                  ) : (
                    <>
                      {unusedCompanies && unusedCompanies.length > 0 ? (
                        <>
                          <div className="max-h-64 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                              {unusedCompanies.map((name) => (
                                <li key={name} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                                  {name}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <Button
                            color="failure"
                            onClick={handleDeleteUnused}
                            disabled={deleteUnusedMutation.isPending}
                          >
                            <HiTrash className="mr-2 h-4 w-4" />
                            Delete {unusedCompanies.length} Unused Companies
                          </Button>
                        </>
                      ) : (
                        <div className="rounded-lg border border-gray-200 p-8 text-center dark:border-gray-700">
                          <HiClipboardCheck className="mx-auto h-12 w-12 text-green-500" />
                          <p className="mt-2 text-gray-500 dark:text-gray-400">
                            No unused companies found.
                          </p>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </Tabs.Item>

              {/* Exclusions Tab */}
              <Tabs.Item title="Exclusions">
                <ExclusionsPanel />
              </Tabs.Item>
            </Tabs.Group>
          </Card>
        </div>

        {/* Floating Action Button */}
        {(corrections.size > 0 || pendingExclusions.size > 0) && (
          <div className="fixed bottom-6 right-6 z-50">
            <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-2xl dark:border-gray-600 dark:bg-gray-800">
              <div className="flex flex-col gap-3">
                <div className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Pending Changes
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400">
                  {corrections.size > 0 && (
                    <span className="rounded-full bg-blue-100 px-2 py-1 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                      {corrections.size} correction{corrections.size !== 1 ? 's' : ''}
                    </span>
                  )}
                  {pendingExclusions.size > 0 && (
                    <span className="rounded-full bg-purple-100 px-2 py-1 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
                      {pendingExclusions.size} exclusion{pendingExclusions.size !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
                <Button
                  color="blue"
                  onClick={handlePreview}
                  className="w-full"
                >
                  <HiClipboardCheck className="mr-2 h-5 w-5" />
                  Preview & Apply
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Preview Modal */}
        <Modal show={showPreviewModal} onClose={() => setShowPreviewModal(false)} size="lg">
          <Modal.Header>Preview Changes</Modal.Header>
          <Modal.Body>
            <div className="space-y-4">
              <Alert color="info" icon={HiInformationCircle}>
                <p className="text-sm">
                  The following changes will be applied. Corrections can be rolled back later.
                </p>
              </Alert>

              {/* Corrections Section */}
              {corrections.size > 0 && (
                <>
                  <h4 className="font-medium text-gray-900 dark:text-white">Corrections</h4>
                  <div className="max-h-48 overflow-y-auto">
                    <table className="w-full text-sm">
                      <thead className="bg-gray-50 dark:bg-gray-700">
                        <tr>
                          <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">From</th>
                          <th className="px-4 py-2 text-left text-gray-700 dark:text-gray-300">To</th>
                          <th className="px-4 py-2 text-right text-gray-700 dark:text-gray-300">Records</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                        {Array.from(corrections.entries()).map(([oldName, newName]) => {
                          const count = companyNames?.find(c => c.company_name === oldName)?.record_count ?? 0;
                          return (
                            <tr key={oldName}>
                              <td className="px-4 py-2 text-red-600 dark:text-red-400 line-through">
                                {oldName}
                              </td>
                              <td className="px-4 py-2 text-green-600 dark:text-green-400">
                                {newName}
                              </td>
                              <td className="px-4 py-2 text-right text-gray-600 dark:text-gray-400">
                                {count}
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              {/* Exclusions Section */}
              {pendingExclusions.size > 0 && (
                <>
                  <h4 className="font-medium text-gray-900 dark:text-white">Keep Same (Exclusions)</h4>
                  <div className="max-h-32 overflow-y-auto rounded-lg border border-gray-200 dark:border-gray-700">
                    <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                      {Array.from(pendingExclusions).map((name) => (
                        <li key={name} className="px-4 py-2 text-sm text-gray-700 dark:text-gray-300">
                          {name}
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              )}

              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <strong>Total:</strong>{" "}
                  {corrections.size > 0 && `${corrections.size} corrections affecting ${totalRecordsToUpdate} records`}
                  {corrections.size > 0 && pendingExclusions.size > 0 && ", "}
                  {pendingExclusions.size > 0 && `${pendingExclusions.size} names to exclude`}
                </p>
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="gray" onClick={() => setShowPreviewModal(false)}>
              Cancel
            </Button>
            <Button color="blue" onClick={handleApply} disabled={applyMutation.isPending}>
              {applyMutation.isPending ? "Applying..." : "Apply Corrections"}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Success Modal */}
        <Modal show={showSuccessModal} onClose={() => setShowSuccessModal(false)} size="md">
          <Modal.Header>Corrections Applied Successfully</Modal.Header>
          <Modal.Body>
            <div className="space-y-4 text-center">
              <HiClipboardCheck className="mx-auto h-16 w-16 text-green-500" />
              <div>
                <p className="text-lg font-medium text-gray-900 dark:text-white">
                  {lastResult?.recordsUpdated} records updated
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {lastResult?.companiesMerged} company names merged
                </p>
              </div>
              <p className="text-xs text-gray-400 dark:text-gray-500">
                Batch ID: {lastResult?.batchId}
              </p>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button color="blue" onClick={() => setShowSuccessModal(false)}>
              Done
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </NavbarSidebarLayout>
  );
};

export default CompanyCleanup;
