// import React, { useEffect, useState } from "react";
// import ReactDOM from "react-dom/client";
// import MyModal from "../components/modal";
// import "../styles/index.css";
// import Sidebar from "../components/sideBar";
// import ChatView from "../components/chatView";
// import UserBar from "../components/userBar";
// import ChannelList from "../components/channelList";
// import CommunityExplorer from "../components/communityExplorer";
import { Titlebar } from "../components/titlebar";
// import LoginForm from "../components/loginForm";
// import { SettingsPage } from "./settings";
// import { apiService } from "../services/api";

import { HashRouter, Link, Route, Routes } from "react-router-dom";
import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
// interface User {
//   id: string;
//   username: string;
//   discriminator: string;
// }

// interface LoginData {
//   serverUrl: string;
//   username: string;
//   password: string;
// }

// function App() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [serverUrl, setServerUrl] = useState('');
//   const [currentPage, setCurrentPage] = useState<'main' | 'settings'>('main');
//   const [selectedCommunityId, setSelectedCommunityId] = useState<number | null>(null);
//   const [selectedChannelId, setSelectedChannelId] = useState<number | null>(null);
//   const [selectedChannelName, setSelectedChannelName] = useState<string>('');
//   const [showExplorer, setShowExplorer] = useState(false);

//   useEffect(() => {
//     // 동적으로 배경 색을 변경
//     document.body.style.backgroundColor = "#111827"; // bg-gray-900
//   }, []); // 빈 배열을 넣으면 한 번만 실행됨

//   const handleLogin = async (serverUrl: string, username: string, password: string) => {
//     try {
//       // API 서비스에서 이미 로그인이 완료되었으므로 사용자 정보만 설정
//       // 실제 API에서 받은 사용자 정보 사용
//       const profile = await apiService.getProfile();

//       setUser({
//         id: profile.userId,
//         username: profile.username,
//         discriminator: '1234' // 서버에서 discriminator를 제공하지 않으므로 기본값 사용
//       });
//       setServerUrl(serverUrl);
//       setIsLoggedIn(true);

//       // 음성 채팅 서비스 초기화
//       try {
//         await voiceChatService.connect(serverUrl);
//         console.log('🎤 음성 채팅 서비스 연결 성공');
//       } catch (voiceError) {
//         console.warn('🎤 음성 채팅 서비스 연결 실패:', voiceError);
//         // 음성 채팅 연결 실패해도 로그인은 진행
//       }

//       console.log('로그인 성공!', profile);
//     } catch (error) {
//       console.error('로그인 실패:', error);
//       throw error;
//     }
//   };

//   const handleLogout = () => {
//     // 음성 채팅 서비스 연결 해제
//     voiceChatService.disconnect();

//     // API 서비스에서 토큰 클리어
//     apiService.clearAccessToken();

//     setUser(null);
//     setServerUrl('');
//     setIsLoggedIn(false);
//     setCurrentPage('main');
//     setSelectedCommunityId(null);
//     setSelectedChannelId(null);
//     setSelectedChannelName('');
//   };

//   const handleCommunitySelect = (communityId: number) => {
//     setSelectedCommunityId(communityId);
//     setSelectedChannelId(null); // 커뮤니티 변경시 선택된 채널 초기화
//     setSelectedChannelName('');
//   };

//   const handleChannelSelect = (channelId: number, channelName: string) => {
//     setSelectedChannelId(channelId);
//     setSelectedChannelName(channelName);
//   };

//   const handleSettingsClick = () => {
//     setCurrentPage('settings');
//   };

//   const handleBackToMain = () => {
//     setCurrentPage('main');
//   };

//   const handleShowExplorer = () => {
//     setShowExplorer(true);
//   };

//   const handleBackFromExplorer = () => {
//     setShowExplorer(false);
//   };

//   const handleJoinCommunity = async (communityId: number) => {
//     setShowExplorer(false);
//     setSelectedCommunityId(communityId);
//     setSelectedChannelId(null);
//     setSelectedChannelName('');

//     // 사이드바를 새로고침하여 새로 가입한 커뮤니티를 표시
//     // 이는 Sidebar 컴포넌트에서 communities를 다시 로드해야 함을 의미
//     window.location.reload(); // 간단하게 페이지 리로드
//   };

//   const handleSelectCommunity = (communityId: number) => {
//     setShowExplorer(false);
//     setSelectedCommunityId(communityId);
//     setSelectedChannelId(null);
//     setSelectedChannelName('');
//   };

//   // 로그인되지 않은 경우 로그인 페이지 표시 (배경 이미지 포함)
//   if (!isLoggedIn) {
//     return (
//       <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
//         {/* 커스텀 타이틀바 */}
//         <Titlebar />

//         {/* 로그인 폼 */}
//         <div
//           className="flex-1 bg-cover bg-center bg-no-repeat"
//           style={{
//             backgroundImage: 'url(../../images/main.jpg)',
//             backgroundColor: '#111827'
//           }}
//         >
//           <LoginForm onLogin={handleLogin} />
//         </div>
//       </div>
//     );
//   }

//   // 설정 페이지인 경우
//   if (currentPage === 'settings') {
//     return (
//       <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
//         <Titlebar />
//         <div className="flex flex-1 overflow-hidden">
//           <SettingsPage onBackToMain={handleBackToMain} />
//         </div>
//       </div>
//     );
//   }

//   // 로그인된 경우 메인 채팅 인터페이스 표시
//   return (
//     <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
//       {/* 커스텀 타이틀바 */}
//       <Titlebar />

//       {/* 나머지 앱 구조 */}
//       <div className="flex flex-1 overflow-hidden">
//         <Sidebar
//           onCommunitySelect={handleCommunitySelect}
//           selectedCommunityId={selectedCommunityId}
//         />
//         <div className="flex flex-col flex-1 overflow-hidden">
//           <div className="flex flex-1 overflow-hidden">
//             {showExplorer ? (
//               <CommunityExplorer
//                 onBack={handleBackFromExplorer}
//                 onJoinCommunity={handleJoinCommunity}
//                 onSelectCommunity={handleSelectCommunity}
//               />
//             ) : (
//               <>
//                 <ChannelList
//                   selectedCommunityId={selectedCommunityId}
//                   onChannelSelect={handleChannelSelect}
//                   selectedChannelId={selectedChannelId}
//                   onShowExplorer={handleShowExplorer}
//                 />
//                 <ChatView selectedChannelId={selectedChannelId} />
//               </>
//             )}
//           </div>
//           <UserBar
//             onSettingsClick={handleSettingsClick}
//             user={user}
//             onLogout={handleLogout}
//           />
//         </div>
//         <MyModal open={isOpen} onClose={() => setIsOpen(false)} />
//       </div>
//     </div>
//   );
// }
import "../styles/index.css";

import { LoginPage, LoginPage2 } from "./loginPage";
import LoginForm from "../components/loginForm";

function App() {
  useEffect(() => {
    document.body.style.backgroundColor = "#111827"; // bg-gray-900
  }, []);

  return (
    <div className="w-screen h-screen flex flex-col bg-gray-900 text-white overflow-hidden">
      <Titlebar />
      <HashRouter>
        <Routes>
          <Route path="/" element={<LoginForm onLogin={(a, b, c) => {}} />} />
          <Route path="/about" element={<LoginPage2 />} />
        </Routes>
      </HashRouter>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(<App />);
