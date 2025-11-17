import type { Meta, StoryObj } from "@storybook/react";
import "../../styles/index.css";
import React from "react";
import { MessageFeed } from "./MessageFeed";

const meta: Meta<typeof MessageFeed> = {
  title: "Components/chat/MessageFeed",
  component: MessageFeed,
};

export default meta;

type Story = StoryObj<typeof MessageFeed>;
const messages = [
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
    id: 2,
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
    id: 3,
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
    id: 4,
    content: "test2",
    createdAt: "2025-09-24",
    textChannelId: 10,
    updatedAt: "2025-09-16",
    user: {
      id: 10,
      username: "test",
    },
    userId: 10,
  },
  {
    id: 5,
    content: "test3",
    createdAt: "2025-09-24",
    textChannelId: 10,
    updatedAt: "2025-09-16",
    user: {
      id: 10,
      username: "test",
    },
    userId: 10,
  },
  {
    id: 6,
    content: "test3",
    createdAt: "2025-09-24",
    textChannelId: 10,
    updatedAt: "2025-09-16",
    user: {
      id: 10,
      username: "test",
    },
    userId: 10,
  },
];
export const Default: Story = {
  args: {
    messages: messages,
  },
};

export const NewMessage: Story = {
  args: {
    messages: messages,
    lastMessageReadId: 3,
  },
};

export const MessageScrollbar: Story = {
  args: {
    messages: messages,
    lastMessageReadId: 3,
  },
  render: (args) => (
    <div  style={{ width: 800, height: 600 }}>
      <MessageFeed {...args} />
    </div>
  ),
};
