import type { Meta, StoryObj } from "@storybook/react";
import { UserBar } from "./UserBar";
import { useState } from "react";

const meta: Meta<typeof UserBar> = {
  title: "Components/user/UserBar",
  component: UserBar,
};

export default meta;

export const Default: StoryObj<typeof UserBar> = {
  args: { isMicMuted: true, imgSrc: "main.jpg", userName: "kawai kiki" },
};
export const ExpandView: StoryObj<typeof UserBar> = {
  args: { isMicMuted: true, ExpandView: true, imgSrc: "main.jpg", userName: "kawai kiki" },
};
export const DisconnectCall: StoryObj<typeof UserBar> = {
  args: { isMicMuted: true, imgSrc: "main.jpg", userName: "kawai kiki", onDisconnect: () => {} },
  render: (args) => {
    const [state, setState] = useState(false);
    return (
      <div className="flex flex-col bg-blue-400 justify-end" style={{ height: 700 }}>
        <UserBar {...args} ExpandView={state} />
        <div
          className="bg-gray-500 w-full h-16 cursor-pointer items-center flex justify-center"
          role="button"
          onClick={() => {
            setState(!state);
          }}
        >
          <p className="text-white shadow-2xs">Click ME!</p>
        </div>
      </div>
    );
  },
};
