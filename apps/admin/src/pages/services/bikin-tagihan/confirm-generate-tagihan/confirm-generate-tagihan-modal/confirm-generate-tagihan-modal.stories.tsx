import type { Meta, StoryObj } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { _ConfirmGenerateTagihanModal } from "./confirm-generate-tagihan-modal";

const storybookQueryClient = new QueryClient();

const meta = {
  component: _ConfirmGenerateTagihanModal,
  decorators: [
    (Story) => (
      <QueryClientProvider client={storybookQueryClient}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof _ConfirmGenerateTagihanModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const MissingAlats: Story = {
  args: {
    selectedCompanyName: "Company A",
    worksheetData: [
      {
        tanggal: "2023-01-15",
        "Alat 1": 10,
        "Alat 2": 20,
      },
    ],
    alatData: [
      {
        name: "Alat 1",
        harga_bulanan: 100,
        harga_harian: 3.33,
      },
    ],
  },
};
export const AllAlatsPresent: Story = {
  args: {
    selectedCompanyName: "Company A",
    worksheetData: [
      {
        tanggal: "2023-01-15",
        "Alat 1": 10,
        "Alat 2": 20,
      },
    ],
    alatData: [
      {
        name: "Alat 1",
        harga_bulanan: 100,
        harga_harian: 3.33,
      },
      {
        name: "Alat 2",
        harga_bulanan: 200,
        harga_harian: 6.67,
      },
    ],
  },
};
