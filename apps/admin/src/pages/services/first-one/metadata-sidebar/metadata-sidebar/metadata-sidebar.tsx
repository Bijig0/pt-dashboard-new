import React, { RefObject, SetStateAction } from "react";
import { HiMenuAlt1, HiQuestionMarkCircle } from "react-icons/hi";
import { useToggle } from "usehooks-ts";
import { LoadingSpinner } from "../../../../../context/ToastContext";
import { useGetCompanyNames } from "../../../../../hooks/useGetCompanyNames";
import { useOnboarding } from "../../../../../context/OnboardingContext";
import { MyGridRef, SaveState } from "../../grid/ag-grid";
import AlatInitialStok from "../alat-initial-stok";
import EditorPanel from "../editor-panel";
import HistoryPanel from "../history-panel";
import WarningsPanel from "../warnings-panel/warnings-panel";
import WorkbookSelectionPanel from "../workbook-selection-panel";
import { Button } from "flowbite-react";
import { Row } from "../../../../../types/globals";

type MetadataSidebarProps = {
  selectedDate: Date;
  dates: Date[];
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
  alatNamesList: string[];
  selectedAlatName: string;
  setSelectedAlatName: React.Dispatch<SetStateAction<string | undefined>>;
  gridRef: RefObject<MyGridRef>;
  saveState: SaveState;
  onRestoreSnapshot?: (snapshot: Row[]) => void;
};

const MetadataSidebar = function (props: MetadataSidebarProps) {
  const {
    selectedAlatName,
    setSelectedAlatName,
    alatNamesList,
    dates,
    selectedDate,
    setSelectedDate,
    gridRef,
    saveState,
    onRestoreSnapshot,
  } = props;

  console.log("metadata-sidebar");

  const { data: companyNames, isLoading, error } = useGetCompanyNames();
  const { resetOnboarding } = useOnboarding();

  console.log({ companyNames, isLoading, error });

  const [sidebarOpen, toggle] = useToggle(true);

  const worksheetName = selectedAlatName;

  if (!sidebarOpen) {
    return (
      <>
        <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button className="cursor-pointer rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline">
              <HiMenuAlt1 onClick={toggle} className="h-6 w-6" />
            </button>
          </div>
          <div className="flow-root">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700 flex-col">
              <li className="py-3 sm:py-4">
                <div className="my-2"></div>
              </li>
            </ul>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-3 dark:border-gray-700 sm:pt-6"></div>
        </div>
        ;
      </>
    );
  }

  if (companyNames) {
    return (
      <div
        data-testid="metadata-sidebar"
        className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6"
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
              Controls
            </h3>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Grid settings and actions
            </p>
          </div>
          <button className="cursor-pointer rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline">
            <HiMenuAlt1 onClick={toggle} className="h-6 w-6" />
          </button>
        </div>
        <div className="flow-root">
          <ul className="space-y-4">
            <li>
              <WarningsPanel
                gridRef={gridRef.current?.gridRef || null}
                companyNames={companyNames}
              />
            </li>
            <li>
              <EditorPanel
                worksheetName={worksheetName}
                gridRef={gridRef.current?.gridRef || null}
                handleSaveWorksheet={() => gridRef.current?.handleSaveWorksheet()}
                saveState={saveState}
              />
            </li>
            <li>
              <HistoryPanel
                worksheetName={worksheetName}
                selectedDate={selectedDate}
                gridRef={gridRef.current}
                onRestoreSnapshot={onRestoreSnapshot || (() => {})}
              />
            </li>
            <li>
              <AlatInitialStok selectedAlatName={selectedAlatName} />
            </li>
            <li>
              <WorkbookSelectionPanel
                dates={dates}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                alatNamesList={alatNamesList}
                selectedAlatName={selectedAlatName}
                setSelectedAlatName={setSelectedAlatName}
                companyNames={companyNames!}
              />
            </li>
          </ul>
        </div>
        <div className="border-t border-gray-200 pt-4 dark:border-gray-700">
          <Button
            color="light"
            className="w-full"
            onClick={resetOnboarding}
          >
            <HiQuestionMarkCircle className="mr-2 h-5 w-5" />
            Restart Onboarding
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading) return <LoadingSpinner />;

  if (error) return error.message;
};

export default MetadataSidebar;
