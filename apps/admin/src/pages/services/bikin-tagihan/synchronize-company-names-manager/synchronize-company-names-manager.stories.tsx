import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fromPartial } from "@total-typescript/shoehorn";
import { ToastProvider } from "../../../../context/ToastContext";
import * as UseGetCompanyNamesModule from "../../../../hooks/useGetCompanyNames";
import { _SynchronizeCompanyNamesManager } from "./synchronize-company-names-manager";

const useGetCompanyNames = fn(UseGetCompanyNamesModule.useGetCompanyNames);
useGetCompanyNames.mockReturnValue(
  fromPartial({
    data: ["Company A", "Company B", "Company C", "Company D"],
    isLoading: false,
    error: null,
  })
);

const meta = {
  decorators: [
    (Story) => (
      <ToastProvider>
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      </ToastProvider>
    ),
  ],

  component: _SynchronizeCompanyNamesManager,
} satisfies Meta<typeof _SynchronizeCompanyNamesManager>;

export default meta;

type Story = StoryObj<typeof meta>;

export const AllExcelCompanyNamesMissing: Story = {
  args: {
    excelFileCompanyNames: ["Company A", "Company B", "Company C"],
    databaseCompanyNames: [],
  },
};

export const AllPresentCompanyNames: Story = {
  args: {
    excelFileCompanyNames: ["Company A", "Company B", "Company C"],
    databaseCompanyNames: ["Company A", "Company B", "Company C"],
  },
};

export const SomeExcelCompanyNamesNotInDatabase: Story = {
  args: {
    excelFileCompanyNames: ["Company A", "Company B", "Company C"],
    databaseCompanyNames: ["Company A", "Company B", "Company D"],
  },
};
