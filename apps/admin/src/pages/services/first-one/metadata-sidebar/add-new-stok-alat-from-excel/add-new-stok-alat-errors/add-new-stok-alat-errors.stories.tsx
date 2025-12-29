import type { Meta, StoryObj } from "@storybook/react";

import AddNewStokAlatErrors from "./add-new-stok-alat-errors";

const meta = {
  component: AddNewStokAlatErrors,
} satisfies Meta<typeof AddNewStokAlatErrors>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errors: [
      {
        worksheetName: "Sheet1",
        rowNumber: 2,
        errorMessage: "Company name is not allowed",
      },
    ],
    show: true,
  },
};
