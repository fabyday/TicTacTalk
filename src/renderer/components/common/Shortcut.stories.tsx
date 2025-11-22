import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Shortcut } from "./Shortcut";

const meta: Meta<typeof Shortcut> = {
  title: "Components/common/Shortcut",
  component: Shortcut,
};

export default meta;

type Story = StoryObj<typeof Shortcut>;

export const Default: Story = {
  args: {},
    render: (args) => (
      <div  style={{ width: 800, height: 600 }}>
        <Shortcut {...args} />
      </div>
    ),
};
