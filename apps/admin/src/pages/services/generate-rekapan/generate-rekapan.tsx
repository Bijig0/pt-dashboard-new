import { Alert, Button, Card, Modal } from "flowbite-react";
import { useState, useEffect } from "react";
import { HiCalendar, HiChevronDown, HiDocumentReport, HiInformationCircle, HiArrowRight, HiQuestionMarkCircle, HiCog } from "react-icons/hi";
import { Link } from "react-router-dom";
import Joyride, { Step, CallBackProps, STATUS } from "react-joyride";
import { useLocale } from "../../../context/LocaleContext";
import { useOnboarding } from "../../../context/OnboardingContext";
import { LoadingSpinner, useToastContext } from "../../../context/ToastContext";
import { useAvailableMonths } from "../../../hooks/useAvailableMonths";
import NavbarSidebarLayout from "../../../layouts/navbar-sidebar";
import { handleGenerateRekapan } from "../first-one/grid/handleGenerateRekapan/handleGenerateRekapan";
import { InitialTotalSewaAlat } from "../first-one/grid/handleGenerateRekapan/buildInitialRekapanFromValues/buildInitialRekapanFromValues";
import Provider, { useFirstOneContext } from "../first-one/first-one-provider";
import GenerateAllRekapansButton from "../first-one/generate-rekapan/generate-rekapan-button";
import SearchableDropdown from "../../../components/SearchableDropdown";
import StokAlatSnapshotModal from "./stok-alat-snapshot-modal";
import { ExampleFlowModal } from "./example-generate-rekapan-flow/example-flow-modal";
import InitialTotalSewaAlatModal from "./initial-total-sewa-alat-input/initial-total-sewa-alat-modal";

