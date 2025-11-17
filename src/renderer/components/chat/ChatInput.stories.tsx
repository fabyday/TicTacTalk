import type { Meta, StoryObj } from "@storybook/react";
import "../../styles/index.css";
import React from "react";
import { ChatInput } from "./ChatInput";

const meta: Meta<typeof ChatInput> = {
  title: "Components/chat/ChatInput",
  component: ChatInput,
};

export default meta;

type Story = StoryObj<typeof ChatInput>;

export const Default: Story = {
  args: {},
};
