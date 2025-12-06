import React from "react";
import { UserBar } from "../user/UserBar";
import { CommunityLists } from "../community/CommunityLists";

export interface PagesMainPageProps {
  ServerLists: React.ReactNode; // must Have Items
  useBadge: React.ReactNode;
  sidebar?: React.ReactNode;
  mainView?: React.ReactNode;
}

// This is Skeleton for Apps
export function MainPage({ mainView, sidebar, ServerLists }: PagesMainPageProps) {
  return (
    <div className="h-full  flex">
      {/* ServerList View */}
      <div className=" p-2 bg-red-400">
        <CommunityLists communityItemLists={[{ id: "1", iconSrc: "main.jpg" }, { id: "2" }]} />
      </div>

      {/* SideView Cond rendering */}
      {sidebar && (
        <div className="flex flex-col justify-between">
          <div
            className="overflow-auto w-64 bg-green-400
      pb-20"
          >
            {sidebar}
          </div>
          <div className="">
            {<UserBar userName={"kawaii kiki"} userId="asd" imgSrc="main.jpg" roomPath="test/fa" />}
          </div>
        </div>
      )}
      {/* MainView */}
      <div className="flex-1 bg-gray-700">{mainView ?? undefined}</div>
      {/* Right Panel  ex) Friends panel or Server Member panel*/}
      <div className="w-32 bg-amber-900"></div>
    </div>
  );
}
