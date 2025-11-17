import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GuideLine } from "./GuideLine";

const meta: Meta<typeof GuideLine> = {
  title: "Components/chat/GuideLine",
  component: GuideLine,
};

export default meta;

type Story = StoryObj<typeof GuideLine>;






export const Default: Story = {
  args: {
  }
};
export const GuideText: Story = {
  args: {
    guideText : "2019-32-32"
  }
};
export const GuideTextColored: Story = {
  args: {
    guideText : "2019-32-32",
    lineColor : "blue",
    textColor : "red"
  }
};
