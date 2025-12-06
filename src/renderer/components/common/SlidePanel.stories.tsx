import type { Meta, StoryObj } from "@storybook/react";
import { SlidePanel } from "./SlidePanel";

const meta: Meta<typeof SlidePanel> = {
  title: "Components/common/SlidePanel",
  component: SlidePanel,
};

export default meta;

export const Default: StoryObj<typeof SlidePanel> = {
  args: {},
};

export const Second: StoryObj<typeof SlidePanel> = {
  args: {},
  render: (args) => (
    <div className="bg-red-300 justify-end flex-col flex" style={{ width: 800, height: 800 }}>
      <SlidePanel {...args} />
    </div>
  ),
};
