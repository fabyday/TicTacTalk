// import React, { useState, useEffect } from 'react';
// import { Users, Crown, Calendar, AlertCircle, X, Search, ArrowLeft } from 'lucide-react';
// import { apiService, PublicCommunity } from '../services/api';

// interface CommunityExplorerProps {
//   onBack: () => void;
//   onJoinCommunity: (communityId: number) => void;
//   onSelectCommunity: (communityId: number) => void; // 가입된 커뮤니티 선택 시
// }

// interface JoinConfirmModalProps {
//   isOpen: boolean;
//   community: PublicCommunity | null;
//   onClose: () => void;
//   onConfirm: () => void;
//   isJoining: boolean;
// }

// function JoinConfirmModal({ isOpen, community, onClose, onConfirm, isJoining }: JoinConfirmModalProps) {
//   if (!isOpen || !community) return null;

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center">
//       <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4 shadow-2xl">
//         <div className="flex items-center justify-between mb-4">
//           <h3 className="text-white text-xl font-bold">커뮤니티 가입</h3>
//           <button
//             onClick={onClose}
//             disabled={isJoining}
//             className="text-gray-400 hover:text-white transition-colors"
//           >
//             <X size={20} />
//           </button>
//         </div>
        
//         <div className="mb-6">
//           <div className="flex items-center space-x-3 mb-3">
//             <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
//               <span className="text-white font-bold text-lg">
//                 {community.name.charAt(0).toUpperCase()}
//               </span>
//             </div>
//             <div>
//               <h4 className="text-white font-semibold">{community.name}</h4>
//               <div className="flex items-center space-x-2 text-sm text-gray-400">
//                 <Users size={14} />
//                 <span>{community.memberCount}명</span>
//                 <Crown size={14} />
//                 <span>{community.owner.username}</span>
//               </div>
//             </div>
//           </div>
          
//           <div className="text-gray-300 text-sm">
//             <strong className="text-white">{community.name}</strong> 커뮤니티에 가입하시겠습니까?
//           </div>
//         </div>
        
//         <div className="flex justify-end space-x-3">
//           <button
//             onClick={onClose}
//             disabled={isJoining}
//             className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
//           >
//             취소
//           </button>
//           <button
//             onClick={onConfirm}
//             disabled={isJoining}
//             className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
//           >
//             {isJoining ? '가입 중...' : '가입하기'}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function CommunityExplorer({ onBack, onJoinCommunity, onSelectCommunity }: CommunityExplorerProps) {
//   const [communities, setCommunities] = useState<PublicCommunity[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedCommunity, setSelectedCommunity] = useState<PublicCommunity | null>(null);
//   const [showJoinModal, setShowJoinModal] = useState(false);
//   const [isJoining, setIsJoining] = useState(false);

//   useEffect(() => {
//     loadPublicCommunities();
//   }, []);

//   const loadPublicCommunities = async () => {
//     try {
//       setLoading(true);
//       setError(null);
//       const allCommunities = await apiService.getAllCommunitiesWithMembership();
//       setCommunities(allCommunities);
//     } catch (error) {
//       console.error('커뮤니티 조회 실패:', error);
//       setError('커뮤니티를 불러오는데 실패했습니다.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleCommunityClick = (community: PublicCommunity) => {
//     if (community.isJoined) {
//       // 이미 가입된 커뮤니티는 바로 선택
//       onSelectCommunity(community.id);
//     } else {
//       // 가입되지 않은 커뮤니티는 가입 모달 표시
//       setSelectedCommunity(community);
//       setShowJoinModal(true);
//     }
//   };

//   const handleJoinConfirm = async () => {
//     if (!selectedCommunity) return;

//     try {
//       setIsJoining(true);
//       const result = await apiService.joinCommunity(selectedCommunity.id);
      
//       if (result.success) {
//         setShowJoinModal(false);
//         onJoinCommunity(selectedCommunity.id);
//       } else {
//         alert(result.message || '가입에 실패했습니다.');
//       }
//     } catch (error) {
//       console.error('커뮤니티 가입 실패:', error);
//       alert('가입에 실패했습니다.');
//     } finally {
//       setIsJoining(false);
//     }
//   };

