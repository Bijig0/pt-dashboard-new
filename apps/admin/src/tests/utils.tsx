import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render } from "@testing-library/react";
import { LocaleProvider } from "../context/LocaleContext";
import { OnboardingProvider } from "../context/OnboardingContext";
import { ToastProvider } from "../context/ToastContext";
import { createTestQueryClient } from "./react-query";

export const renderWithClient = (
  ui: React.ReactNode,
  existingQueryClient?: QueryClient
) => {
  const queryClient = createTestQueryClient();
  const queryClientToUse = existingQueryClient ?? queryClient;
  const wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClientToUse}>
      <LocaleProvider>
        <OnboardingProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </OnboardingProvider>
      </LocaleProvider>
    </QueryClientProvider>
  );
  return { ...render(ui, { wrapper }), queryClientToUse };
};

export const createMSWSupabaseUrl = (path: string) =>
  `${process.env["VITE_SUPABASE_URL"]}${path}`;

const companyNamesURL = createMSWSupabaseUrl("/rest/v1/company?select=name");
// const alatNamesURL = createMSWSupabaseUrl(
//   "/rest/v1/rpc/get_unique_alat_names_between_dates"
// );

const alatNamesURL =
  "https://lkxwausyseuiizopsrwi.supabase.co/rest/v1/rpc/get_unique_alat_names_between_dates";

export const worksheetDataUrl =
  "https://lkxwausyseuiizopsrwi.supabase.co/rest/v1/record";

// ?select=masuk%2Ckeluar%2Ccompany_name%2Calat_name%2Ctanggal&alat_name=eq.ASIBA+1.6M&tanggal=gte.2024-02-01T00%3A00%3A00.000Z&tanggal=lte.2024-02-29T23%3A59%3A59.999Z
