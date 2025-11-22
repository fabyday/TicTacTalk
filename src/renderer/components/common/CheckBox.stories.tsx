import type { Meta, StoryObj } from "@storybook/react";
import React, { useState } from "react";
import { CheckBox, CheckBoxProps } from "./CheckBox";

const meta: Meta<typeof CheckBox> = {
  title: "Components/common/CheckBox",
  component: CheckBox,
};

export default meta;

type Story = StoryObj<typeof CheckBox>;

export const Default: Story = {
  args: { id: "1", label: "test" },
  render: (args : CheckBoxProps) => (
    <div style={{ width: 800, height: 600 }}>
      <CheckBox {...args} />
    </div>
  ),
};
export const BoxChecked: Story = {
  args: { id: "1", label: "test2", checked: true },
  render: (args) => (
    <div style={{ width: 800, height: 600 }}>
      <CheckBox {...args} />
    </div>
  ),
};
export const FullClickArea: Story = {
  args: { id: "1", label: "test", checked: true, fullClickArea: true },
  render: (args: CheckBoxProps) => {
    const [checked, setChecked] = useState(args.checked);

    return (
      <div style={{ width: 800, height: 600 }}>
        <CheckBox {...args} checked={args.checked} onToggle={() => setChecked(!checked)} />
      </div>
    );
  },
};
