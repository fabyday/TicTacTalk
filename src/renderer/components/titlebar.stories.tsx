import type { Meta, StoryObj } from "@storybook/react";
import { Titlebar } from "./titlebar";

const meta: Meta<typeof Titlebar> = {
  title: "Components/Titlebar",
  component: Titlebar,
};

export default meta;

type Story = StoryObj<typeof Titlebar>;

export const Default: Story = {
  args: {
    selectedChannelId: 10,
    selectedChannelName: "asd",
  },
};
