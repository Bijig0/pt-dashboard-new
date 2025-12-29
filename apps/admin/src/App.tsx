import { QueryClientProvider } from "@tanstack/react-query";
import { type FC } from "react";
import { Navigate, Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ProtectedRoute from "./ProtectedRoute";
import FlowbiteWrapper from "./components/flowbite-wrapper";
import DashboardPage from "./pages";
import SignInPage from "./pages/authentication/sign-in";
import SignUpPage from "./pages/authentication/sign-up";
import NotFoundPage from "./pages/pages/404";
import ServerErrorPage from "./pages/pages/500";
import UserListPage from "./pages/users/list";
import UserProfilePage from "./pages/users/profile";
import UserSettingsPage from "./pages/users/settings";
import { queryClient } from "./react-query";

import "react-toastify/dist/ReactToastify.css";
import { LocaleProvider } from "./context/LocaleContext";
import { OnboardingProvider } from "./context/OnboardingContext";
import { ToastProvider } from "./context/ToastContext";
import ErrorScreen from "./pages/admin/ErrorScreen";
import AddHarga from "./pages/services/add-harga/add-harga";
import AllInOne from "./pages/services/all-in-one/all-in-one";
import BikinTagihan from "./pages/services/bikin-tagihan/bikin-tagihan";
import FirstOne from "./pages/services/first-one/first-one";
import GenerateRekapan from "./pages/services/generate-rekapan/generate-rekapan";
import DashboardElements from "./pages/services/dashboard-elements/dashboard-elements";
import CompanyCleanup from "./pages/services/company-cleanup/company-cleanup";

// Error fallback component wrapper for react-error-boundary
const ErrorFallback = ({ error, resetErrorBoundary }: { error: Error; resetErrorBoundary: () => void }) => {
  return <ErrorScreen error={error} resetError={resetErrorBoundary} />;
};

export enum Urls {
  ROOT = "/",
  SIGN_IN = "/authentication/sign-in",
  CONTACT_ADMIN = "/authentication/contact-admin",
  FIRST_SERVICE = "/services/first-one",
  BIKIN_TAGIHAN = "/services/bikin-tagihan",
  ADD_HARGA = "/services/add-harga",
  ALL_IN_ONE = "/services/all-in-one",
  GENERATE_REKAPAN = "/services/generate-rekapan",
  DASHBOARD_ELEMENTS = "/services/dashboard-elements",
  COMPANY_CLEANUP = "/services/company-cleanup",
  NOT_FOUND = "/pages/404",
  SERVER_ERROR = "/pages/500",
  USER_LIST = "/users/list",
  USER_PROFILE = "/users/profile",
  USER_SETTINGS = "/users/settings",
}

const App: FC = function () {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback} onReset={() => window.location.reload()}>
      <QueryClientProvider client={queryClient}>
        <LocaleProvider>
          <OnboardingProvider>
            <ToastProvider>
              <BrowserRouter>
            <Routes>
              <Route element={<FlowbiteWrapper />}>
                <Route path={Urls.SIGN_IN} element={<SignInPage />} />
                <Route path={Urls.CONTACT_ADMIN} element={<SignUpPage />} />

                <Route
                  element={
                    // @ts-ignore
                    <ProtectedRoute />
                  }
                >
                  <Route path={Urls.ROOT} element={<DashboardPage />} index />
                  <Route path={Urls.FIRST_SERVICE} element={<FirstOne />} />
                  <Route path={Urls.BIKIN_TAGIHAN} element={<BikinTagihan />} />
                  <Route path={Urls.ADD_HARGA} element={<AddHarga />} />
                  <Route path={Urls.ALL_IN_ONE} element={<AllInOne />} />
                  <Route
                    path={Urls.GENERATE_REKAPAN}
                    element={<GenerateRekapan />}
                  />
                  <Route
                    path={Urls.DASHBOARD_ELEMENTS}
                    element={<DashboardElements />}
                  />
                  <Route
                    path={Urls.COMPANY_CLEANUP}
                    element={<CompanyCleanup />}
                  />

                  <Route path="/pages/404" element={<NotFoundPage />} />
                  <Route path="/pages/500" element={<ServerErrorPage />} />
                  <Route path="/users/list" element={<UserListPage />} />
                  <Route path="/users/profile" element={<UserProfilePage />} />
                  <Route
                    path="/users/settings"
                    element={<UserSettingsPage />}
                  />
                </Route>

                <Route
                  path="*"
                  element={<Navigate to="/authentication/sign-in" />}
                />
              </Route>
            </Routes>
              </BrowserRouter>
            </ToastProvider>
          </OnboardingProvider>
        </LocaleProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
