import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import ServerCardExpandable from "./CommunityCardExpandable";
console.log("SCE typeof:", typeof ServerCardExpandable); // "function" 이 떠야 정상

const meta = {
  title: "Features/Server/ServerCardExpandable",
  component: ServerCardExpandable,
  parameters: {
    layout: "centered",
    backgrounds: { default: "dark" },
  },
  args: {
    id: 1,
    name: "Coafe Dev Lounge",
    description: "A place for developers to chat and review code.",
    banner: "main.jpg",
    onlineCount: 87,
    memberCount: 1240,
  },
} satisfies Meta<typeof ServerCardExpandable>;

export default meta;
type Story = StoryObj<typeof meta>;

/** 기본: 배너 클릭 → 카드가 커지며 모달 전환, Join 동작 포함 */
export const Default: Story = {
  render: (args) => {
    const [joined, setJoined] = React.useState(false);
    return (
      <ServerCardExpandable
        {...args}
        joined={joined}
        onJoin={async () => {
          // API 호출 대체 (로딩 시뮬)
          await new Promise((r) => setTimeout(r, 700));
          setJoined(true);
        }}
        objectPosition="50% 35%" // 원하는 크롭 포커스
      />
    );
  },
};


// export const Minimal: Story = {
//   args: {
//     id: 1,
//     name: "Coafe Dev Lounge",
//     description: "A place for developers to chat and review code.",
//     banner: "https://picsum.photos/1200/675?random=12",
//     onlineCount: 87,
//     memberCount: 1240,
//   },
//   // render 없이도 충분 (CSF3)
// };

// /** 배너 없음(회색 폴백 확인) */
// export const NoBanner: Story = {
//   args: { banner: undefined },
//   render: (args) => {
//     const [joined, setJoined] = React.useState(false);
//     return (
//       <ServerCardExpandable
//         {...args}
//         joined={joined}
//         onJoin={async () => {
//           await new Promise((r) => setTimeout(r, 400));
//           setJoined(true);
//         }}
//       />
//     );
//   },
// };

// /** 여러 카드 그리드 */
// export const Grid: Story = {
//   render: (args) => {
//     const [joined, setJoined] = React.useState(false);
//     const cards = Array.from({ length: 4 }).map((_, i) => (
//       <ServerCardExpandable
//         key={i}
//         {...args}
//         id={i + 1}
//         name={`Server ${i + 1}`}
//         banner={`https://picsum.photos/1200/675?random=${20 + i}`}
//         joined={i === 1 ? true : joined}
//         onJoin={async () => {
//           await new Promise((r) => setTimeout(r, 500));
//           setJoined(true);
//         }}
//       />
//     ));
//     return <div className="grid grid-cols-2 gap-6">{cards}</div>;
//   },
// };
