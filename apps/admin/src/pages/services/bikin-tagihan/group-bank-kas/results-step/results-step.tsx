import { FC } from "react";
import { Button, Tabs, Alert } from "flowbite-react";
import { HiCheckCircle } from "react-icons/hi";
import { ResultsTable } from "./results-table";
import { DownloadButton } from "./download-button";
import { useGroupBankKasContext } from "../group-bank-kas-provider";

type Props = {
  onClose: () => void;
};

export const ResultsStep: FC<Props> = ({ onClose }) => {
  const { previewData, uploadedFile, resetState } = useGroupBankKasContext();

  // Use preview data as grouped results (it's already grouped from preview step)
  const groupedResults = previewData;

  if (groupedResults.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-600 dark:text-gray-400">No results to display</p>
      </div>
    );
  }

  const totalGroupedItems = groupedResults.reduce(
    (sum, sheet) => sum + sheet.items.length,
    0
  );
  const grandTotal = groupedResults.reduce((sum, sheet) => sum + sheet.total, 0);

  const handleProcessAnother = () => {
    resetState();
  };

  return (
    <div className="space-y-6">
      <Alert color="success" icon={HiCheckCircle}>
        <span className="font-medium">Data grouped successfully!</span> Your data
        has been grouped by KETERANGAN and sorted alphabetically.
      </Alert>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Grouped Results
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          {groupedResults.length} sheets, {totalGroupedItems} unique items, Grand
          Total: {new Intl.NumberFormat("id-ID").format(grandTotal)}
        </p>
      </div>

      {groupedResults.length === 1 ? (
        <ResultsTable
          sheetName={groupedResults[0].sheetName}
          groupedItems={groupedResults[0].items}
          total={groupedResults[0].total}
        />
      ) : (
        <Tabs aria-label="Grouped results tabs" style="underline">
          {groupedResults.map((sheet) => (
            <Tabs.Item key={sheet.sheetName} title={sheet.sheetName}>
              <ResultsTable
                sheetName={sheet.sheetName}
                groupedItems={sheet.items}
                total={sheet.total}
              />
            </Tabs.Item>
          ))}
        </Tabs>
      )}

      <div className="space-y-3">
        <DownloadButton
          groupedResults={groupedResults}
          originalFileName={uploadedFile?.name || "Bank_KAS"}
        />

        <div className="flex justify-between gap-3">
          <Button color="light" onClick={handleProcessAnother} className="flex-1">
            Process Another File
          </Button>
          <Button color="gray" onClick={onClose} className="flex-1">
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};
