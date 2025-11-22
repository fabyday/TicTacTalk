import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { VoiceVideoSettings } from "./VoiceVideoSettings";

const meta: Meta<typeof VoiceVideoSettings> = {
  title: "Components/settings/VoiceVideoSettings",
  component: VoiceVideoSettings,
};

export default meta;

type Story = StoryObj<typeof VoiceVideoSettings>;






export const Default: Story = {
  args: {
    
  }
};