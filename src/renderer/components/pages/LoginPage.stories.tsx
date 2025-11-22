import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { LoginPage } from "./LoginPage";

const meta: Meta<typeof LoginPage> = {
  title: "Components/pages/LoginPage",
  component: LoginPage,
};

export default meta;

type Story = StoryObj<typeof LoginPage>;
export const Default: Story = {
  args: { bannerUrl: "./main.jpg" },
};

export const InnerDiv: Story = {
  args: { bannerUrl: "./main.jpg" },
  render: (args) => <LoginPage {...args} />,
};
