import type { Meta, StoryObj } from "@storybook/react";
import "../../styles/index.css";
import React from "react";
import { ChatInput } from "./ChatInput";
import { ChatView } from "./ChatView";

const meta: Meta<typeof ChatView> = {
  title: "Components/chat/ChatView",
  component: ChatView,
};

export default meta;

type Story = StoryObj<typeof ChatView>;

export const Default: Story = {
  args: {
    messages: [
      {
        id: 1,
        content: "test",
        createdAt: "2025-09-16",
        textChannelId: 10,
        updatedAt: "2025-09-16",
        user: {
          id: 10,
          username: "test",
        },
        userId: 10,
      },
      {
        id: 1,
        content: "test",
        createdAt: "2025-09-16",
        textChannelId: 10,
        updatedAt: "2025-09-16",
        user: {
          id: 10,
          username: "test",
        },
        userId: 10,
      },
      {
        id: 1,
        content: "test3",
        createdAt: "2025-09-16",
        textChannelId: 10,
        updatedAt: "2025-09-16",
        user: {
          id: 10,
          username: "test",
        },
        userId: 10,
      },
      {
        id: 1,
        content: "test2",
        createdAt: "2025-09-16",
        textChannelId: 10,
        updatedAt: "2025-09-16",
        user: {
          id: 10,
          username: "test",
        },
        userId: 10,
      },
    ],
  },
};


export const Second: Story = {
  args: {
    messages: [],
  },
};
