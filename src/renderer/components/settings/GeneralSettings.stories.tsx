import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { GeneralSettings } from "./GeneralSettings";

const meta: Meta<typeof GeneralSettings> = {
  title: "Components/settings/GeneralSettings",
  component: GeneralSettings,
};

export default meta;

type Story = StoryObj<typeof GeneralSettings>;






export const Default: Story = {
  args: {
    
  }
};