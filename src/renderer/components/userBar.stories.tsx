import type { Meta, StoryObj } from "@storybook/react";
import UserBar from "./userBar";

const meta: Meta<typeof UserBar> = {
  title: "Components/UserBar",
  component: UserBar,
};

export default meta;

type Story = StoryObj<typeof UserBar>;

export const Default: Story = {
  args: {},
};
