import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { SettingPage } from "./SettingPage";
import { GeneralSettings } from "../settings/GeneralSettings";
import { ShortcutSettings } from "../settings/ShortcutSettings";
import { VoiceVideoSettings } from "../settings/VoiceVideoSettings";
import { ServerListSettings } from "../settings/ServerListSettings";

const meta: Meta<typeof SettingPage> = {
  title: "Components/pages/SettingPage",
  component: SettingPage,
};

export default meta;

type Story = StoryObj<typeof SettingPage>;
const SettingViews = {
  "renderer.components.settings.GeneralSettings.Title": <GeneralSettings />,
  "renderer.components.settings.ShortcutSettings.Title": <ShortcutSettings />,
  "renderer.components.settings.VoiceVideoSettings.Title": <VoiceVideoSettings />,
  "renderer.components.settings.ServerListSettings.Title": <ServerListSettings />,
};
export const Default: Story = {
  args: {
    settingViews: SettingViews,
  },
};

export const InnerDiv: Story = {
  args: { settingViews: SettingViews },
  render: (args) => (
    <div style={{ width: 800, height: 640 }}>
      <SettingPage {...args} />
    </div>
  ),
};
