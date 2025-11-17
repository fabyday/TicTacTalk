import { CommunityIcon } from "./CommunityIcon";
import type { Meta, StoryObj } from "@storybook/react";
import React from "react";

const meta: Meta<typeof CommunityIcon> = {
  title: "Components/CommunityIcon",
  component: CommunityIcon,
  parameters: {
    layout: "centered",
    controls: { expanded: true },
    docs: {
      description: {
        component:
          "작은(sm)/중간(md) 크기와 알림 배지를 지원하는 커뮤니티 아이콘. 작은 크기에서는 호버 시 흰색 외곽선이 표시됩니다.",
      },
    },
  },
  argTypes: {
    size: {
      control: { type: "radio" },
      options: ["sm", "md"],
    },
    notificationCount: {
      control: { type: "number", min: 0, max: 999 },
    },
    iconSrc: { control: "text" },
    initials: { control: "text" },
    onClick: { action: "clicked" },
  },
  args: {
    size: "sm",
    initials: "CO",
    notificationCount: 0,
  },
};
export default meta;

type Story = StoryObj<typeof CommunityIcon>;

export const SmallDefault: Story = {
  name: "작은 아이콘 (기본)",
  args: {
    size: "sm",
    initials: "CO",
    notificationCount: 0,
    iconSrc: "main.jpg",
  },
  parameters: {
    docs: {
      description: { story: "알림이 없을 때 배지는 렌더되지 않습니다." },
    },
  },
};

export const SmallWithBadge: Story = {
  name: "작은 + 배지(3)",
  args: { size: "sm", initials: "CO", notificationCount: 3 },
};

export const MediumDefault: Story = {
  name: "중간 아이콘 (기본)",
  args: { size: "md", initials: "CA", notificationCount: 0 },
};

export const MediumWithLargeBadge: Story = {
  name: "중간 + 큰 배지(120 → 99+)",
  args: { size: "md", initials: "CA", notificationCount: 120 },
  parameters: {
    docs: { description: { story: "100 이상은 '99+'로 축약 표기됩니다." } },
  },
};

export const WithImageIcon: Story = {
  name: "이미지 아이콘",
  args: {
    size: "md",
    iconSrc: "main.jpg",
    initials: undefined,
    notificationCount: 5,
  },
};

export const WithWidgetNode: Story = {
  name: "위젯(노드)",
  args: {
    size: "md",
    initials: "WG",
    notificationCount: 2,
    widget: (
      <span className="text-xs px-2 py-1 rounded-full border bg-white">
        위젯
      </span>
    ),
  },
};

export const WithWidgetBySize: Story = {
  name: "위젯(크기별 렌더러)",
  args: {
    size: "sm",
    initials: "FX",
    widget: (s: "sm" | "md") => (
      <span className="text-xs px-2 py-1 rounded-full border bg-white">
        {s === "sm" ? "툴팁" : "메뉴"}
      </span>
    ),
  },
};