//   const filteredCommunities = communities.filter(community =>
//     community.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     community.owner.username.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   return (
//     <>
//       <div className="flex-1 bg-gray-700 flex flex-col">
//         {/* 헤더 */}
//         <div className="bg-gray-800 p-4 border-b border-gray-600">
//           <div className="flex items-center justify-between">
//             <div className="flex items-center space-x-3">
//               <button
//                 onClick={onBack}
//                 className="text-gray-400 hover:text-white transition-colors"
//                 title="뒤로 가기"
//               >
//                 <ArrowLeft size={20} />
//               </button>
//               <div className="flex items-center space-x-2">
//                 <Search size={20} className="text-blue-400" />
//                 <h2 className="text-white font-semibold">커뮤니티 탐색</h2>
//                 <span className="text-xs bg-gray-700 px-2 py-1 rounded">
//                   {filteredCommunities.filter(c => c.isJoined).length}개 가입됨
//                 </span>
//               </div>
//             </div>
//             <button
//               onClick={loadPublicCommunities}
//               disabled={loading}
//               className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
//               title="새로고침"
//             >
//               <Search size={16} />
//             </button>
//           </div>
          
//           {/* 검색바 */}
//           <div className="mt-3">
//             <div className="relative">
//               <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
//                 <Search className="h-5 w-5 text-gray-400" />
//               </div>
//               <input
//                 type="text"
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 placeholder="커뮤니티 또는 소유자 검색..."
//                 className="w-full pl-10 pr-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//           </div>
//         </div>

//         {/* 컨텐츠 */}
//         <div className="flex-1 p-4 overflow-y-auto">
//           {loading ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="text-center text-gray-400">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
//                 <div>커뮤니티를 불러오는 중...</div>
//               </div>
//             </div>
//           ) : error ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="text-center text-red-400">
//                 <AlertCircle size={48} className="mx-auto mb-2" />
//                 <div>{error}</div>
//                 <button
//                   onClick={loadPublicCommunities}
//                   className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
//                 >
//                   다시 시도
//                 </button>
//               </div>
//             </div>
//           ) : filteredCommunities.length === 0 ? (
//             <div className="flex items-center justify-center h-64">
//               <div className="text-center text-gray-400">
//                 <Search size={48} className="mx-auto mb-2" />
//                 <div>
//                   {searchTerm ? 
//                     `"${searchTerm}"에 대한 검색 결과가 없습니다.` :
//                     '가입 가능한 커뮤니티가 없습니다.'
//                   }
//                 </div>
//               </div>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
//               {filteredCommunities.map((community) => (
//                 <div
//                   key={community.id}
//                   onClick={() => handleCommunityClick(community)}
//                   className={`rounded-lg p-4 transition-colors cursor-pointer border-2 group ${
//                     community.isJoined 
//                       ? 'bg-green-900/50 border-green-500 hover:bg-green-800/50 hover:border-green-400' 
//                       : 'bg-gray-800 border-transparent hover:bg-gray-750 hover:border-blue-500'
//                   }`}
//                 >
//                   {/* 커뮤니티 아이콘 */}
//                   <div className="flex items-center space-x-3 mb-3">
//                     <div className={`w-16 h-16 rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform ${
//                       community.isJoined 
//                         ? 'bg-gradient-to-br from-green-500 to-emerald-600' 
//                         : 'bg-gradient-to-br from-blue-500 to-purple-600'
//                     }`}>
//                       {community.name.charAt(0).toUpperCase()}
//                     </div>
//                     <div className="flex-1">
//                       <div className="flex items-center space-x-2">
//                         <h3 className="text-white font-semibold text-lg truncate">
//                           {community.name}
//                         </h3>
//                         {community.isJoined && (
//                           <span className="bg-green-500 text-white text-xs px-2 py-1 rounded-full font-medium">
//                             가입됨
//                           </span>
//                         )}
//                       </div>
//                       <div className="flex items-center space-x-2 text-sm text-gray-400">
//                         <Users size={14} />
//                         <span>{community.memberCount}명</span>
//                       </div>
//                     </div>
//                   </div>
                  
//                   {/* 소유자 정보 */}
//                   <div className="flex items-center justify-between text-sm">
//                     <div className="flex items-center space-x-2 text-gray-400">
//                       <Crown size={14} className="text-yellow-400" />
//                       <span>{community.owner.username}</span>
//                     </div>
//                     <div className="flex items-center space-x-1 text-gray-500">
//                       <Calendar size={12} />
//                       <span>{new Date(community.createdAt).toLocaleDateString()}</span>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>

//       <JoinConfirmModal
//         isOpen={showJoinModal}
//         community={selectedCommunity}
//         onClose={() => {
//           setShowJoinModal(false);
//           setSelectedCommunity(null);
//         }}
//         onConfirm={handleJoinConfirm}
//         isJoining={isJoining}
//       />
//     </>
//   );
// } 