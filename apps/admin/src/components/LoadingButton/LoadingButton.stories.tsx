import type { Meta, StoryObj } from "@storybook/react";

import LoadingButton from "./LoadingButton";

// @ts-ignore
const metaData = {
  component: LoadingButton,
} satisfies Meta<typeof LoadingButton>;

export default metaData;

type Story = StoryObj<typeof metaData>;

export const Still: Story = {
  args: {
    isLoading: false,
    children: "Submit",
    color: "primary",
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    children: "Submit",
  },
};
