import type { Meta, StoryObj } from "@storybook/react";
import { CommunityLists } from "./CommunityLists";
import { useState } from "react";

const meta: Meta<typeof CommunityLists> = {
  title: "Components/community/CommunityLists",
  component: CommunityLists,
};

export default meta;

export const Default: StoryObj<typeof CommunityLists> = {
  args: {
    communityItemLists: [
      { iconSrc: "main.jpg", id: "s", initials: "s", notificationCount: 2 },
      { id: "T", initials: "T" },
      { id: "Q", initials: "Q" },
      { id: "A", initials: "A" },
      { id: "B", initials: "B" },
      { id: "C", initials: "C" },
      { id: "1", initials: "1" },
      { id: "2", initials: "2" },
      { id: "3", initials: "3" },
      { id: "4", initials: "4" },
      { id: "5", initials: "5" },
      { id: "6", initials: "6" },
      { id: "7", initials: "7" },
      { id: "81", initials: "81" },
      { id: "8q", initials: "8q" },
      { id: "8w", initials: "8w" },
      { id: "8f", initials: "8f" },
      { id: "8d", initials: "8d" },
      { id: "8s", initials: "8s" },
      { id: "8aa", initials: "8aa" },
      { id: "8a", initials: "8a" },
    ],
  },
  render: (args: any) => {
    const [state, setState] = useState(args.communityItemLists);
    return (
      <div className={`bg-blue-300 overflow-scroll`} style={{ width: "700px", height: "800px" }}>
        <CommunityLists communityItemLists={state} onChanged={(a) => setState(a)} />
      </div>
    );
  },
};
export const Simple: StoryObj<typeof CommunityLists> = {
  args: {
    communityItemLists: [
      { iconSrc: "main.jpg", id: "s", initials: "s", notificationCount: 2 },
      { id: "8aa", initials: "8aa" },
      { id: "8a", initials: "8a" },
    ],
  },
  render: (args: any) => {
    const [state, setState] = useState(args.communityItemLists);
    return (
      <div className={`bg-blue-300 overflow-scroll`} style={{ width: "700px", height: "800px" }}>
        <CommunityLists communityItemLists={state} onChanged={(a) => setState(a)} />
      </div>
    );
  },
};
