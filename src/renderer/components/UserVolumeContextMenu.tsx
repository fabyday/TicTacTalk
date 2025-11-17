// import React, { useEffect, useRef, useState } from 'react';
// import { Volume2, VolumeX, RotateCcw } from 'lucide-react';
// import { useUserVolumeStore } from '../stores/userVolumeStore';
// import { sfuVoiceChatService } from '../services/sfuVoiceChat';

// interface UserVolumeContextMenuProps {
//   userId: number;
//   username: string;
//   position: { x: number; y: number };
//   onClose: () => void;
//   isVisible: boolean;
// }

// export default function UserVolumeContextMenu({
//   userId,
//   username,
//   position,
//   onClose,
//   isVisible
// }: UserVolumeContextMenuProps) {
//   const menuRef = useRef<HTMLDivElement>(null);
//   const sliderRef = useRef<HTMLInputElement>(null);
//   const [isDragging, setIsDragging] = useState(false);
  
//   const { getUserVolume, setUserVolume, resetUserVolume, defaultVolume } = useUserVolumeStore();
//   const currentVolume = getUserVolume(userId);

//   // 클릭 외부 감지
//   useEffect(() => {
//     const handleClickOutside = (event: MouseEvent) => {
//       if (menuRef.current && !menuRef.current.contains(event.target as Node) && !isDragging) {
//         onClose();
//       }
//     };

//     const handleEscape = (event: KeyboardEvent) => {
//       if (event.key === 'Escape') {
//         onClose();
//       }
//     };

//     if (isVisible) {
//       document.addEventListener('mousedown', handleClickOutside);
//       document.addEventListener('keydown', handleEscape);
//     }

//     return () => {
//       document.removeEventListener('mousedown', handleClickOutside);
//       document.removeEventListener('keydown', handleEscape);
//     };
//   }, [isVisible, onClose, isDragging]);

//   // 메뉴 위치 조정 (화면 밖으로 나가지 않도록)
//   const getMenuStyle = () => {
//     if (!menuRef.current) return { left: position.x, top: position.y };
    
//     const menuRect = menuRef.current.getBoundingClientRect();
//     const windowWidth = window.innerWidth;
//     const windowHeight = window.innerHeight;
    
//     let left = position.x;
//     let top = position.y;
    
//     // 오른쪽으로 나가면 왼쪽으로 이동
//     if (left + menuRect.width > windowWidth) {
//       left = position.x - menuRect.width;
//     }
    
//     // 아래로 나가면 위로 이동
//     if (top + menuRect.height > windowHeight) {
//       top = position.y - menuRect.height;
//     }
    
//     return { left, top };
//   };

//   const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const volume = parseInt(event.target.value);
//     setUserVolume(userId, volume);
//     // 실시간 볼륨 업데이트
//     sfuVoiceChatService.updateUserVolume(userId, volume);
//   };

//   const handleMute = () => {
//     setUserVolume(userId, 0);
//     // 실시간 볼륨 업데이트
//     sfuVoiceChatService.updateUserVolume(userId, 0);
//   };

//   const handleUnmute = () => {
//     setUserVolume(userId, defaultVolume);
//     // 실시간 볼륨 업데이트
//     sfuVoiceChatService.updateUserVolume(userId, defaultVolume);
//   };

//   const handleReset = () => {
//     resetUserVolume(userId);
//     // 실시간 볼륨 업데이트 (기본값 적용)
//     sfuVoiceChatService.updateUserVolume(userId, defaultVolume);
//   };

//   const handleSliderMouseDown = () => {
//     setIsDragging(true);
//   };

//   const handleSliderMouseUp = () => {
//     setIsDragging(false);
//   };

//   const handleSliderMouseLeave = () => {
//     setTimeout(() => setIsDragging(false), 100);
//   };

//   if (!isVisible) return null;

//   const menuStyle = getMenuStyle();

//   return (
//     <div
//       ref={menuRef}
//       className="fixed z-50 bg-gray-800 border border-gray-600 rounded-lg shadow-lg p-3 min-w-[200px]"
//       style={{ 
//         left: menuStyle.left, 
//         top: menuStyle.top,
//         userSelect: 'none'
//       }}
//       onClick={(e) => e.stopPropagation()}
//     >
//       {/* 사용자 정보 */}
//       <div className="mb-3 pb-2 border-b border-gray-600">
//         <div className="text-white font-medium text-sm">{username}</div>
//         <div className="text-gray-400 text-xs">사용자 볼륨 조절</div>
//       </div>

//       {/* 볼륨 컨트롤 */}
//       <div className="space-y-3">
//         {/* 볼륨 표시 */}
//         <div className="flex items-center justify-between">
//           <div className="flex items-center space-x-2">
//             {currentVolume === 0 ? (
//               <VolumeX size={16} className="text-red-400" />
//             ) : (
//               <Volume2 size={16} className="text-blue-400" />
//             )}
//             <span className="text-sm text-gray-300">볼륨</span>
//           </div>
//           <span className="text-sm font-mono text-white">{currentVolume}%</span>
//         </div>

//         {/* 볼륨 슬라이더 */}
//         <div className="px-1">
//           <input
//             ref={sliderRef}
//             type="range"
//             min="0"
//             max="100"
//             value={currentVolume}
//             onChange={handleVolumeChange}
//             onMouseDown={handleSliderMouseDown}
//             onMouseUp={handleSliderMouseUp}
//             onMouseLeave={handleSliderMouseLeave}
//             className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer volume-slider"
//             style={{
//               background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${currentVolume}%, #4b5563 ${currentVolume}%, #4b5563 100%)`
//             }}
//           />
//         </div>

//         {/* 빠른 액션 버튼 */}
//         <div className="grid grid-cols-3 gap-1">
//           <button
//             onClick={handleMute}
//             className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded transition-colors"
//             title="음소거"
//           >
//             음소거
//           </button>
//           <button
//             onClick={handleUnmute}
//             className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded transition-colors"
//             title="음소거 해제"
//           >
//             해제
//           </button>
//           <button
//             onClick={handleReset}
//             className="px-2 py-1 bg-gray-600 hover:bg-gray-700 text-white text-xs rounded transition-colors flex items-center justify-center"
//             title="기본값으로 리셋"
//           >
//             <RotateCcw size={12} />
//           </button>
//         </div>

//         {/* 볼륨 프리셋 */}
//         <div className="grid grid-cols-4 gap-1">
//           {[25, 50, 75, 100].map((volume) => (
//             <button
//               key={volume}
//               onClick={() => {
//                 setUserVolume(userId, volume);
//                 // 실시간 볼륨 업데이트
//                 sfuVoiceChatService.updateUserVolume(userId, volume);
//               }}
//               className={`px-2 py-1 text-xs rounded transition-colors ${
//                 currentVolume === volume
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-600 hover:bg-gray-500 text-gray-300'
//               }`}
//             >
//               {volume}%
//             </button>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// } 