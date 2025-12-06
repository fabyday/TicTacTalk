import type { Meta, StoryObj } from "@storybook/react";
import { TestBoy } from "./TestBoy";

const meta: Meta<typeof TestBoy> = {
  title: "Components/common/TestBoy",
  component: TestBoy,
};

export default meta;

export const Default: StoryObj<typeof TestBoy> = {
  args: {},
};