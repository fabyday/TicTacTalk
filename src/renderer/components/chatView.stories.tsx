import type { Meta, StoryObj } from "@storybook/react";
import ChatUI from "./chatView";
import "../styles/index.css";
import React from "react";

const meta: Meta<typeof ChatUI> = {
  title: "Components/ChatView",
  component: ChatUI,
};

export default meta;

type Story = StoryObj<typeof ChatUI>;
const messagesEndRef = React.useRef<HTMLDivElement | null>(null);

export const Default: Story = {
  args: {
    channelName: "string",
    messages: [],
    loading: false,
    sending: false,
    onSend: (a) => undefined,
    onReload: () => undefined,
    messagesEndRef: messagesEndRef,
  },
};
