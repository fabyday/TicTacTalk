import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { ChannelItem } from "./ChannelItem";

const meta: Meta<typeof ChannelItem> = {
  title: "Components/channel/channelItem",
  component: ChannelItem,
};

export default meta;

type Story = StoryObj<typeof ChannelItem>;

export const Default: Story = {
  args: {},
};

export const CategoryType: Story = {
  args: {
    itemType: "category",
    authorized: true,
  },
};

export const VoiceType: Story = {
  args: {
    itemType: "voice",
    authorized: true,
  },
};

export const ChatType: Story = {
  args: {
    itemType: "chat",
    authorized: true,
  },
};
