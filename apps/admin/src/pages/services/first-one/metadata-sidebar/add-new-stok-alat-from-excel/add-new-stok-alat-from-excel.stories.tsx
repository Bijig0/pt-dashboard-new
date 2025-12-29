import type { Meta, StoryObj } from "@storybook/react";

import { ToastProvider } from "#src/context/ToastContext.js";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import dayjs from "dayjs";
import AddNewStokAlatFromExcel from "./add-new-stok-alat-from-excel";

const meta = {
  component: AddNewStokAlatFromExcel,
  decorators: [
    (Story) => (
      <ToastProvider>
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      </ToastProvider>
    ),
  ],
} satisfies Meta<typeof AddNewStokAlatFromExcel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDate: dayjs("2023-01-31"),
    isStokAlatPreviouslyFilled: true,
  },
};
