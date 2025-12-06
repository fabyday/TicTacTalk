import UserCard from "./UserCard";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { UserBadge } from "./UserBadge";

const meta: Meta<typeof UserBadge> = {
  title: "Components/user/UserBadge",
  component: UserBadge,
};
export default meta;

type Story = StoryObj<typeof UserBadge>;
export interface UserBadgeProps {
  userId: string;
  userName: string;
  prefix?: string;
  description?: string;

  imgSrc?: string;
}
export const Default: Story = {
  name: "작은 아이콘 (기본)",
  args: {
    userId: "test",
    userName: "kawaii kiki",
    description: "kawai App AI",
    prefix: "I'm good",
    imgSrc: "main.jpg",
  },
  parameters: {
    docs: {
      description: { story: "알림이 없을 때 배지는 렌더되지 않습니다." },
    },
  },
};
