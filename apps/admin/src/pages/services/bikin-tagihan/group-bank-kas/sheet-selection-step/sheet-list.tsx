import { Checkbox, Label, Button } from "flowbite-react";
import { FC } from "react";

type Props = {
  sheets: string[];
  selectedSheets: string[];
  onToggleSheet: (sheetName: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
};

export const SheetList: FC<Props> = ({
  sheets,
  selectedSheets,
  onToggleSheet,
  onSelectAll,
  onDeselectAll,
}) => {
  const allSelected = selectedSheets.length === sheets.length;
  const noneSelected = selectedSheets.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {selectedSheets.length} of {sheets.length} sheets selected
        </p>
        <div className="space-x-2">
          <Button
            size="xs"
            color="light"
            onClick={onSelectAll}
            disabled={allSelected}
          >
            Select All
          </Button>
          <Button
            size="xs"
            color="light"
            onClick={onDeselectAll}
            disabled={noneSelected}
          >
            Deselect All
          </Button>
        </div>
      </div>

      <div className="space-y-2 max-h-64 overflow-y-auto p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
        {sheets.map((sheetName) => {
          const isChecked = selectedSheets.includes(sheetName);

          return (
            <div
              key={sheetName}
              className="flex items-center gap-2 p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded"
            >
              <Checkbox
                id={`sheet-${sheetName}`}
                checked={isChecked}
                onChange={() => onToggleSheet(sheetName)}
              />
              <Label
                htmlFor={`sheet-${sheetName}`}
                className="flex-1 cursor-pointer"
              >
                {sheetName}
              </Label>
            </div>
          );
        })}
      </div>
    </div>
  );
};
