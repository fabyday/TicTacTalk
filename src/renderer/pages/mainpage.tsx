import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import MyModal from "../components/modal";
import "../styles/index.css";
import Sidebar from "../components/sideBar";
import ChatView from "../components/chatView";
import UserBar from "../components/userBar";
import ChannelList from "../components/channelList";
import { Titlebar } from "../components/titlebar";

function App() {
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    // 동적으로 배경 색을 변경
    document.body.style.backgroundColor = "#111827"; // bg-gray-900
  }, []); // 빈 배열을 넣으면 한 번만 실행됨
  return (
    // <div className="w-screen h-screen flex bg-gray-900 text-white overflow-hidden">
    //   <Titlebar/>
    //   <Sidebar />
    //   <div className="flex flex-col flex-1 overflow-hidden">
    //     <div className="flex flex-1 overflow-hidden">
    //       <ChannelList />
    //       <ChatView />
    //     </div>
    //     <UserBar onSettingsClick = {() => setIsOpen(true)} />
    //   </div>
    //   {/* 모달은 일반적으로 DOM 최상위 레벨에 배치되도록 Portal이나 Transition을 사용 */}
    //   <MyModal open={isOpen} onClose={() => setIsOpen(false)} />
    // </div>
    <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      {/* 커스텀 타이틀바 */}
      <Titlebar />

      {/* 나머지 앱 구조 */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex flex-1 overflow-hidden">
            <ChannelList />
            <ChatView />
          </div>
          <UserBar onSettingsClick={() => setIsOpen(true)} />
        </div>
        <MyModal open={isOpen} onClose={() => setIsOpen(false)} />
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
