import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import { CheckBoxGroup } from "./CheckBoxGroup";
import { CheckBox } from "./CheckBox";
import { ListSelect } from "./ListSelect";
import { ListSelectItem } from "./ListSelectItem";
const meta: Meta<typeof ListSelect> = {
  title: "Components/common/ListSelect",
  component: ListSelect,
};

export default meta;

type Story = StoryObj<typeof CheckBoxGroup>;

export const Default: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 800, height: 600 }}>
      <ListSelect {...args} multiple={false}>
        <ListSelectItem>
          <div>test</div>
        </ListSelectItem>
        <ListSelectItem>
          <div>test2</div>
        </ListSelectItem>
        <ListSelectItem>
          <div>test3</div>
        </ListSelectItem>
      </ListSelect>
    </div>
  ),
};
export const MultipleSelect: Story = {
  args: {},
  render: (args) => (
    <div style={{ width: 800, height: 600 }}>
      <ListSelect {...args} multiple={false}>
        <ListSelectItem>
          <div>test</div>
        </ListSelectItem>
        <ListSelectItem>
          <div>test2</div>
        </ListSelectItem>
        <ListSelectItem>
          <div>test3</div>
        </ListSelectItem>
      </ListSelect>
    </div>
  ),
};
