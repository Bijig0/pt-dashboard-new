import { AgGridReact } from "ag-grid-react";
import { useEffect, useState } from "react";
import { useLocale } from "../../../../../context/LocaleContext";
import { Row } from "../../../../../types/globals";

type WarningsPanelProps = {
  gridRef: AgGridReact<Row> | null;
  companyNames?: string[];
};

type MutualExclusivityWarning = {
  type: "mutualExclusivity";
  rowIndex: number;
  companyName: string;
  tanggal: string;
  masuk: number;
  keluar: number;
};

type UnregisteredCompanyWarning = {
  type: "unregisteredCompany";
  rowIndex: number;
  companyName: string;
  tanggal: string;
};

type WarningItem = MutualExclusivityWarning | UnregisteredCompanyWarning;

const WarningsPanel = (props: WarningsPanelProps) => {
  const { t } = useLocale();
  const { gridRef, companyNames = [] } = props;
  const [warnings, setWarnings] = useState<WarningItem[]>([]);

  // Scan grid for warnings
  const scanForWarnings = () => {
    if (!gridRef) {
      return;
    }

    const api = gridRef.api;
    if (!api) return;

    const warningItems: WarningItem[] = [];

    api.forEachNode((node, index) => {
      const data = node.data as Row;
      if (!data) return;

      const masukValue = data.masuk ?? 0;
      const keluarValue = data.keluar ?? 0;
      const companyName = data.company_name;

      // Check for mutual exclusivity
      if (masukValue > 0 && keluarValue > 0) {
        warningItems.push({
          type: "mutualExclusivity",
          rowIndex: index,
          companyName: companyName || "Unknown",
          tanggal: data.tanggal || "No date",
          masuk: masukValue,
          keluar: keluarValue,
        });
      }

      // Check for unregistered company
      if (companyName && !companyNames.includes(companyName)) {
        warningItems.push({
          type: "unregisteredCompany",
          rowIndex: index,
          companyName: companyName,
          tanggal: data.tanggal || "No date",
        });
      }
    });

    setWarnings(warningItems);
  };

  // Scan on mount and when grid data changes
  useEffect(() => {
    // Initial scan
    const timer = setTimeout(() => {
      scanForWarnings();
    }, 500);

    // Set up interval to periodically check for warnings
    const interval = setInterval(() => {
      scanForWarnings();
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [gridRef, companyNames]);

  const handleWarningClick = (rowIndex: number) => {
    if (!gridRef) {
      return;
    }

    const api = gridRef.api;
    if (!api) return;

    // Get the node at the row index
    const rowNode = api.getDisplayedRowAtIndex(rowIndex);
    if (!rowNode) return;

    // Ensure the row is visible
    api.ensureIndexVisible(rowIndex, "middle");

    // Flash the row to highlight it
    api.flashCells({ rowNodes: [rowNode] });

    // Focus on the first cell of that row
    api.setFocusedCell(rowIndex, "tanggal");
  };

  if (warnings.length === 0) {
    return null;
  }

  return (
    <div className="w-full">
      <div className="rounded-lg border-2 border-yellow-500 bg-yellow-50 p-3 dark:bg-yellow-900/20">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-yellow-600 dark:text-yellow-400 text-lg">
            ⚠️
          </span>
          <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-300">
            {t.warnings.title} ({warnings.length})
          </h4>
        </div>
        <ul className="space-y-2 max-h-60 overflow-y-auto">
          {warnings.map((warning, idx) => (
            <li
              key={idx}
              onClick={() => handleWarningClick(warning.rowIndex)}
              className="cursor-pointer rounded bg-white dark:bg-gray-800 p-2 text-xs hover:bg-yellow-100 dark:hover:bg-yellow-900/30 transition-colors"
            >
              <div className="font-medium text-gray-900 dark:text-white">
                {t.warnings.row} {warning.rowIndex + 1}: {warning.companyName}
              </div>
              <div className="text-gray-600 dark:text-gray-400 mt-1">
                {warning.tanggal}
              </div>
              {warning.type === "mutualExclusivity" && (
                <div className="text-gray-600 dark:text-gray-400">
                  {t.warnings.masuk} {warning.masuk}, {t.warnings.keluar}{" "}
                  {warning.keluar}
                </div>
              )}
              {warning.type === "unregisteredCompany" && (
                <div className="text-orange-600 dark:text-orange-400 font-medium">
                  {t.warnings.unregisteredCompany}
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default WarningsPanel;
