import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CategoryItem } from "./Cateogory";

const meta: Meta<typeof CategoryItem> = {
  title: "Components/channel/Category",
  component: CategoryItem,
};

export default meta;

type Story = StoryObj<typeof CategoryItem>;

export const Default: Story = {
  args: {},
};

export const ChildLists: Story = {
  args: {},
};

export const Expands: Story = {
  args: {},
};

