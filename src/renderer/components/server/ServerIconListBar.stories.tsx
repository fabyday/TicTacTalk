import type { Meta, StoryObj } from "@storybook/react";
import { ServerIconListBar } from "./ServerIconListBar";

const meta: Meta<typeof ServerIconListBar> = {
  title: "Components/server/ServerIconListBar",
  component: ServerIconListBar,
};

export default meta;

export const Default: StoryObj<typeof ServerIconListBar> = {
  args: {},
};