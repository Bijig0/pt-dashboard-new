import { FC, useContext, useEffect, useState } from "react";
import { useWizard } from "react-use-wizard";
import { Button, Tabs, Spinner } from "flowbite-react";
import { PreviewTable } from "./preview-table";
import { useGroupBankKasContext } from "../group-bank-kas-provider";
import { processMultipleSheets } from "../lib/processMultipleSheets";
import { ToastContext } from "#src/context/ToastContext";

export const PreviewStep: FC = () => {
  const { previousStep, nextStep } = useWizard();
  const { showToast } = useContext(ToastContext);

  const {
    workbook,
    selectedSheets,
    previewData,
    setPreviewData,
    isProcessing,
    setIsProcessing,
    addError,
  } = useGroupBankKasContext();

  const [hasProcessed, setHasProcessed] = useState(false);

  // Process sheets on mount
  useEffect(() => {
    if (!workbook || selectedSheets.length === 0 || hasProcessed) return;

    const parseSheets = async () => {
      setIsProcessing(true);
      showToast("loading", `Processing ${selectedSheets.length} sheets...`);

      try {
        const results = await processMultipleSheets(workbook, selectedSheets);

        // Convert results to preview data format
        const preview = results.map(({ sheetName, groupedItems, total }) => ({
          sheetName,
          items: groupedItems,
          total,
        }));

        setPreviewData(preview);
        setHasProcessed(true);
        showToast("success", "Data parsed successfully!");
      } catch (error) {
        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to parse sheets. Please check the data format.";
        showToast("error", errorMessage);
        addError(errorMessage);
      } finally {
        setIsProcessing(false);
      }
    };

    parseSheets();
  }, [
    workbook,
    selectedSheets,
    hasProcessed,
    setPreviewData,
    setIsProcessing,
    showToast,
    addError,
  ]);

  const handleConfirm = () => {
    // Preview data will be used in results step for grouping
    nextStep();
  };

  if (isProcessing) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-12">
        <Spinner size="xl" />
        <p className="text-gray-600 dark:text-gray-400">
          Processing {selectedSheets.length} sheets...
        </p>
      </div>
    );
  }

  if (previewData.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No data to preview</p>
      </div>
    );
  }

  const totalItems = previewData.reduce((sum, sheet) => sum + sheet.items.length, 0);
  const grandTotal = previewData.reduce((sum, sheet) => sum + sheet.total, 0);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Preview Parsed Data
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {previewData.length} sheets, {totalItems} total items, Total:{" "}
          {new Intl.NumberFormat("id-ID").format(grandTotal)}
        </p>
      </div>

      {previewData.length === 1 ? (
        <PreviewTable
          sheetName={previewData[0].sheetName}
          items={previewData[0].items}
          total={previewData[0].total}
        />
      ) : (
        <Tabs aria-label="Sheet preview tabs" style="underline">
          {previewData.map((sheet) => (
            <Tabs.Item key={sheet.sheetName} title={sheet.sheetName}>
              <PreviewTable
                sheetName={sheet.sheetName}
                items={sheet.items}
                total={sheet.total}
              />
            </Tabs.Item>
          ))}
        </Tabs>
      )}

      <div className="flex justify-between">
        <Button color="light" onClick={previousStep}>
          Back
        </Button>
        <Button onClick={handleConfirm}>Confirm & Group</Button>
      </div>
    </div>
  );
};
