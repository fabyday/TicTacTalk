import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Slider } from "./Slider";

const meta: Meta<typeof Slider> = {
  title: "Components/common/Slider",
  component: Slider,
};

export default meta;

type Story = StoryObj<typeof Slider>;

export const Default: Story = {
  args: {},
};

export const Second: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 800, height: 600 }}>
      <Slider {...args} />
    </div>
  ),
};
