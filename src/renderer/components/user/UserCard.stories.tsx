import UserCard from "./UserCard";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof UserCard> = {
  title: "user/UserCard",
  component: UserCard,
};
export default meta;

type Story = StoryObj<typeof UserCard>;

export const Default: Story = {
  name: "작은 아이콘 (기본)",
  args: {
    userName: "kawaii kiki",
    description: "kawai App AI",
    userId: 10000,
  },
  parameters: {
    docs: {
      description: { story: "알림이 없을 때 배지는 렌더되지 않습니다." },
    },
  },
};

export const BtnCallbacks: Story = {
  name: "button profile",
  args: {
    userName: "kawaii kiki",
    description: "kawai App AI",

    userId: 10000,
    callbacks: {
      AddFriendBtnClicked: () => {},
      CollapseBtnClicked: () => {},
      DmBtnClicked: () => {},
    },
  },
};
