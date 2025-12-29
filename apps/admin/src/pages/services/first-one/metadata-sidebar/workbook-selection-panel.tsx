import { Button } from "flowbite-react";
import React, { SetStateAction, useState } from "react";
import { HiInformationCircle, HiOfficeBuilding } from "react-icons/hi";
import AlatNameDropdown from "./alat-name-dropdown";
import CompanyNameManagementModal from "./company-name-management-modal";
import { DateForGrid } from "./date-for-grid/DateForGrid";

type WorkbookSelectionPanelProps = {
  dates: Date[];
  selectedDate: Date;
  setSelectedDate: React.Dispatch<SetStateAction<Date>>;
  alatNamesList: string[];
  selectedAlatName: string;
  setSelectedAlatName: React.Dispatch<SetStateAction<string | undefined>>;
  companyNames: string[];
};

const WorkbookSelectionPanel = (props: WorkbookSelectionPanelProps) => {
  const {
    dates,
    selectedDate,
    setSelectedDate,
    alatNamesList,
    selectedAlatName,
    setSelectedAlatName,
    companyNames,
  } = props;

  const [showCompanyModal, setShowCompanyModal] = useState(false);

  return (
    <>
    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-700 dark:bg-gray-800">
      {/* Header with Info Icon */}
      <div className="mb-4 flex items-center gap-2">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white">
          Workbook Selection
        </h3>
        <div className="group relative">
          <HiInformationCircle className="h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 cursor-help" />
          {/* Tooltip */}
          <div className="invisible group-hover:visible absolute left-0 top-6 z-50 w-64 rounded-lg border border-gray-200 bg-white p-3 shadow-lg dark:border-gray-600 dark:bg-gray-700">
            <p className="text-xs text-gray-700 dark:text-gray-300">
              <strong>Workbook Selection:</strong> Choose the date and workbook you want to work with.
              Each workbook represents a different equipment type (alat), and the date determines which month's data you're editing.
            </p>
          </div>
        </div>
      </div>

      {/* Date Selection */}
      <div className="mb-4">
        <DateForGrid
          dates={dates}
          selectedDate={selectedDate}
          setSelectedDate={setSelectedDate}
        />
      </div>

      {/* Workbook Selection */}
      <div className="mb-4" data-onboarding="workbook-selector">
        <label
          htmlFor="alat-name-choices"
          className="text-sm font-normal text-gray-600 dark:text-gray-400"
        >
          Select your workbook
        </label>
        <div className="my-2"></div>
        <AlatNameDropdown
          selectedAlatName={selectedAlatName}
          alatNames={alatNamesList}
          setSelectedAlatName={setSelectedAlatName}
        />
      </div>

      {/* Company Management Button */}
      <div className="pt-3 border-t border-gray-300 dark:border-gray-600" data-onboarding="manage-companies">
        <Button
          color="light"
          className="w-full"
          onClick={() => setShowCompanyModal(true)}
        >
          <HiOfficeBuilding className="mr-2 h-5 w-5" />
          Manage Company Names
        </Button>
      </div>
    </div>

    {/* Company Name Management Modal */}
    <CompanyNameManagementModal
      show={showCompanyModal}
      onClose={() => setShowCompanyModal(false)}
      companyNames={companyNames}
    />
    </>
  );
};

export default WorkbookSelectionPanel;
