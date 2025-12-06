import type { Meta, StoryObj } from "@storybook/react";
import { MainPage } from "./MainPage";

const meta: Meta<typeof MainPage> = {
  title: "Components/pages/MainPage",
  component: MainPage,
};

export default meta;

export const Default: StoryObj<typeof MainPage> = {
  args: {},
};

export const SizedMainView: StoryObj<typeof MainPage> = {
  args: {},
  render: (args) => (
    <div className="bg-amber-400 w-[1080px] h-[960px]">
      <MainPage {...args} />
    </div>
  ),
};
export const SideBarMain: StoryObj<typeof MainPage> = {
  args: {
    sidebar: (
      <div>
        <ul>
          <li className="text-gray-700 border-gray-700 mt-1 text-shadow border-2 hover:scale-110">test1</li>
          <li className="text-gray-700 border-gray-700 mt-1 text-shadow border-2 hover:scale-110">test2</li>
          <li className="text-gray-700 border-gray-700 mt-1 text-shadow border-2 hover:scale-110">test3</li>
        </ul>
      </div>
    ),
  },
  render: (args) => (
    <div className="bg-amber-400 w-[1080px] h-[960px]">
      <MainPage {...args} />
    </div>
  ),
};
