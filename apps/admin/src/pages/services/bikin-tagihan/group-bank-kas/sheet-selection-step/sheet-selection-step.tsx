import { FC, useContext, useEffect } from "react";
import { useWizard } from "react-use-wizard";
import { Button, Label, Radio } from "flowbite-react";
import { SheetList } from "./sheet-list";
import { useGroupBankKasContext } from "../group-bank-kas-provider";
import { ToastContext } from "#src/context/ToastContext";

export const SheetSelectionStep: FC = () => {
  const { previousStep, nextStep } = useWizard();
  const { showToast } = useContext(ToastContext);

  const {
    processingMode,
    setProcessingMode,
    availableSheets,
    selectedSheets,
    setSelectedSheets,
  } = useGroupBankKasContext();

  // Initialize selectedSheets to all sheets if processingMode is 'all'
  useEffect(() => {
    if (processingMode === "all") {
      setSelectedSheets(availableSheets);
    }
  }, [processingMode, availableSheets, setSelectedSheets]);

  const handleToggleSheet = (sheetName: string) => {
    setSelectedSheets((prev) => {
      if (prev.includes(sheetName)) {
        return prev.filter((name) => name !== sheetName);
      } else {
        return [...prev, sheetName];
      }
    });
  };

  const handleSelectAll = () => {
    setSelectedSheets(availableSheets);
  };

  const handleDeselectAll = () => {
    setSelectedSheets([]);
  };

  const handleNext = () => {
    if (selectedSheets.length === 0) {
      showToast("error", "Please select at least one sheet to process");
      return;
    }

    nextStep();
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Select Sheets to Process
      </h2>

      <div className="space-y-4">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2">
            <Radio
              id="mode-all"
              name="processingMode"
              value="all"
              checked={processingMode === "all"}
              onChange={() => setProcessingMode("all")}
            />
            <Label htmlFor="mode-all">Process All Sheets</Label>
          </div>

          <div className="flex items-center gap-2">
            <Radio
              id="mode-select"
              name="processingMode"
              value="select"
              checked={processingMode === "select"}
              onChange={() => setProcessingMode("select")}
            />
            <Label htmlFor="mode-select">Select Individual Sheets</Label>
          </div>
        </div>

        {processingMode === "select" && (
          <SheetList
            sheets={availableSheets}
            selectedSheets={selectedSheets}
            onToggleSheet={handleToggleSheet}
            onSelectAll={handleSelectAll}
            onDeselectAll={handleDeselectAll}
          />
        )}

        {processingMode === "all" && (
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-300">
              All {availableSheets.length} sheets will be processed
            </p>
            <ul className="mt-2 text-xs text-blue-700 dark:text-blue-400 list-disc list-inside">
              {availableSheets.map((sheet) => (
                <li key={sheet}>{sheet}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button color="light" onClick={previousStep}>
          Back
        </Button>
        <Button onClick={handleNext}>Next</Button>
      </div>
    </div>
  );
};
