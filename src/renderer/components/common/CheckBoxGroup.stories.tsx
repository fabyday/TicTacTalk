import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CheckBoxGroup } from "./CheckBoxGroup";
import { CheckBox } from "./CheckBox";
const meta: Meta<typeof CheckBoxGroup> = {
  title: "Components/common/CheckBoxGroup",
  component: CheckBoxGroup,
};

export default meta;

type Story = StoryObj<typeof CheckBoxGroup>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 800, height: 600 }}>
      <CheckBoxGroup {...args} multiple={false}>
        <CheckBox id={"test1"} label="test1"></CheckBox>
        <CheckBox id={"test2"} label="test2"></CheckBox>
        <CheckBox id={"test3"} label="test3"></CheckBox>
        <CheckBox id={"test4"} label="test4"></CheckBox>
      </CheckBoxGroup>
    </div>
  ),
};
export const MultipleSelect: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 800, height: 600 }}>
      <CheckBoxGroup {...args}>
        <CheckBox id={"test1"} label="test1"></CheckBox>
        <CheckBox id={"test2"} label="test2"></CheckBox>
        <CheckBox id={"test3"} label="test3"></CheckBox>
        <CheckBox id={"test4"} label="test4"></CheckBox>
      </CheckBoxGroup>
    </div>
  ),
};
