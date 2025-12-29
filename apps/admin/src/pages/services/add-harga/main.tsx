import { Button, Card } from "flowbite-react";
import { SetStateAction, useState } from "react";
import { HiInformationCircle, HiMenuAlt1 } from "react-icons/hi";
import { useToggle } from "usehooks-ts";
import { LoadingSpinner } from "../../../context/ToastContext";
import useGetAlatNamesForCompany from "../../../hooks/useGetAlatNamesForCompany";
import useGetCompanyNames from "../../../hooks/useGetCompanyNames";
import { AlatNameDropdown } from "./company-name-dropdown/alat-name-dropdown/alat-name-dropdown";
import { HargaAlat } from "./company-name-dropdown/alat-name-dropdown/harga-alat/harga-alat";
import { CompanyNameDropdown } from "./company-name-dropdown/company-name-dropdown";
import { InfoModal } from "./components/info-modal";
import { UnsavedChangesWarningModal } from "./components/unsaved-changes-warning-modal";

type _MainProps = {
  selectedAlatName: string | undefined;
  selectedCompanyName: string | undefined;
  companyNames: string[];
  alatNames: string[];
  setUserInputAlatName: React.Dispatch<SetStateAction<string | undefined>>;
  setUserInputCompanyName: React.Dispatch<SetStateAction<string | undefined>>;
  mode: 'view' | 'create';
  hasUnsavedChanges: boolean;
  showUnsavedWarningModal: boolean;
  showInfoModal: boolean;
  onAddNewAlatClick: () => void;
  onCancelCreate: () => void;
  onCreateSuccess: (newAlatName: string) => void;
  setHasUnsavedChanges: (value: boolean) => void;
  setShowUnsavedWarningModal: (value: boolean) => void;
  setShowInfoModal: (value: boolean) => void;
  onConfirmDiscardChanges: () => void;
};

export const _Main = function (props: _MainProps) {
  const {
    selectedAlatName,
    selectedCompanyName,
    companyNames,
    alatNames,
    setUserInputAlatName,
    setUserInputCompanyName,
    mode,
    hasUnsavedChanges,
    showUnsavedWarningModal,
    showInfoModal,
    onAddNewAlatClick,
    onCancelCreate,
    onCreateSuccess,
    setHasUnsavedChanges,
    setShowUnsavedWarningModal,
    setShowInfoModal,
    onConfirmDiscardChanges,
  } = props;

  const [sidebarOpen, toggle] = useToggle(true);

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

  return (
    <div className="mb-4 h-full rounded-lg bg-white p-4 shadow dark:bg-gray-800 sm:p-6">
      {/* Header */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
            Add Harga
          </h3>
          <button
            onClick={() => setShowInfoModal(true)}
            className="mt-1 flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <HiInformationCircle className="h-4 w-4" />
            <span>About alat selection</span>
          </button>
        </div>
        <div className="mx-3"></div>
        <button className="cursor-pointer rounded text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white lg:inline">
          <HiMenuAlt1 onClick={toggle} className="h-6 w-6" />
        </button>
      </div>

      {/* Proyek Section */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <h4 className="text-sm font-normal text-gray-600 dark:text-gray-400">
            Select your Proyek
          </h4>
          <Button size="sm" onClick={onAddNewAlatClick} disabled>
            Add New Alat
          </Button>
        </div>
        <CompanyNameDropdown
          companyNames={companyNames}
          selectedCompanyName={selectedCompanyName}
          setUserInputCompanyName={setUserInputCompanyName}
        />
      </div>

      {/* Alat Card Section */}
      {selectedCompanyName && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h5 className="text-lg font-medium text-gray-900 dark:text-white">
              Alat
            </h5>
            {mode === 'create' && (
              <Button size="sm" color="gray" onClick={onCancelCreate}>
                Cancel
              </Button>
            )}
          </div>

          <AlatNameDropdown
            mode={mode}
            alatNames={alatNames}
            selectedAlatName={selectedAlatName}
            setUserInputAlatName={setUserInputAlatName}
          />

          {selectedAlatName && (
            <HargaAlat
              mode={mode}
              selectedAlatName={selectedAlatName}
              selectedCompanyName={selectedCompanyName}
              alatNames={alatNames}
              setHasUnsavedChanges={setHasUnsavedChanges}
              onCreateSuccess={onCreateSuccess}
            />
          )}
        </Card>
      )}

      {/* Unsaved Changes Warning Modal */}
      <UnsavedChangesWarningModal
        isOpen={showUnsavedWarningModal}
        onClose={() => setShowUnsavedWarningModal(false)}
        onConfirm={onConfirmDiscardChanges}
      />

      {/* Info Modal */}
      <InfoModal
        isOpen={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    </div>
  );
};

const Main = () => {
  const {
    data: companyNames,
    isLoading: isGetCompanyNamesLoading,
    error,
  } = useGetCompanyNames();

  const [userInputCompanyName, setUserInputCompanyName] = useState<
    string | undefined
  >(undefined);

  const selectedCompanyName = userInputCompanyName ?? companyNames?.[0];

  const {
    data: alatNames,
    isLoading: isAlatNamesLoading,
    error: alatNamsError,
  } = useGetAlatNamesForCompany(selectedCompanyName);

  const [userInputAlatName, setUserInputAlatName] = useState<
    string | undefined
  >(undefined);

  const selectedAlatName = userInputAlatName ?? alatNames?.[0];

  // New state for mode management
  const [mode, setMode] = useState<'view' | 'create'>('view');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [showUnsavedWarningModal, setShowUnsavedWarningModal] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<(() => void) | null>(null);

  // Mode switching handlers
  const handleAddNewAlatClick = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setMode('create');
        setUserInputAlatName('');
      });
      setShowUnsavedWarningModal(true);
    } else {
      setMode('create');
      setUserInputAlatName('');
    }
  };

  const handleCancelCreate = () => {
    if (hasUnsavedChanges) {
      setPendingAction(() => () => {
        setMode('view');
        setUserInputAlatName(alatNames?.[0]);
      });
      setShowUnsavedWarningModal(true);
    } else {
      setMode('view');
      setUserInputAlatName(alatNames?.[0]);
    }
  };

  const handleCreateSuccess = (newAlatName: string) => {
    setMode('view');
    setUserInputAlatName(newAlatName);
    setHasUnsavedChanges(false);
  };

  const handleConfirmDiscardChanges = () => {
    setShowUnsavedWarningModal(false);
    setHasUnsavedChanges(false);
    if (pendingAction) {
      pendingAction();
      setPendingAction(null);
    }
  };

  if (!alatNames || !companyNames) return <LoadingSpinner />;

  return (
    <_Main
      selectedAlatName={selectedAlatName}
      selectedCompanyName={selectedCompanyName}
      companyNames={companyNames}
      alatNames={alatNames}
      setUserInputAlatName={setUserInputAlatName}
      setUserInputCompanyName={setUserInputCompanyName}
      mode={mode}
      hasUnsavedChanges={hasUnsavedChanges}
      showUnsavedWarningModal={showUnsavedWarningModal}
      showInfoModal={showInfoModal}
      onAddNewAlatClick={handleAddNewAlatClick}
      onCancelCreate={handleCancelCreate}
      onCreateSuccess={handleCreateSuccess}
      setHasUnsavedChanges={setHasUnsavedChanges}
      setShowUnsavedWarningModal={setShowUnsavedWarningModal}
      setShowInfoModal={setShowInfoModal}
      onConfirmDiscardChanges={handleConfirmDiscardChanges}
    />
  );
};

export default Main;
