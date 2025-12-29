import type { Meta, StoryObj } from "@storybook/react";

import { getHarianHargaSewa } from "#getHarianHargaSewa";
import { Modal } from "flowbite-react";
import { ModalBody } from "./modal-body";

const meta = {
  component: ModalBody,
  decorators: [
    (Story) => (
      <Modal show>
        <Story />
      </Modal>
    ),
  ],
} satisfies Meta<typeof ModalBody>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  async beforeEach() {
    getHarianHargaSewa.mockReturnValue(10);
  },
  args: {
    items: [
      {
        name: "Alat 1",
        status: "missing",
      },
      {
        name: "Alat 2",
        status: "missing",
      },
      {
        name: "Alat 3",
        status: "missing",
      },
      {
        name: "Alat 4",
        status: "missing",
      },
    ],
    itemsPerPage: 2,
  },
};
