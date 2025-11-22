import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ToggleSwitch } from "./ToggleSwitch";

const meta: Meta<typeof ToggleSwitch> = {
  title: "Components/common/ToggleSwitch",
  component: ToggleSwitch,
};

export default meta;

type Story = StoryObj<typeof ToggleSwitch>;

export const Default: Story = {
  args: {},
    render: (args) => (
      <div  style={{ width: 800, height: 600 }}>
        <ToggleSwitch {...args} />
      </div>
    ),
};
