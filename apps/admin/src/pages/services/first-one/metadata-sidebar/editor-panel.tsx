import { AgGridReact } from "ag-grid-react";
import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { HiChevronDown, HiChevronUp, HiCode, HiInformationCircle, HiPlus, HiSave, HiTrash } from "react-icons/hi";
import { Row } from "../../../../types/globals";
import { SaveState } from "../grid/ag-grid";

type EditorPanelProps = {
  worksheetName: string;
  gridRef: AgGridReact<Row> | null;
  handleSaveWorksheet: () => void;
  saveState: SaveState;
};

const EditorPanel = (props: EditorPanelProps) => {
  const { worksheetName, gridRef, handleSaveWorksheet, saveState } = props;
  const [isExpanded, setIsExpanded] = useState(false);
  const [showSaveInfoModal, setShowSaveInfoModal] = useState(false);

  const generateEmptyRows = (
    alatName: string,
    count: number = 100
  ): Array<{
    masuk: any;
    keluar: any;
    tanggal: any;
    company_name: any;
    alat_name: any;
  }> => {
    let result = [];
    for (let i = 0; i < count; i++) {
      result.push({
        masuk: null,
        keluar: null,
        tanggal: null,
        company_name: null,
        alat_name: alatName,
      });
    }
    return result;
  };

  const handleAddRows = async () => {
    if (!gridRef) return;
    const emptyRows = generateEmptyRows(worksheetName, 100);
    // @ts-ignore
    gridRef.api.applyTransaction({ add: emptyRows });
  };

  const handleRemoveEmptyRows = async () => {
    if (!gridRef) return;
    // @ts-ignore
    const api = gridRef.api;
    if (!api) return;

    // Get all rows
    const rowsToRemove: Row[] = [];
    api.forEachNode((node: any) => {
      const row = node.data as Row;
      // Check if row is empty (all values except alat_name are null)
      const isEmptyRow =
        row.masuk === null &&
        row.keluar === null &&
        row.tanggal === null &&
        row.company_name === null;

      if (isEmptyRow) {
        rowsToRemove.push(row);
      }
    });

    // Remove empty rows
    if (rowsToRemove.length > 0) {
      api.applyTransaction({ remove: rowsToRemove });
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800">
      {/* Collapsible Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-center justify-between rounded-lg p-4 text-left transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <div className="flex items-center gap-3">
          <HiCode className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          <div>
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              Editor
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Manage rows and save data
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
        <div className="space-y-3 border-t border-gray-200 p-4 dark:border-gray-600">
          <Button className="w-full" onClick={handleAddRows}>
            <HiPlus className="mr-2 h-4 w-4" />
            Add 100 Rows
          </Button>
          <Button className="w-full" color="light" onClick={handleRemoveEmptyRows}>
            <HiTrash className="mr-2 h-4 w-4" />
            Remove Empty Rows
          </Button>

          {/* Save Worksheet with Info Icon */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-600">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Manual Save
              </span>
              <button
                onClick={() => setShowSaveInfoModal(true)}
                className="rounded-full p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-600 dark:hover:text-gray-300"
                title="About manual save"
              >
                <HiInformationCircle className="h-4 w-4" />
              </button>
            </div>
            <Button
              className="w-full"
              onClick={handleSaveWorksheet}
              disabled={saveState === "Saving"}
              color="blue"
            >
              <HiSave className="mr-2 h-4 w-4" />
              {saveState === "Saving" ? "Saving..." : "Save Worksheet"}
            </Button>
            {saveState === "Saved" && (
              <div className="mt-2 text-xs text-green-600 dark:text-green-400">
                ✓ Saved successfully
              </div>
            )}
            {saveState === "Error Saving" && (
              <div className="mt-2 text-xs text-red-600 dark:text-red-400">
                ✗ Error saving - data saved locally
              </div>
            )}
          </div>
        </div>
      )}

      {/* Save Info Modal */}
      <Modal dismissible show={showSaveInfoModal} onClose={() => setShowSaveInfoModal(false)} size="md">
        <Modal.Header>
          About Manual Save
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-3">
            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                Auto-Save is Enabled
              </p>
              <p className="mt-2 text-sm text-blue-800 dark:text-blue-400">
                The worksheet automatically saves whenever you edit a cell. You don't need to manually save in most cases.
              </p>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Use the <strong>Manual Save</strong> button only if:
            </p>
            <ul className="list-disc space-y-1 pl-5 text-sm text-gray-700 dark:text-gray-300">
              <li>You want to force a save before leaving the page</li>
              <li>Auto-save failed and you want to retry</li>
              <li>You made bulk changes and want to ensure they're saved</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={() => setShowSaveInfoModal(false)}>
            Got it
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default EditorPanel;
