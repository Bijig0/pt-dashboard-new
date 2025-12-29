import type { Meta, StoryObj } from "@storybook/react";

import useGetHargaAlat from "#useGetHargaAlat";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fromPartial } from "@total-typescript/shoehorn";
import { HargaAlat } from "./harga-alat";

const meta = {
  component: HargaAlat,
  decorators: [
    (Story) => (
      <QueryClientProvider client={new QueryClient()}>
        <Story />
      </QueryClientProvider>
    ),
  ],
} satisfies Meta<typeof HargaAlat>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  async beforeEach() {
    // @ts-ignore
    useGetHargaAlat.mockReturnValue(
      fromPartial({
        data: [
          {
            name: "Alat 1",
            harga_bulanan: 100,
            harga_harian: 3.33,
          },
        ],
        isLoading: false,
        error: null,
      })
    );
  },
  args: {
    selectedAlatName: "Alat 1",
    selectedCompanyName: "Company 1",
  },
};
