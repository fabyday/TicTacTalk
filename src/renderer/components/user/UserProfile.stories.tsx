import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { UserProfile } from "./UserProfile";

const meta: Meta<typeof UserProfile> = {
  title: "user/UserProfile",
  component: UserProfile,
};
export default meta;

type Story = StoryObj<typeof UserProfile>;

export const Default: Story = {
  name: "프로필",
  args: {
    userName: "kawaii kiki",
    description: "kawai App AI",
    userId: 10000,
    imgSrc: "main.jpg",
  },
  parameters: {
    docs: {
      description: { story: "알림이 없을 때 배지는 렌더되지 않습니다." },
    },
  },
};

