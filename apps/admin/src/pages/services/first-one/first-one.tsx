import logger from "@logger";
import { AgGridReact } from "ag-grid-react";
import console from "console";
import { addMonths } from "date-fns";
import { Button, Card, Modal } from "flowbite-react";
import { Ref, useRef, useState, useEffect, useCallback } from "react";
import { HiArrowRight, HiDocumentReport, HiExclamation, HiInformationCircle, HiRefresh } from "react-icons/hi";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Urls } from "../../../App";
import { LoadingSpinner, useToastContext } from "../../../context/ToastContext";
import { useLocale } from "../../../context/LocaleContext";
import { useOnboarding } from "../../../context/OnboardingContext";
import { useGetAlatNames } from "../../../hooks/useGetAlatNames";
import { useAvailableMonths } from "../../../hooks/useAvailableMonths";
import { useRecordPushSubscription, doesPushAffectWorksheet } from "../../../hooks/useRecordPushSubscription";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import { Row } from "../../../types/globals";
import Provider from "./first-one-provider";
import MyGrid, { MyGridRef, SaveState } from "./grid/ag-grid";
import MetadataSidebar from "./metadata-sidebar/metadata-sidebar/metadata-sidebar";
import { worksheetDataKeys } from "./queries";

const FirstOne = () => {
  const gridRef = useRef<MyGridRef>(null);
  const navigate = useNavigate();
  const { t, locale } = useLocale();
  const { showToast } = useToastContext();
  const { run, stepIndex, setStepIndex, stopOnboarding, startOnboarding, hasCompletedOnboarding } = useOnboarding();

  // Handler for restoring from a snapshot
  const handleRestoreSnapshot = useCallback((snapshot: Row[]) => {
    const gridApi = gridRef.current?.gridRef?.api;
    if (!gridApi) {
      showToast("error", "Grid not ready");
      return;
    }

    // Replace all row data with the snapshot
    gridApi.setGridOption("rowData", snapshot);

    // Trigger save after restore
    setTimeout(() => {
      gridRef.current?.handleSaveWorksheet();
    }, 100);
  }, [showToast]);

  // Fetch available months from database
  const { months: endOfMonths, isLoading: isLoadingMonths } = useAvailableMonths();

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [saveState, setSaveState] = useState<SaveState>("Not Saved");
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [userSelectedAlatName, setUserSelectedAlatName] = useState<string>();

  // Real-time push notification state
  const [isWorksheetBlocked, setIsWorksheetBlocked] = useState(false);
  const [showNewDataModal, setShowNewDataModal] = useState(false);
  const queryClient = useQueryClient();
  const { latestPush, clearNotification } = useRecordPushSubscription();

  // Calculate next month date (use current date as fallback when selectedDate is null)
  const nextMonthDate = selectedDate ? addMonths(selectedDate, 1) : addMonths(new Date(), 1);

  // Fetch alat names - hook is always called, but uses fallback dates when selectedDate is null
  const {
    data: alatNamesData,
    isLoading,
    error,
  } = useGetAlatNames({
    startDate: selectedDate ?? new Date(),
    endDate: nextMonthDate,
  });

  // Derived values for current worksheet (needed early for push notification detection)
  const alatNames = alatNamesData ?? [];
  const selectedAlatName = userSelectedAlatName ?? alatNames?.[0];
  const worksheetName = selectedAlatName ?? "";

  // Ensure tour runs when landing on Editor page
  useEffect(() => {
    console.log("[FirstOne] Onboarding useEffect triggered");
    console.log("[FirstOne] run:", run);
    console.log("[FirstOne] stepIndex:", stepIndex);
    console.log("[FirstOne] hasCompletedOnboarding:", hasCompletedOnboarding);

    // If user navigated directly to Editor (stepIndex=0) but tour is running,
    // skip Dashboard step and start Editor tour
    if (run && stepIndex === 0) {
      console.log("[FirstOne] 🔄 Skipping Dashboard step, starting Editor tour directly");
      setStepIndex(1);
    } else if (run && stepIndex >= 10) {
      // User came from Generate Rekapan page, reset to Editor tour
      console.log("[FirstOne] 🔄 Coming from Generate Rekapan, resetting to Editor tour");
      setStepIndex(1);
    } else if (stepIndex >= 1 && stepIndex < 10 && !run && !hasCompletedOnboarding) {
      console.log("[FirstOne] ✅ Starting onboarding tour on Editor page");
      startOnboarding();
    } else if (stepIndex >= 1 && stepIndex < 10 && run) {
      console.log("[FirstOne] ✅ Tour already running on Editor steps, stepIndex:", stepIndex);
    }
  }, [stepIndex, run, startOnboarding, setStepIndex, hasCompletedOnboarding]);

  // Set initial selected date when months are loaded
  useEffect(() => {
    if (endOfMonths.length > 0 && !selectedDate) {
      setSelectedDate(endOfMonths[0]!);
    }
  }, [endOfMonths, selectedDate]);

  // Handle real-time push notifications from scanner
  useEffect(() => {
    if (!latestPush || !selectedDate || !worksheetName) return;

    // Check if this push affects the currently viewed worksheet
    const affectsCurrentWorksheet = doesPushAffectWorksheet(
      latestPush,
      worksheetName,
      selectedDate
    );

    if (affectsCurrentWorksheet) {
      console.log("[FirstOne] Push notification affects current worksheet, blocking editing");
      setIsWorksheetBlocked(true);
      setShowNewDataModal(true);
    }
  }, [latestPush, selectedDate, worksheetName]);

  // Reset blocked state when user switches worksheet or date
  useEffect(() => {
    // If user switches to a different worksheet/date that wasn't affected, unblock
    if (isWorksheetBlocked && latestPush && selectedDate && worksheetName) {
      const stillAffected = doesPushAffectWorksheet(latestPush, worksheetName, selectedDate);
      if (!stillAffected) {
        setIsWorksheetBlocked(false);
        setShowNewDataModal(false);
      }
    }
  }, [worksheetName, selectedDate, isWorksheetBlocked, latestPush]);

  // Handler for refreshing data after push notification
  const handleRefreshPage = useCallback(() => {
    // Invalidate worksheet data query to refetch
    queryClient.invalidateQueries({ queryKey: worksheetDataKeys.detail(worksheetName, selectedDate!) });

    // Clear the notification and unblock editing
    clearNotification();
    setIsWorksheetBlocked(false);
    setShowNewDataModal(false);

    showToast("success", t.stokAlatEditor.newDataModal?.refreshed || "Data refreshed successfully");
  }, [queryClient, worksheetName, selectedDate, clearNotification, showToast, t]);

  // Show loading while fetching months
  if (isLoadingMonths) {
    return <LoadingSpinner />;
  }

  // Show message if no months are available
  if (!isLoadingMonths && endOfMonths.length === 0) {
    return (
      <NavbarSidebarLayout>
        <div className="flex min-h-screen items-center justify-center bg-gray-100 dark:bg-gray-900">
          <div className="max-w-md rounded-lg bg-white p-8 text-center shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
              No Data Available
            </h2>
            <p className="mb-6 text-gray-600 dark:text-gray-400">
              There are no records in the database yet. Please upload some data first using the stok alat uploader script, or add a custom date using the "Manage Input Dates" feature.
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              If you just deployed the database, make sure to run the SQL migration for the <code className="rounded bg-gray-100 px-1 dark:bg-gray-700">get_available_months</code> function.
            </p>
          </div>
        </div>
      </NavbarSidebarLayout>
    );
  }

  // Show loading while waiting for selected date to be set
  if (!selectedDate) {
    return <LoadingSpinner />;
  }

  logger.debug(selectedDate);
  logger.debug(nextMonthDate);

  console.log("[FirstOne] Query state:", { isLoading, error, hasData: !!alatNamesData });

  console.log("[FirstOne] Alat names:", {
    alatNames,
    length: alatNames.length,
    firstItem: alatNames[0],
    rawData: alatNamesData
  });

  console.log("[FirstOne] Selected:", {
    userSelectedAlatName,
    selectedAlatName,
    worksheetName,
    fallbackValue: alatNames?.[0]
  });

  // Onboarding steps for Editor page
  const editorSteps: Step[] = [
    {
      target: '[data-onboarding="date-selector"]',
      content: t.stokAlatEditor.onboarding.step1,
      disableBeacon: true,
      placement: "right",
    },
    {
      target: '[data-onboarding="workbook-selector"]',
      content: t.stokAlatEditor.onboarding.step2,
      placement: "right",
    },
    {
      target: '[data-onboarding="main-editor"]',
      content: t.stokAlatEditor.onboarding.step3,
      placement: "left",
    },
    {
      target: '[data-onboarding="manage-companies"]',
      content: t.stokAlatEditor.onboarding.step4,
      placement: "right",
    },
    {
      target: '[data-onboarding="generate-rekapan"]',
      content: t.stokAlatEditor.onboarding.step5,
      placement: "bottom",
      disableScrolling: false, // Allow scrolling to this element
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action, index, type } = data;

    console.log("[FirstOne] Joyride callback:", { status, action, index, type });

    // Handle when user clicks outside (overlay) or closes the tour
    if (action === 'close' || status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log("[FirstOne] Tour closed, finished, or skipped");
      stopOnboarding();
    }
  };

  if (alatNames) {
    return (
      <NavbarSidebarLayout>
        {stepIndex >= 1 && stepIndex < 10 && (
          <Joyride
            key="editor-tour"
            steps={editorSteps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            scrollToFirstStep
            disableScrolling={false}
            scrollOffset={100}
            disableBeacon
            hideBackButton
            disableOverlayClose={false}
            spotlightClicks={false}
            locale={{
              last: 'Finish',
              close: 'Close',
              next: 'Next',
              skip: 'Skip',
            }}
            styles={{
              options: {
                primaryColor: '#3b82f6',
                zIndex: 10000,
              },
              beacon: {
                display: 'none',
              },
            }}
          />
        )}
        <Provider>
          <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <div className="px-8 pt-8 pb-8">
              {/* Page Header Container */}
              <div className="mb-6 rounded-lg bg-white p-6 shadow-sm dark:bg-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                        Stok Alat Editor
                      </h1>
                      <button
                        onClick={() => setShowInfoModal(true)}
                        className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                        title={t.stokAlatEditor.learnMore}
                      >
                        <HiInformationCircle className="h-6 w-6" />
                      </button>
                    </div>
                    <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                      {t.stokAlatEditor.manageEquipmentData} {selectedAlatName || t.stokAlatEditor.allEquipment}
                    </p>
                  </div>
                  <Button
                    onClick={() => navigate(Urls.GENERATE_REKAPAN)}
                    color="blue"
                    size="lg"
                    className="flex items-center gap-2"
                    data-onboarding="generate-rekapan"
                  >
                    <HiDocumentReport className="h-5 w-5" />
                    {t.sidebar.generateRekapan}
                    <HiArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="flex gap-6">
                {/* Sidebar Controls */}
                <div className="w-80 flex-shrink-0">
                  <MetadataSidebar
                    alatNamesList={alatNames}
                    selectedAlatName={selectedAlatName}
                    setSelectedAlatName={setUserSelectedAlatName}
                    selectedDate={selectedDate}
                    setSelectedDate={setSelectedDate}
                    dates={endOfMonths}
                    gridRef={gridRef}
                    saveState={saveState}
                    onRestoreSnapshot={handleRestoreSnapshot}
                  />
                </div>

                {/* Data Grid Area */}
                <div className="flex-1">
                  <Card data-onboarding="main-editor">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-gray-200 pb-4 dark:border-gray-700">
                        <div>
                          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                            {t.stokAlatEditor.equipmentStockData}
                          </h2>
                          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {worksheetName ? `${t.stokAlatEditor.editingWorksheet} ${worksheetName}` : t.stokAlatEditor.selectWorkbook}
                          </p>
                        </div>
                      </div>
                      <MyGrid
                        worksheetName={worksheetName}
                        selectedDate={selectedDate}
                        ref={gridRef}
                        onSaveStateChange={setSaveState}
                        disabled={isWorksheetBlocked}
                      />
                    </div>
                  </Card>
                </div>
              </div>
            </div>
          </div>

          {/* Info Modal */}
          <Modal dismissible show={showInfoModal} onClose={() => setShowInfoModal(false)} size="2xl">
            <Modal.Header>
              {t.stokAlatEditor.infoModal.title}
            </Modal.Header>
            <Modal.Body>
              <div className="space-y-4">
                <p className="text-gray-700 dark:text-gray-300">
                  {locale === 'en' ? (
                    <>The <span className="font-bold text-blue-700 dark:text-blue-400">Stok Alat Editor</span> is used for tracking the movement of stok alats between companies. Data is organized per month.</>
                  ) : (
                    <><span className="font-bold text-blue-700 dark:text-blue-400">Editor Stok Alat</span> digunakan untuk melacak pergerakan stok alat antar perusahaan. Data diorganisir per bulan.</>
                  )}
                </p>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t.stokAlatEditor.infoModal.howToUse}
                  </h3>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {locale === 'en' ? (
                      <>You can view each alat's data per month by <span className="font-bold text-blue-700 dark:text-blue-400">selecting</span> the <span className="font-bold text-blue-700 dark:text-blue-400">"Select your workbook"</span> dropdown.</>
                    ) : (
                      <>Anda dapat melihat data setiap alat per bulan dengan <span className="font-bold text-blue-700 dark:text-blue-400">memilih</span> dropdown <span className="font-bold text-blue-700 dark:text-blue-400">"Pilih workbook Anda"</span>.</>
                    )}
                  </p>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold text-gray-900 dark:text-white">
                    {t.stokAlatEditor.infoModal.features}
                  </h3>
                  <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
                    <li>
                      <strong>{t.stokAlatEditor.infoModal.feature1Title}</strong>{' '}
                      {locale === 'en' ? (
                        <>Register company names in <span className="font-bold text-blue-700 dark:text-blue-400">Manage Company Names</span>. Only these names can be used in the Company Name cell, which prevents any typos from occurring and ensures consistent correct data.</>
                      ) : (
                        <>Daftarkan nama perusahaan di <span className="font-bold text-blue-700 dark:text-blue-400">Kelola Nama Perusahaan</span>. Hanya nama-nama ini yang dapat digunakan di sel Nama Perusahaan, yang mencegah terjadinya typo dan memastikan data yang konsisten dan benar.</>
                      )}
                    </li>
                    <li>
                      <strong>{t.stokAlatEditor.infoModal.feature2Title}</strong>{' '}
                      <span className="font-bold text-blue-700 dark:text-blue-400">Masuk</span> {locale === 'en' ? '(incoming)' : ''} and <span className="font-bold text-blue-700 dark:text-blue-400">Keluar</span> {locale === 'en' ? '(outgoing)' : ''} are <span className="font-bold text-blue-700 dark:text-blue-400">{locale === 'en' ? 'mutually exclusive' : 'bersifat eksklusif'}</span> - {locale === 'en' ? 'a row cannot have values for both. The system will prevent saving if this rule is violated.' : 'satu baris tidak dapat memiliki nilai untuk keduanya. Sistem akan mencegah penyimpanan jika aturan ini dilanggar.'}
                      <div className="mt-2 space-y-1 rounded-lg bg-gray-50 p-3 text-xs dark:bg-gray-800">
                        <div className="font-semibold text-gray-700 dark:text-gray-300">
                          {locale === 'en' ? 'Example:' : 'Contoh:'}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-red-600 dark:text-red-400">✗</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            Masuk = <span className="font-semibold">90</span>, Keluar = <span className="font-semibold">50</span> {locale === 'en' ? '(will error and prevent saving)' : '(akan error dan mencegah penyimpanan)'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span className="text-gray-700 dark:text-gray-300">
                            Masuk = <span className="font-semibold">90</span>, Keluar = <span className="font-semibold">0</span> {locale === 'en' ? '(will work correctly)' : '(akan bekerja dengan benar)'}
                          </span>
                        </div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={() => setShowInfoModal(false)}>
                {t.stokAlatEditor.infoModal.gotIt}
              </Button>
            </Modal.Footer>
          </Modal>

          {/* New Data Added Modal (from Scanner Push) */}
          <Modal show={showNewDataModal} size="md" popup>
            <Modal.Body className="pt-8">
              <div className="text-center">
                <HiExclamation className="mx-auto mb-4 h-14 w-14 text-yellow-400" />
                <h3 className="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
                  {t.stokAlatEditor.newDataModal?.title || "New Data Added"}
                </h3>
                <p className="mb-5 text-sm text-gray-500 dark:text-gray-400">
                  {t.stokAlatEditor.newDataModal?.description ||
                    "New data has been added to this worksheet by the scanner. Please refresh the page to see the latest data."}
                </p>
                <div className="flex justify-center">
                  <Button color="blue" onClick={handleRefreshPage}>
                    <HiRefresh className="mr-2 h-5 w-5" />
                    {t.stokAlatEditor.newDataModal?.refresh || "Refresh Page"}
                  </Button>
                </div>
              </div>
            </Modal.Body>
          </Modal>
        </Provider>
      </NavbarSidebarLayout>
    );
  }

  if (isLoading) return <LoadingSpinner />;
  if (error) return error.message;
};

export default FirstOne;
