import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ServerListSettings } from "./ServerListSettings";

const meta: Meta<typeof ServerListSettings> = {
  title: "Components/settings/ServerListSettings",
  component: ServerListSettings,
};

export default meta;

type Story = StoryObj<typeof ServerListSettings>;






export const Default: Story = {
  args: {
    
  }
};