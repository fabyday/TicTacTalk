import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { Pannel } from "./Pannel";

const meta: Meta<typeof Pannel> = {
  title: "Components/common/Pannel",
  component: Pannel,
};

export default meta;

type Story = StoryObj<typeof Pannel>;






export const Default: Story = {
  args: {
    title:"하잇",
    children : <div><p className="bg-amber-50">test2</p></div>
  }
};