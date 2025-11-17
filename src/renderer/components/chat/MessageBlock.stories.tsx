import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { MessageBlock } from "./MessageBlock";

const meta: Meta<typeof MessageBlock> = {
  title: "Components/chat/MessageBlock",
  component: MessageBlock,
};

export default meta;

type Story = StoryObj<typeof MessageBlock>;






export const Default: Story = {
  args: {
    data: {
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
  },
};

export const MultiMessage: Story = {
  args: {
    data: [
      {
        id: 1,
        content: "test message Ah-Ah-",
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
        id: 2,
        content: "hey my name is faby",
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
