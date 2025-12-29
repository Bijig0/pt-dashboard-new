import type { Meta, StoryObj } from "@storybook/react";

import ConfirmAddStokAlatModal from "./confirm-add-stok-alat-modal";
import { ToastProvider } from "#src/context/ToastContext.js";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";

const meta = {
  component: ConfirmAddStokAlatModal,
  decorators: [
    (Story) => (
      <ToastProvider>
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof ConfirmAddStokAlatModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    show: true,
    stokAlat: [
      {
        tanggal: "01/01/2023",
        company_name: "Company A",
        masuk: 10,
        keluar: 0,
        alat_name: "Alat 1",
      },
    ],
    allowedCompanyNames: ["Company A"],
  },
};
