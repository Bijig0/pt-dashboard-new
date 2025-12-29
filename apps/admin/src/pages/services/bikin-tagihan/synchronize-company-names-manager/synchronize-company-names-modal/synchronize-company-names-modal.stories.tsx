import type { Meta, StoryObj } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastProvider } from "../../../../../context/ToastContext";
import { SynchronizeCompanyNamesModal } from "./synchronize-company-names-modal";

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
  component: SynchronizeCompanyNamesModal,
} satisfies Meta<typeof SynchronizeCompanyNamesModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    companyNamesToSynchronize: ["Company A", "Company B"],
    closeModal: () => {},
    openModal: () => {},
  },
};

export const LongList: Story = {
  args: {
    isOpen: true,
    companyNamesToSynchronize: [
      "Company A",
      "Company B",
      "Company C",
      "Company D",
      "Company E",
      "Company F",
      "Company G",
      "Company H",
      "Company I",
      "Company J",
      "Company K",
      "Company L",
      "Company M",
      "Company N",
      "Company O",
      "Company P",
      "Company Q",
      "Company R",
      "Company S",
      "Company T",
      "Company U",
      "Company V",
      "Company W",
      "Company X",
      "Company Y",
      "Company Z",
    ],
    closeModal: () => {},
    openModal: () => {},
  },
};
