import React, { useMemo, useState } from "react";
import ServerCardExpandable, {
  ServerCardExpandableProps,
} from "./CommunityCardExpandable";

// ---- Types ----
export type Community = {
  id: number;
  name: string;
  description?: string;
  banner?: string | File | Blob | URL | null | undefined; // ImageLike
  onlineCount: number;
  memberCount: number;
  objectPosition?: string; // e.g. "50% 30%"
  joined?: boolean;
};

export type CommunityExplorerProps = {
  communities: Community[];
  isLoading?: boolean;
  onJoin?: (id: number) => Promise<void> | void;
  onRefresh?: () => Promise<void> | void;
  className?: string;
};

// ---- Helpers ----
function imageLikeToSrc(input: Community["banner"]): string | undefined {
  if (!input) return undefined;
  if (typeof input === "string") return input;
  if (input instanceof URL) return input.toString();
  try {
    // File | Blob
    return URL.createObjectURL(input as Blob);
  } catch {
    return undefined;
  }
}

// ---- UI Bits ----
const Toolbar = ({
  query,
  setQuery,
  sortBy,
  setSortBy,
  joinedOnly,
  setJoinedOnly,
  onRefresh,
}: {
  query: string;
  setQuery: (v: string) => void;
  sortBy: "relevance" | "online" | "members" | "name";
  setSortBy: (v: "relevance" | "online" | "members" | "name") => void;
  joinedOnly: boolean;
  setJoinedOnly: (b: boolean) => void;
  onRefresh?: () => Promise<void> | void;
}) => (
  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between p-3">
    <div className="flex items-center gap-2 w-full md:w-auto">
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search communities..."
        className="flex-1 md:w-80 px-3 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
      />
      {onRefresh && (
        <button
          onClick={() => onRefresh()}
          className="px-3 py-2 rounded-xl bg-gray-800 hover:bg-gray-700 border border-gray-700 text-sm"
          title="Refresh"
        >
          ⟳
        </button>
      )}
    </div>
    <div className="flex items-center gap-2">
      <label className="text-sm text-gray-300">Sort</label>
      <select
        value={sortBy}
        onChange={(e) => setSortBy(e.target.value as any)}
        className="px-3 py-2 rounded-xl bg-gray-800/80 border border-gray-700 text-sm"
      >
        <option value="relevance">Relevance</option>
        <option value="online">Online</option>
        <option value="members">Members</option>
        <option value="name">Name</option>
      </select>
      <label className="ml-3 inline-flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={joinedOnly}
          onChange={(e) => setJoinedOnly(e.target.checked)}
          className="accent-indigo-500"
        />
        Joined only
      </label>
    </div>
  </div>
);

const SkeletonCard = () => (
  <div className="h-40 rounded-2xl bg-gray-800/60 border border-gray-700 animate-pulse" />
);

// ---- Main Component ----
export default function CommunityExplorer({
  communities,
  isLoading,
  onJoin,
  onRefresh,
  className = "",
}: CommunityExplorerProps) {
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<
    "relevance" | "online" | "members" | "name"
  >("relevance");
  const [joinedOnly, setJoinedOnly] = useState(false);
  const [joiningId, setJoiningId] = useState<number | null>(null);
  const [joinedIds, setJoinedIds] = useState<Set<number>>(new Set());

  // prime joined state from incoming data once
  React.useEffect(() => {
    const s = new Set<number>();
    communities.forEach((c) => c.joined && s.add(c.id));
    setJoinedIds(s);
  }, [communities]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = communities.filter((c) => {
      if (joinedOnly && !(c.joined || joinedIds.has(c.id))) return false;
      if (!q) return true;
      const hay = `${c.name} ${c.description ?? ""}`.toLowerCase();
      return hay.includes(q);
    });

    if (sortBy === "online")
      list = [...list].sort((a, b) => b.onlineCount - a.onlineCount);
    else if (sortBy === "members")
      list = [...list].sort((a, b) => b.memberCount - a.memberCount);
    else if (sortBy === "name")
      list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    // relevance = natural order (could be server-provided)

    return list;
  }, [communities, joinedOnly, query, sortBy, joinedIds]);

  const handleJoin = async (c: Community) => {
    if (!onJoin) return;
    try {
      setJoiningId(c.id);
      await onJoin(c.id);
      setJoinedIds((prev) => new Set(prev).add(c.id));
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      <Toolbar
        query={query}
        setQuery={setQuery}
        sortBy={sortBy}
        setSortBy={setSortBy}
        joinedOnly={joinedOnly}
        setJoinedOnly={setJoinedOnly}
        onRefresh={onRefresh}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4 p-3">
        {isLoading ? (
          Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
        ) : filtered.length === 0 ? (
          <div className="col-span-full text-center text-gray-400 py-16 border border-dashed border-gray-700 rounded-2xl">
            No communities found.
          </div>
        ) : (
          filtered.map((c) => {
            const banner = imageLikeToSrc(c.banner);
            const joined = c.joined || joinedIds.has(c.id);
            const joining = joiningId === c.id;

            const cardProps: ServerCardExpandableProps = {
              id: c.id,
              name: c.name,
              description: c.description,
              banner,
              onlineCount: c.onlineCount,
              memberCount: c.memberCount,
              objectPosition: c.objectPosition ?? "50% 50%",
              joined,
              joining,
              onJoin: onJoin
                ? async () => {
                    if (!joined) await handleJoin(c);
                  }
                : undefined,
              className:
                "hover:shadow-lg hover:shadow-black/20 transition-shadow duration-200",
            };

            return <ServerCardExpandable key={c.id} {...cardProps} />;
          })
        )}
      </div>
    </div>
  );
}

// ---- Demo (optional): Remove if you wire real data) ----
// You can delete the demo below. It's just here to visualize quickly.
export function CommunityExplorerDemo() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<Community[]>([
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
  ]);

  const handleJoin = async (id: number) => {
    // fake delay
    setLoading(true);
    await new Promise((r) => setTimeout(r, 700));
    setData((prev) =>
      prev.map((c) => (c.id === id ? { ...c, joined: true } : c))
    );
    setLoading(false);
  };

  return (
    <div className="p-4 bg-gray-900 text-white min-h-screen">
      <CommunityExplorer
        communities={data}
        isLoading={loading}
        onJoin={handleJoin}
        onRefresh={async () => {
          setLoading(true);
          await new Promise((r) => setTimeout(r, 500));
          setLoading(false);
        }}
      />
    </div>
  );
}
