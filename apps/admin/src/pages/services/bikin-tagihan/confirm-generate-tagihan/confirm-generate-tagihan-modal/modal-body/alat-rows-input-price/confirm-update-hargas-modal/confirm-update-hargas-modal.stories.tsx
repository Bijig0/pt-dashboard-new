import type { Meta, StoryObj } from "@storybook/react";
import { ConfirmUpdateHargasModal } from "./confirm-update-hargas-modal";

const meta = {
  component: ConfirmUpdateHargasModal,
} satisfies Meta<typeof ConfirmUpdateHargasModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SmallList: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    alatData: [
      {
        alatName: "Alat 1",
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        alatName: "Alat 2",
        hargaBulanan: 200,
        hargaHarian: 6.67,
      },
    ],
  },
};

export const LargeList: Story = {
  args: {
    isOpen: true,
    onClose: () => {},
    alatData: [
      {
        alatName: "Alat 1",
        hargaBulanan: 100,
        hargaHarian: 3.33,
      },
      {
        alatName: "Alat 2",
        hargaBulanan: 200,
        hargaHarian: 6.67,
      },
      {
        alatName: "Alat 3",
        hargaBulanan: 300,
        hargaHarian: 10,
      },
      {
        alatName: "Alat 4",
        hargaBulanan: 400,
        hargaHarian: 15,
      },
      {
        alatName: "Alat 5",
        hargaBulanan: 500,
        hargaHarian: 20,
      },
      {
        alatName: "Alat 6",
        hargaBulanan: 600,
        hargaHarian: 25,
      },
      {
        alatName: "Alat 7",
        hargaBulanan: 700,
        hargaHarian: 30,
      },
      {
        alatName: "Alat 8",
        hargaBulanan: 800,
        hargaHarian: 35,
      },
      {
        alatName: "Alat 9",
        hargaBulanan: 900,
        hargaHarian: 40,
      },
      {
        alatName: "Alat 10",
        hargaBulanan: 1000,
        hargaHarian: 45,
      },
    ],
  },
};
