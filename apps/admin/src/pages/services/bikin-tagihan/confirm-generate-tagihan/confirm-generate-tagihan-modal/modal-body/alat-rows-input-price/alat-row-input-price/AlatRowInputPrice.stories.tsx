import type { Meta, StoryObj } from "@storybook/react";

import { useForm } from "react-hook-form";
import { AlatRowInputPrice } from "./AlatRowInputPrice";

const meta = {
  component: (propsWithoutControl) => {
    const { control, setValue } = useForm();
    return (
      <AlatRowInputPrice
        {...propsWithoutControl}
        control={control}
        setValue={setValue}
      />
    );
  },
} satisfies Meta<typeof AlatRowInputPrice>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  // @ts-ignore
  args: {
    alat: {
      name: "Alat 1",
    },
    index: 0,
  },
};
