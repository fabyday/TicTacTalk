import type { Meta, StoryObj } from "@storybook/react";
import React, { useCallback, useMemo, useState } from "react";
import CommunityExplorer, {
  Community,
  CommunityExplorerProps,
} from "./CommunityExplorer";

// ---- Helpers & Mocks ----
const makeCommunities = (): Community[] => [
  {
    id: 1,
    name: "Coafe 커뮤니티",
    description: "회사 공식 커뮤니티",
    banner: "https://picsum.photos/seed/coafe/800/400",
    onlineCount: 52,
    memberCount: 384,
    objectPosition: "50% 40%",
    joined: true,
  },
  {
    id: 2,
    name: "Frontend Guild",
    description: "React · Tailwind · Design Systems",
    banner: "https://picsum.photos/seed/frontend/800/400",
    onlineCount: 21,
    memberCount: 126,
  },
  {
    id: 3,
    name: "AI Research",
    description: "LLM · RAG · Agents",
    banner: "https://picsum.photos/seed/ai/800/400",
    onlineCount: 73,
    memberCount: 902,
  },
  {
    id: 4,
    name: "Game Dev",
    description: "Unreal · Unity · Shaders",
    banner: "https://picsum.photos/seed/game/800/400",
    onlineCount: 11,
    memberCount: 80,
  },
  {
    id: 5,
    name: "Mobile Crew",
    description: "iOS · Android · Kotlin · Swift",
    banner: "https://picsum.photos/seed/mobile/800/400",
    onlineCount: 7,
    memberCount: 64,
  },
];

// Story wrapper to simulate stateful join/loading behavior inside Storybook
function StatefulExplorer(
  props: Omit<CommunityExplorerProps, "communities"> & { seed?: number }
) {
  const [data, setData] = useState<Community[]>(makeCommunities());
  const [loading, setLoading] = useState<boolean>(false);

  const onJoin = useCallback(async (id: number) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: true } : c))
    );
    setLoading(false);
  }, []);

  const onRefresh = useCallback(async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    // no change — demo only
    setLoading(false);
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-[80vh] p-4">
      <CommunityExplorer
        communities={data}
        isLoading={loading}
        onJoin={onJoin}
        onRefresh={onRefresh}
        {...props}
      />
    </div>
  );
}

const meta: Meta<typeof CommunityExplorer> = {
  title: "Community/CommunityExplorer",
  component: CommunityExplorer,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="bg-gray-900 text-white min-h-screen">
        <Story />
      </div>
    ),
  ],
};

export default meta;

type Story = StoryObj<typeof CommunityExplorer>;

export const Default: Story = {
  name: "Default (stateful demo)",
  render: () => <StatefulExplorer />,
};

export const Loading: Story = {
  name: "Loading",
  render: () => (
    <div className="bg-gray-900 text-white min-h-[60vh] p-4">
      <CommunityExplorer communities={makeCommunities()} isLoading />
    </div>
  ),
};

export const EmptyState: Story = {
  name: "Empty state",
  render: () => (
    <div className="bg-gray-900 text-white min-h-[60vh] p-4">
      <CommunityExplorer communities={[]} isLoading={false} />
    </div>
  ),
};

// Example: many items to see grid responsiveness
export const ManyItems: Story = {
  name: "Many items grid",
  render: () => {
    const many: Community[] = Array.from({ length: 16 }).map((_, i) => ({
      id: i + 1,
      name: `Community ${i + 1}`,
      description: i % 3 === 0 ? "A sample description" : undefined,
      banner: `https://picsum.photos/seed/${i + 10}/800/400`,
      onlineCount: Math.floor(Math.random() * 100),
      memberCount: 50 + Math.floor(Math.random() * 1000),
      objectPosition: "50% 50%",
      joined: i % 7 === 0,
    }));
    many.push({
      id: 200,
      name: `kawai`,
      description: "kawai community",
      banner: `main.jpg`,
      onlineCount: Math.floor(Math.random() * 100),
      memberCount: 50 + Math.floor(Math.random() * 1000),
      objectPosition: "50% 50%",
      joined: true,
    })
    many.reverse()
    return (
      <div className="bg-gray-900 text-white min-h-[80vh] p-4">
        <CommunityExplorer communities={many} />
      </div>
    );
  },
};

// If you want to demo joinedOnly or sort interactions programmatically,
// you can extend CommunityExplorer to accept controlled props. For now,
// users can toggle in the toolbar at runtime in Storybook.
