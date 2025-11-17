// src/features/server/components/ServerCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { CommunityCard } from "./CommunityCard";

const meta: Meta<typeof CommunityCard> = {
  title: "Features/community/CommunityCard",
  component: CommunityCard,
  args: {
    name: "Coafe Dev Lounge",
    description: "A place for developers to chat and review code.",
    onlineCount: 87,
    memberCount: 1240,
  },
};
export default meta;
type Story = StoryObj<typeof CommunityCard>;

export const Default: Story = {
  args: { banner: "./main.jpg" },
};
export const WithOutBanner: Story = {};
