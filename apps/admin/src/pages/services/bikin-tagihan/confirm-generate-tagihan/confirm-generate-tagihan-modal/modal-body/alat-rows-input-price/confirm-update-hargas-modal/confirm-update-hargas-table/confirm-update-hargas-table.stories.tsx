import type { Meta, StoryObj } from "@storybook/react";

import { ConfirmModalTable } from "./confirm-update-hargas-table";

const meta = {
  component: ConfirmModalTable,
} satisfies Meta<typeof ConfirmModalTable>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alatData: [],
  },
};
