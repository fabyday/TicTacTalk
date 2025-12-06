import { useLocation } from "react-router-dom";

export function LayoutRouter() {
  const location = useLocation();

  // 🎯 경로에 따라 다른 sidebar 지정
  let sidebarComponent: React.ReactNode;

  if (location.pathname.startsWith("/chat")) {
    sidebarComponent = <ChannelSidebar />;
  } else if (location.pathname.startsWith("/friends")) {
    sidebarComponent = <FriendSidebar />;
  } else if (location.pathname.startsWith("/settings")) {
    sidebarComponent = undefined; // ✅ settings는 sidebar 없음
  } else {
    sidebarComponent = <ChannelSidebar />; // 기본값
  }

  return (
    <MainPage
      ServerLists={<ServerListView />} // 고정
      sidebar={sidebarComponent} // ✅ 조건부 교체
      mainView={
        <Routes>
          <Route path="/chat/:channelId" element={<ChatView />} />
          <Route path="/friends/*" element={<div>friends</div>} />
          <Route path="/settings/*" element={<SettingPage />} />
          <Route path="/" element={<div>Welcome</div>} />
        </Routes>
      }
    />
  );
}