const GenerateRekapanContent = () => {
  const { t } = useLocale();
  const { run, stepIndex, setStepIndex, stopOnboarding, resetOnboarding, hasCompletedOnboarding } = useOnboarding();
  const {
    setStartRekapanCreationDate,
    setEndRekapanCreationDate,
    startRekapanCreationDate,
    endRekapanCreationDate,
  } = useFirstOneContext();

  const { months: endOfMonths, isLoading: isLoadingMonths } = useAvailableMonths();
  const { showToast } = useToastContext();

  // All useState hooks must be called unconditionally at the top
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showExampleModal, setShowExampleModal] = useState(false);
  const [showInitialSewaAlatModal, setShowInitialSewaAlatModal] = useState(false);
  const [isSingleRekapanExpanded, setIsSingleRekapanExpanded] = useState(false);
  const [singleRekapanMonth, setSingleRekapanMonth] = useState<Date | undefined>(undefined);
  const [isGeneratingSingle, setIsGeneratingSingle] = useState(false);
  const [showSingleInitialSewaAlatModal, setShowSingleInitialSewaAlatModal] = useState(false);
  const [singleInitialTotalSewaAlat, setSingleInitialTotalSewaAlat] = useState<InitialTotalSewaAlat>({});
  const [initialTotalSewaAlat, setInitialTotalSewaAlat] = useState<InitialTotalSewaAlat>({});

  // Auto-start onboarding on Generate Rekapan page if coming from Editor
  // This useEffect must be called unconditionally (before any early returns)
  useEffect(() => {
    console.log("[GenerateRekapan] Onboarding useEffect triggered");
    console.log("[GenerateRekapan] stepIndex:", stepIndex);
    console.log("[GenerateRekapan] run:", run);
    console.log("[GenerateRekapan] hasCompletedOnboarding:", hasCompletedOnboarding);

    // If user came from Editor tour (stepIndex >= 1) and clicked Generate Rekapan,
    // move to Generate Rekapan tour
    if (stepIndex >= 1 && stepIndex < 10 && run) {
      console.log("[GenerateRekapan] Moving to Generate Rekapan tour, setting stepIndex to 10");
      setStepIndex(10); // Use stepIndex 10 for Generate Rekapan page
    }
  }, [stepIndex, run, setStepIndex, hasCompletedOnboarding]);

  // Show loading if months not ready (after all hooks are called)
  if (isLoadingMonths) {
    return <LoadingSpinner />;
  }

  const handleStartDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0) {
      setStartRekapanCreationDate(endOfMonths[selectedIndex]);
    } else {
      setStartRekapanCreationDate(undefined);
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0) {
      setEndRekapanCreationDate(endOfMonths[selectedIndex]);
    } else {
      setEndRekapanCreationDate(undefined);
    }
  };

  const formatDateForDisplay = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
    });
  };

  const getSelectedStartIndex = () => {
    if (!startRekapanCreationDate) return -1;
    return endOfMonths.findIndex(
      (date) => date.getTime() === startRekapanCreationDate.getTime()
    );
  };

  const getSelectedEndIndex = () => {
    if (!endRekapanCreationDate) return -1;
    return endOfMonths.findIndex(
      (date) => date.getTime() === endRekapanCreationDate.getTime()
    );
  };

  // Onboarding steps for Generate Rekapan page
  const generateRekapanSteps: Step[] = [
    {
      target: '[data-onboarding="start-month"]',
      content: t.generateRekapan.onboarding.step1,
      disableBeacon: true,
      placement: "right",
    },
    {
      target: '[data-onboarding="initial-sewa-button"]',
      content: t.generateRekapan.onboarding.step2,
      placement: "bottom",
    },
    {
      target: '[data-onboarding="end-month"]',
      content: t.generateRekapan.onboarding.step3,
      placement: "right",
    },
    {
      target: '[data-onboarding="generate-button"]',
      content: t.generateRekapan.onboarding.step4,
      placement: "top",
    },
  ];

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status, action } = data;

    console.log("[GenerateRekapan] Joyride callback:", { status, action });

    // Handle when user clicks outside (overlay) or closes the tour
    if (action === 'close' || status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      console.log("[GenerateRekapan] Tour closed, finished, or skipped");
      stopOnboarding();
    }
  };

  const handleSingleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedIndex = parseInt(e.target.value);
    if (selectedIndex >= 0) {
      setSingleRekapanMonth(endOfMonths[selectedIndex]);
    } else {
      setSingleRekapanMonth(undefined);
    }
  };

  const getSelectedSingleMonthIndex = () => {
    if (!singleRekapanMonth) return -1;
    return endOfMonths.findIndex(
      (date) => date.getTime() === singleRekapanMonth.getTime()
    );
  };

  const handleGenerateSingleRekapan = async () => {
    if (!singleRekapanMonth) {
      showToast("error", t.generateRekapan.toast.pleaseSelectMonth);
      return;
    }

    try {
      setIsGeneratingSingle(true);
      showToast("loading", t.generateRekapan.toast.generatingSingle);
      // Use singleRekapanMonth as start date and use single-specific initial values
      await handleGenerateRekapan(singleRekapanMonth, singleRekapanMonth, singleInitialTotalSewaAlat);
      showToast("success", t.generateRekapan.toast.singleSuccess);
    } catch (error) {
      console.error("Error generating single rekapan:", error);
      showToast("error", t.generateRekapan.toast.singleFailed);
    } finally {
      setIsGeneratingSingle(false);
    }
  };

  return (
    <div className="px-8 pt-8">
      {stepIndex >= 10 && (
        <Joyride
          key="generate-rekapan-tour"
          steps={generateRekapanSteps}
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
      <div className="max-w-7xl space-y-6">
        {/* Page Header Card */}
        <Card>
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                  {t.generateRekapan.title}
                </h1>
                <button
                  onClick={() => setShowInfoModal(true)}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  title={t.generateRekapan.infoModal.title}
                >
                  <HiInformationCircle className="h-6 w-6" />
                </button>
                <button
                  onClick={() => {
                    resetOnboarding();
                    // Set to Generate Rekapan tour (stepIndex 10) after reset
                    setTimeout(() => setStepIndex(10), 100);
                  }}
                  className="rounded-full p-1 text-gray-500 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                  title={t.common.restartOnboarding}
                >
                  <span className="sr-only">{t.common.restartOnboarding}</span>
                  <HiQuestionMarkCircle className="h-6 w-6" />
                </button>
              </div>
              <p className="mt-2 text-lg text-gray-600 dark:text-gray-400">
                {t.generateRekapan.subtitle}
              </p>
              <Link
                to="/services/first-one"
                className="mt-2 inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                {t.generateRekapan.goToEditor}
                <HiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
        {/* Generate Over Time Rekapan - Big Card */}
        <Card>
          <div className="space-y-6">
            {/* Main Header */}
            <div className="flex items-center gap-3 border-b border-gray-200 pb-4 dark:border-gray-700">
              <HiDocumentReport className="h-8 w-8 text-blue-600 dark:text-blue-500" />
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {t.generateRekapan.overTime.title}
                </h2>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t.generateRekapan.overTime.subtitle}
                </p>
              </div>
            </div>

            {/* Two-column layout for settings */}
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Date Range Settings Card */}
              <Card>
                <div className="space-y-6">
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200 dark:border-gray-700">
                    <HiCalendar className="h-6 w-6 text-blue-600 dark:text-blue-500" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {t.generateRekapan.settings.rekapanSettings}
                    </h3>
                  </div>

                  <div className="space-y-6">
                  {/* Start Date Selector */}
                  <div data-onboarding="start-month">
                    <label
                      htmlFor="start-date"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <HiCalendar className="h-5 w-5 text-gray-500" />
                      {t.generateRekapan.settings.startMonth}
                    </label>
                    <SearchableDropdown
                      id="start-date"
                      name="start-date"
                      value={getSelectedStartIndex()}
                      options={[
                        { value: -1, label: t.generateRekapan.settings.selectStartMonth },
                        ...endOfMonths.map((date, index) => ({
                          value: index,
                          label: formatDateForDisplay(date),
                        })),
                      ]}
                      onChange={(value) => {
                        const selectedIndex = value as number;
                        if (selectedIndex >= 0) {
                          setStartRekapanCreationDate(endOfMonths[selectedIndex]);
                        } else {
                          setStartRekapanCreationDate(undefined);
                        }
                      }}
                      placeholder={t.generateRekapan.settings.selectStartMonth}
                    />
                    {startRekapanCreationDate && (
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-green-600 dark:text-green-500">
                            ✓ {t.generateRekapan.settings.selected}: {formatDateForDisplay(startRekapanCreationDate)}
                          </p>
                          <StokAlatSnapshotModal
                            selectedDate={startRekapanCreationDate}
                            label={formatDateForDisplay(startRekapanCreationDate)}
                          />
                        </div>
                        <Button
                          size="sm"
                          color="light"
                          onClick={() => setShowInitialSewaAlatModal(true)}
                          data-onboarding="initial-sewa-button"
                        >
                          <HiCog className="mr-2 h-4 w-4" />
                          {t.generateRekapan.initialTotalSewaAlat.buttonText}
                        </Button>
                      </div>
                    )}
                    {!startRekapanCreationDate && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {t.generateRekapan.settings.pleaseSelectStart}
                      </p>
                    )}
                  </div>

                  {/* End Date Selector */}
                  <div data-onboarding="end-month">
                    <label
                      htmlFor="end-date"
                      className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      <HiCalendar className="h-5 w-5 text-gray-500" />
                      {t.generateRekapan.settings.endMonth}
                    </label>
                    <SearchableDropdown
                      id="end-date"
                      name="end-date"
                      value={getSelectedEndIndex()}
                      options={[
                        { value: -1, label: t.generateRekapan.settings.selectEndMonth },
                        ...endOfMonths.map((date, index) => ({
                          value: index,
                          label: formatDateForDisplay(date),
                        })),
                      ]}
                      onChange={(value) => {
                        const selectedIndex = value as number;
                        if (selectedIndex >= 0) {
                          setEndRekapanCreationDate(endOfMonths[selectedIndex]);
                        } else {
                          setEndRekapanCreationDate(undefined);
                        }
                      }}
                      placeholder={t.generateRekapan.settings.selectEndMonth}
                    />
                    {endRekapanCreationDate && (
                      <div className="mt-2 flex items-center justify-between">
                        <p className="text-sm text-green-600 dark:text-green-500">
                          ✓ {t.generateRekapan.settings.selected}: {formatDateForDisplay(endRekapanCreationDate)}
                        </p>
                        <StokAlatSnapshotModal
                          selectedDate={endRekapanCreationDate}
                          label={formatDateForDisplay(endRekapanCreationDate)}
                        />
                      </div>
                    )}
                    {!endRekapanCreationDate && (
                      <p className="mt-2 text-sm text-red-600 dark:text-red-500">
                        {t.generateRekapan.settings.pleaseSelectEnd}
                      </p>
                    )}
                  </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Generate Status Section */}
            <div className="space-y-4">
              {/* Info Box */}
              {startRekapanCreationDate && endRekapanCreationDate && (
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="flex items-start gap-3">
                    <HiDocumentReport className="mt-0.5 h-5 w-5 text-blue-600 dark:text-blue-400" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">
                        {t.generateRekapan.status.readyToGenerate}
                      </h3>
                      <p className="mt-1 text-sm text-blue-700 dark:text-blue-400">
                        {t.generateRekapan.status.willGenerateFrom}{" "}
                        <strong>{formatDateForDisplay(startRekapanCreationDate)}</strong>{" "}
                        {t.generateRekapan.status.to} <strong>{formatDateForDisplay(endRekapanCreationDate)}</strong>.
                        {startRekapanCreationDate > endRekapanCreationDate && (
                          <span className="block mt-2 text-red-600 dark:text-red-400 font-medium">
                            {t.generateRekapan.status.warningStartAfterEnd}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Generate Button */}
              <div className="flex justify-end border-t border-gray-200 pt-4 dark:border-gray-700">
                <div data-onboarding="generate-button">
                  <GenerateAllRekapansButton
                    initialTotalSewaAlat={initialTotalSewaAlat}
                  />
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Single Month Rekapan Panel - Collapsible */}
        <Card>
          <div className="space-y-4">
            {/* Collapsible Header */}
            <button
              onClick={() => setIsSingleRekapanExpanded(!isSingleRekapanExpanded)}
              className="flex w-full items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg p-2 -m-2 transition-colors"
            >
              <div className="flex items-center gap-3">
                <HiDocumentReport className="h-6 w-6 text-purple-600 dark:text-purple-500" />
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t.generateRekapan.singleMonth.title}
                  </h2>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {t.generateRekapan.singleMonth.subtitle}
                  </p>
                </div>
              </div>
              {isSingleRekapanExpanded ? (
                <HiChevronUp className="h-5 w-5 text-gray-500" />
              ) : (
                <HiChevronDown className="h-5 w-5 text-gray-500" />
              )}
            </button>

            {/* Collapsible Content */}
            {isSingleRekapanExpanded && (
              <div className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <Alert color="info" icon={HiInformationCircle}>
                  <p className="text-sm">
                    {t.generateRekapan.singleMonth.infoText}
                  </p>
                </Alert>

                {/* Month Selector */}
                <div>
                  <label
                    htmlFor="single-month"
                    className="mb-2 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white"
                  >
                    <HiCalendar className="h-5 w-5 text-gray-500" />
                    {t.generateRekapan.singleMonth.selectMonth}
                  </label>
                  <SearchableDropdown
                    id="single-month"
                    name="single-month"
                    value={getSelectedSingleMonthIndex()}
                    options={[
                      { value: -1, label: t.generateRekapan.singleMonth.selectMonthPlaceholder },
                      ...endOfMonths.map((date, index) => ({
                        value: index,
                        label: formatDateForDisplay(date),
                      })),
                    ]}
                    onChange={(value) => {
                      const selectedIndex = value as number;
                      if (selectedIndex >= 0) {
                        setSingleRekapanMonth(endOfMonths[selectedIndex]);
                      } else {
                        setSingleRekapanMonth(undefined);
                      }
                    }}
                    placeholder={t.generateRekapan.singleMonth.selectMonthPlaceholder}
                  />
                  {singleRekapanMonth && (
                    <div className="mt-2 space-y-2">
                      <p className="text-sm text-green-600 dark:text-green-500">
                        ✓ {t.generateRekapan.settings.selected}: {formatDateForDisplay(singleRekapanMonth)}
                      </p>
                      <Button
                        size="sm"
                        color="light"
                        onClick={() => setShowSingleInitialSewaAlatModal(true)}
                      >
                        <HiCog className="mr-2 h-4 w-4" />
                        {t.generateRekapan.initialTotalSewaAlat.buttonText}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Generate Button */}
                <div className="flex justify-end pt-2">
                  <Button
                    color="purple"
                    onClick={handleGenerateSingleRekapan}
                    disabled={!singleRekapanMonth || isGeneratingSingle}
                  >
                    {isGeneratingSingle ? t.generateRekapan.singleMonth.generating : t.generateRekapan.singleMonth.generateButton}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Example Modal */}
      <ExampleFlowModal
        showExampleModal={showExampleModal}
        setShowExampleModal={setShowExampleModal}
      />

      {/* Info Modal */}
      <Modal dismissible show={showInfoModal} onClose={() => setShowInfoModal(false)} size="2xl">
        <Modal.Header>
          {t.generateRekapan.infoModal.title}
        </Modal.Header>
        <Modal.Body>
          <div className="space-y-4">
            <p className="text-gray-700 dark:text-gray-300">
              {t.generateRekapan.infoModal.description}
            </p>

            <div className="space-y-3">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {t.generateRekapan.infoModal.mainFunctions}
              </h3>
              <ul className="list-disc space-y-2 pl-5 text-sm text-gray-700 dark:text-gray-300">
                <li>{t.generateRekapan.infoModal.function1}</li>
                <li>{t.generateRekapan.infoModal.function2}</li>
                <li>{t.generateRekapan.infoModal.function3}</li>
                <li>{t.generateRekapan.infoModal.function4}</li>
              </ul>
            </div>

            <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>{t.generateRekapan.infoModal.note}</strong> {t.generateRekapan.infoModal.noteText}
              </p>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className="flex justify-between w-full">
            <Button
              color="light"
              onClick={() => {
                setShowInfoModal(false);
                setShowExampleModal(true);
              }}
            >
              See Example
            </Button>
            <Button onClick={() => setShowInfoModal(false)}>
              {t.common.understand}
            </Button>
          </div>
        </Modal.Footer>
      </Modal>

      {/* Initial Total Sewa Alat Modal - Over Time */}
      <InitialTotalSewaAlatModal
        startDate={startRekapanCreationDate}
        initialValues={initialTotalSewaAlat}
        onChange={setInitialTotalSewaAlat}
        isOpen={showInitialSewaAlatModal}
        onClose={() => setShowInitialSewaAlatModal(false)}
      />

      {/* Initial Total Sewa Alat Modal - Single Month */}
      <InitialTotalSewaAlatModal
        startDate={singleRekapanMonth}
        initialValues={singleInitialTotalSewaAlat}
        onChange={setSingleInitialTotalSewaAlat}
        isOpen={showSingleInitialSewaAlatModal}
        onClose={() => setShowSingleInitialSewaAlatModal(false)}
      />
    </div>
  );
};

const GenerateRekapan = () => {
  return (
    <NavbarSidebarLayout>
      <Provider>
        <GenerateRekapanContent />
      </Provider>
    </NavbarSidebarLayout>
  );
};

export default GenerateRekapan;
