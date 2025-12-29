/* eslint-disable jsx-a11y/anchor-is-valid */
import "svgmap/dist/svgMap.min.css";
import NavbarSidebarLayout from "../layouts/navbar-sidebar";

import "ag-grid-community/styles/ag-grid.css"; // Core CSS
import "ag-grid-community/styles/ag-theme-quartz.css";

import "react-toastify/dist/ReactToastify.css";

import { Card, Table } from "flowbite-react";
import { HiCube, HiDocumentReport, HiCubeTransparent } from "react-icons/hi";
import Joyride, { Step } from "react-joyride";
import { Urls } from "../App";
import { useLocale } from "../context/LocaleContext";
import { useOnboarding } from "../context/OnboardingContext";

const Spinner = () => {
  return (
    <div role="status">
      <svg
        aria-hidden="true"
        className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
        viewBox="0 0 100 101"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
          fill="currentColor"
        />
        <path
          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
          fill="currentFill"
        />
      </svg>
      <span className="sr-only">Loading...</span>
    </div>
  );
};

const Downloads = function () {
  const { t } = useLocale();
  const { run, stepIndex, setStepIndex, stopOnboarding } = useOnboarding();

  console.log("[Dashboard] Onboarding state:", { run, stepIndex });

  const steps: Step[] = [
    {
      target: '[data-onboarding="editor-link"]',
      content: t.dashboard.onboarding.welcome,
      disableBeacon: true,
      placement: "right",
      spotlightClicks: false, // Prevent clicking through the spotlight
    },
  ];

  const handleJoyrideCallback = (data: any) => {
    const { status, index, type, action } = data;
    console.log("[Dashboard] Joyride callback:", { status, index, action, type });

    // When user clicks next/close on the dashboard step, move to Editor
    if (action === 'close' || action === 'next' || status === 'finished') {
      console.log("[Dashboard] Moving to Editor steps, setting stepIndex to 1");
      setStepIndex(1); // Move to Editor steps
    }

    if (status === 'skipped') {
      console.log("[Dashboard] Tour skipped, stopping onboarding");
      stopOnboarding();
    }
  };

  return (
    <>
      <Joyride
        key="dashboard-tour"
        steps={steps}
        run={run && stepIndex === 0}
        continuous
        showProgress
        showSkipButton
        callback={handleJoyrideCallback}
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
      <div className="space-y-6">
      <div>
        <h2 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
          {t.dashboard.title}
        </h2>
        <p className="text-base font-normal text-gray-600 dark:text-gray-400">
          {t.dashboard.subtitle}
        </p>
      </div>

      {/* Stok Alat Section */}
      <Card>
        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4 dark:border-gray-700">
          <HiCube className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.sidebar.stokAlat}
          </h3>
        </div>
        <div className="space-y-2">
          <a
            href={Urls.FIRST_SERVICE}
            className="block rounded-lg p-3 text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
            data-onboarding="editor-link"
          >
            <div className="font-medium">{t.sidebar.editor}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.dashboard.editorDescription}
            </div>
          </a>
          <a
            href={Urls.ADD_HARGA}
            className="block rounded-lg p-3 text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            <div className="font-medium">{t.sidebar.addHarga}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.dashboard.addHargaDescription}
            </div>
          </a>
        </div>
      </Card>

      {/* Rekapan Section */}
      <Card>
        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4 dark:border-gray-700">
          <HiDocumentReport className="h-6 w-6 text-purple-600 dark:text-purple-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.sidebar.rekapan}
          </h3>
        </div>
        <div className="space-y-2">
          <a
            href={Urls.GENERATE_REKAPAN}
            className="block rounded-lg p-3 text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            <div className="font-medium">{t.sidebar.generateRekapan}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.dashboard.generateRekapanDescription}
            </div>
          </a>
        </div>
      </Card>

      {/* Additional Services Section */}
      <Card>
        <div className="flex items-center gap-3 mb-4 border-b border-gray-200 pb-4 dark:border-gray-700">
          <HiCubeTransparent className="h-6 w-6 text-green-600 dark:text-green-400" />
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            {t.sidebar.additionalServices}
          </h3>
        </div>
        <div className="space-y-2">
          <a
            href={Urls.BIKIN_TAGIHAN}
            className="block rounded-lg p-3 text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            <div className="font-medium">{t.sidebar.bikinTagihan}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.dashboard.bikinTagihanDescription}
            </div>
          </a>
          <a
            href={Urls.ALL_IN_ONE}
            className="block rounded-lg p-3 text-blue-600 hover:bg-gray-100 dark:text-blue-400 dark:hover:bg-gray-700"
          >
            <div className="font-medium">{t.sidebar.allInOne}</div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {t.dashboard.allInOneDescription}
            </div>
          </a>
        </div>
      </Card>
      </div>
    </>
  );
};

const DashboardPage = () => {
  return (
    <NavbarSidebarLayout>
      <div className="px-4 pt-6">
        <Downloads />
      </div>
    </NavbarSidebarLayout>
  );
};

export default DashboardPage;
