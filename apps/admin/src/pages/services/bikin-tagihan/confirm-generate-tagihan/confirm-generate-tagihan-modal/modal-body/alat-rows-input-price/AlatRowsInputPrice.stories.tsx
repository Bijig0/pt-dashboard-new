import type { Meta, StoryObj } from "@storybook/react";

import { AlatRowsInputPrice } from "./AlatRowsInputPrice";

const meta = {
  component: AlatRowsInputPrice,
} satisfies Meta<typeof AlatRowsInputPrice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    alatNames: ["Alat 1", "Alat 2"],
  },
};
