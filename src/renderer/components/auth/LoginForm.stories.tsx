// src/features/server/components/ServerCard.stories.tsx
import type { Meta, StoryObj } from "@storybook/react";
import { LoginForm } from "./LoginForm";

const meta: Meta<typeof LoginForm> = {
  title: "Components/auth/LoginForm",
  component: LoginForm,
  args: {},
};
export default meta;
type Story = StoryObj<typeof LoginForm>;

export const Default: Story = {};
