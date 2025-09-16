import React, { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { apiService, Membership } from '../services/api';

interface SidebarProps {
  onCommunitySelect: (communityId: number) => void;
  selectedCommunityId: number | null;
}

interface CreateCommunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCommunityCreated: () => void;
}

function CreateCommunityModal({ isOpen, onClose, onCommunityCreated }: CreateCommunityModalProps) {
  const [communityName, setCommunityName] = useState('');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!communityName.trim() || creating) return;

    try {
      setCreating(true);
      await apiService.createCommunity({ name: communityName.trim() });
      setCommunityName('');
      onCommunityCreated();
      onClose();
    } catch (error) {
      console.error('커뮤니티 생성 실패:', error);
      alert('커뮤니티 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setCommunityName('');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-white text-xl font-bold mb-4">새 커뮤니티 만들기</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              커뮤니티 이름
            </label>
            <input
              type="text"
              value={communityName}
              onChange={(e) => setCommunityName(e.target.value)}
              placeholder="커뮤니티 이름을 입력하세요"
              className="w-full px-3 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={creating}
              autoFocus
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={creating}
              className="px-4 py-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!communityName.trim() || creating}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:bg-gray-600 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? '생성 중...' : '생성하기'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function Sidebar({ onCommunitySelect, selectedCommunityId }: SidebarProps) {
  const [communities, setCommunities] = useState<Membership[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadCommunities();
  }, []);

  const loadCommunities = async () => {
    try {
      setLoading(true);
      console.log('🔄 커뮤니티 목록 로드 시작...');
      const userCommunities = await apiService.getUserCommunities();
      console.log('✅ 커뮤니티 목록 로드 성공:', userCommunities);
      setCommunities(userCommunities);
      
      // 첫 번째 커뮤니티를 자동 선택
      if (userCommunities.length > 0) {
        console.log('🎯 첫 번째 커뮤니티 자동 선택:', userCommunities[0].community.id);
        onCommunitySelect(userCommunities[0].community.id);
      } else {
        console.log('📭 가입된 커뮤니티가 없습니다');
      }
    } catch (error) {
      console.error('❌ 커뮤니티 로드 실패:', error);
      // 더 자세한 에러 정보 출력
      if (error instanceof Error) {
        console.error('에러 메시지:', error.message);
        console.error('에러 스택:', error.stack);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCommunityClick = (communityId: number) => {
    onCommunitySelect(communityId);
  };

  const handleCommunityCreated = () => {
    loadCommunities(); // 커뮤니티 목록 새로고침
  };

  const handleDebug = async () => {
    try {
      console.log('🔍 디버그 시작...');
      const debugData = await apiService.debugGetAllData();
      console.log('🔍 디버그 결과:', debugData);
      alert(`디버그 정보:\n사용자 ID: ${debugData.userId}\n모든 커뮤니티: ${debugData.allCommunities.length}개\n모든 멤버십: ${debugData.allMemberships.length}개\n사용자 멤버십: ${debugData.userMemberships.length}개`);
    } catch (error) {
      console.error('디버그 실패:', error);
      alert('디버그 실패: ' + error);
    }
  };

  if (loading) {
    return (
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse" />
        <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse" />
        <div className="w-12 h-12 bg-gray-600 rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <>
      <div className="w-16 bg-gray-800 flex flex-col items-center py-4 space-y-4">
        {/* 커뮤니티 목록 */}
        {communities.length === 0 ? (
          <div className="text-center text-gray-400 text-xs px-2">
            커뮤니티 없음
          </div>
        ) : (
          communities.map((membership) => {
            const community = membership.community;
            const isSelected = selectedCommunityId === community.id;
            
            return (
              <div
                key={community.id}
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer transition-all duration-200 ${
                  isSelected 
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300' 
                    : 'bg-gray-600 text-gray-200 hover:bg-gray-500'
                }`}
                onClick={() => handleCommunityClick(community.id)}
                title={community.name}
              >
                {community.name.charAt(0).toUpperCase()}
              </div>
            );
          })
        )}
        
        {/* 구분선 */}
        {communities.length > 0 && (
          <div className="w-8 h-px bg-gray-600"></div>
        )}
        
        {/* 커뮤니티 생성 버튼 */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="w-12 h-12 rounded-full bg-gray-700 hover:bg-green-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200"
          title="새 커뮤니티 만들기"
        >
          <Plus size={20} />
        </button>

        {/* 디버그 버튼 (임시) */}
        <button
          onClick={handleDebug}
          className="w-12 h-12 rounded-full bg-red-700 hover:bg-red-600 text-gray-300 hover:text-white flex items-center justify-center transition-all duration-200 text-xs"
          title="디버그 정보"
        >
          🔍
        </button>
      </div>
      
      {/* 커뮤니티 생성 모달 */}
      <CreateCommunityModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCommunityCreated={handleCommunityCreated}
      />
    </>
  );
}