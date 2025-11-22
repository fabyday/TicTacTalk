import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ShortcutSettings } from "./ShortcutSettings";

const meta: Meta<typeof ShortcutSettings> = {
  title: "Components/settings/ShortcutSettings",
  component: ShortcutSettings,
};

export default meta;

type Story = StoryObj<typeof ShortcutSettings>;






export const Default: Story = {
  args: {
    
  }
};