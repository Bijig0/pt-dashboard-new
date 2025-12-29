import type { Meta, StoryObj } from "@storybook/react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { _Main } from "./main";

const meta = {
  component: _Main,
  decorators: [
    (Story) => {
      return (
        <QueryClientProvider client={new QueryClient()}>
          <Story />
        </QueryClientProvider>
      );
    },
  ],
} satisfies Meta<typeof _Main>;

export default meta;

type Story = StoryObj<typeof meta>;

export const SelectedCompanyNameHasAlats: Story = {
  args: {
    selectedAlatName: "Alat 1",
    selectedCompanyName: "Company A",
    companyNames: ["Company A", "Company B"],
    alatNames: ["Alat 1", "Alat 2"],
    setUserInputAlatName: () => {},
    setUserInputCompanyName: () => {},
  },
};

export const SelectedCompanyNameHasNoAlats: Story = {
  args: {
    selectedAlatName: "Alat 1",
    selectedCompanyName: "Company A",
    companyNames: ["Company A", "Company B"],
    alatNames: [],
    setUserInputAlatName: () => {},
    setUserInputCompanyName: () => {},
  },
};


