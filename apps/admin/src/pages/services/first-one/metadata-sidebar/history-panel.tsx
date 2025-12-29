import { Button, Modal, TextInput, Label } from "flowbite-react";
import { useState, useCallback } from "react";
import {
  HiChevronDown,
  HiChevronUp,
  HiClock,
  HiRefresh,
  HiReply,
  HiSave,
  HiTrash,
} from "react-icons/hi";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useToastContext } from "../../../../context/ToastContext";
import { Row } from "../../../../types/globals";
import {
  useGetSnapshots,
  useSaveSnapshot,
  useDeleteSnapshot,
  WorksheetSnapshot,
} from "../../../../hooks/useWorksheetSnapshots";
import { MyGridRef } from "../grid/ag-grid";

dayjs.extend(relativeTime);

type HistoryPanelProps = {
  worksheetName: string;
  selectedDate: Date;
  gridRef: MyGridRef | null;
  onRestoreSnapshot: (snapshot: Row[]) => void;
};

const HistoryPanel = (props: HistoryPanelProps) => {
  const { worksheetName, selectedDate, gridRef, onRestoreSnapshot } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedSnapshot, setSelectedSnapshot] = useState<WorksheetSnapshot | null>(null);
  const [snapshotLabel, setSnapshotLabel] = useState("");

  const { showToast } = useToastContext();

  // Fetch snapshots
  const { data: snapshots, isLoading: isLoadingSnapshots } = useGetSnapshots(
    worksheetName,
    selectedDate
  );

  // Mutations
  const saveSnapshotMutation = useSaveSnapshot();
  const deleteSnapshotMutation = useDeleteSnapshot();

  // Undo/Redo handlers
  const handleUndo = useCallback(() => {
    if (gridRef?.undo) {
      gridRef.undo();
      showToast("success", "Undone");
    }
  }, [gridRef, showToast]);

  const handleRedo = useCallback(() => {
    if (gridRef?.redo) {
      gridRef.redo();
      showToast("success", "Redone");
    }
  }, [gridRef, showToast]);

  // Create snapshot
  const handleCreateSnapshot = async () => {
    if (!gridRef?.getGridData) {
      showToast("error", "Cannot access grid data");
      return;
    }

    const currentData = gridRef.getGridData();
    if (!currentData || currentData.length === 0) {
      showToast("error", "No data to snapshot");
      return;
    }

    try {
      await saveSnapshotMutation.mutateAsync({
        alatName: worksheetName,
        month: selectedDate,
        snapshot: currentData,
        label: snapshotLabel || undefined,
      });
      showToast("success", "Snapshot created");
      setShowCreateModal(false);
      setSnapshotLabel("");
    } catch (error) {
      showToast("error", "Failed to create snapshot");
    }
  };

  // Restore from snapshot
  const handleRestoreSnapshot = () => {
    if (!selectedSnapshot) return;

    onRestoreSnapshot(selectedSnapshot.snapshot);
    showToast("success", "Restored from snapshot");
    setShowRestoreModal(false);
    setSelectedSnapshot(null);
  };

  // Delete snapshot
  const handleDeleteSnapshot = async (snapshotId: number) => {
    try {
      await deleteSnapshotMutation.mutateAsync(snapshotId);
      showToast("success", "Snapshot deleted");
    } catch (error) {
      showToast("error", "Failed to delete snapshot");
    }
  };

  const openRestoreModal = (snapshot: WorksheetSnapshot) => {
    setSelectedSnapshot(snapshot);
    setShowRestoreModal(true);
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-3">
          <HiClock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              History
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Undo, redo & snapshots
            </p>
          </div>
        </div>
        {isExpanded ? (
          <HiChevronUp className="h-5 w-5 text-gray-500" />
        ) : (
          <HiChevronDown className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {/* Collapsible Content */}
      {isExpanded && (
        <div className="space-y-4 border-t border-gray-200 p-4 dark:border-gray-600">
          {/* Undo/Redo Buttons */}
          <div>
            <p className="mb-2 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
              Session History
            </p>
            <div className="flex gap-2">
              <Button
                className="flex-1"
                color="light"
                onClick={handleUndo}
                disabled={!gridRef?.canUndo?.()}
              >
                <HiReply className="mr-2 h-4 w-4" />
                Undo
              </Button>
              <Button
                className="flex-1"
                color="light"
                onClick={handleRedo}
                disabled={!gridRef?.canRedo?.()}
              >
                <HiRefresh className="mr-2 h-4 w-4" />
                Redo
              </Button>
            </div>
            <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
              Ctrl+Z / Ctrl+Y also work
            </p>
          </div>

          {/* Snapshots Section */}
          <div className="border-t border-gray-200 pt-4 dark:border-gray-600">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">
                Saved States
              </p>
              <Button
                size="xs"
                color="blue"
                onClick={() => setShowCreateModal(true)}
              >
                <HiSave className="mr-1 h-3 w-3" />
                Save State
              </Button>
            </div>

            {/* Snapshots List */}
            {isLoadingSnapshots ? (
              <p className="text-sm text-gray-500">Loading...</p>
            ) : snapshots && snapshots.length > 0 ? (
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {snapshots.map((snapshot) => (
                  <div
                    key={snapshot.id}
                    className="flex items-center justify-between rounded-lg bg-white p-2 text-sm dark:bg-gray-700"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-gray-900 dark:text-white">
                        {snapshot.label || "Snapshot"}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {dayjs(snapshot.created_at).fromNow()}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => openRestoreModal(snapshot)}
                        className="rounded p-1 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                        title="Restore this state"
                      >
                        <HiRefresh className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteSnapshot(snapshot.id)}
                        className="rounded p-1 text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
                        title="Delete this snapshot"
                      >
                        <HiTrash className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No saved states yet. Click "Save State" to create one.
              </p>
            )}
          </div>
        </div>
      )}

      {/* Create Snapshot Modal */}
      <Modal
        dismissible
        show={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        size="md"
      >
        <Modal.Header>Save Current State</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              This will save the current grid data as a snapshot. You can
              restore to this state later.
            </p>
            <div>
              <Label htmlFor="snapshot-label" value="Label (optional)" />
              <TextInput
                id="snapshot-label"
                placeholder="e.g., Before bulk edit"
                value={snapshotLabel}
                onChange={(e) => setSnapshotLabel(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            onClick={handleCreateSnapshot}
            disabled={saveSnapshotMutation.isPending}
          >
            {saveSnapshotMutation.isPending ? "Saving..." : "Save State"}
          </Button>
          <Button color="gray" onClick={() => setShowCreateModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Restore Confirmation Modal */}
      <Modal
        dismissible
        show={showRestoreModal}
        onClose={() => setShowRestoreModal(false)}
        size="md"
      >
        <Modal.Header>Restore State</Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Are you sure you want to restore to this saved state?
            </p>
            {selectedSnapshot && (
              <div className="rounded-lg bg-gray-50 p-3 dark:bg-gray-700">
                <p className="font-medium text-gray-900 dark:text-white">
                  {selectedSnapshot.label || "Snapshot"}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Created {dayjs(selectedSnapshot.created_at).format("MMM D, YYYY h:mm A")}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedSnapshot.snapshot.length} rows
                </p>
              </div>
            )}
            <p className="text-sm text-amber-600 dark:text-amber-400">
              This will replace the current grid data. The change will be saved
              automatically.
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button color="blue" onClick={handleRestoreSnapshot}>
            Restore
          </Button>
          <Button color="gray" onClick={() => setShowRestoreModal(false)}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HistoryPanel;
