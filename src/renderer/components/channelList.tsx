import { useState, useEffect } from 'react';
import { Hash, Plus, Volume2, Volume1, VolumeX, Mic, MicOff, Users, User, Bug, Code, Search } from 'lucide-react';
import { apiService, TextChannel, VoiceChannel, CreateChannelRequest } from '../services/api';
import { sfuVoiceChatService } from '../services/sfuVoiceChat';
import { useUserVolumeStore } from '../stores/userVolumeStore';
import UserVolumeContextMenu from './UserVolumeContextMenu';
import clsx from 'clsx';

interface VoiceChannelParticipant {
  userId: number;
  username: string;
}

interface VoiceChannelWithParticipants extends VoiceChannel {
  participants?: VoiceChannelParticipant[];
}

interface ChannelListProps {
  selectedCommunityId: number | null;
  onChannelSelect: (channelId: number, channelName: string) => void;
  selectedChannelId: number | null;
  onShowExplorer: () => void;
}

interface CreateChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  communityId: number;
  onChannelCreated: () => void;
}

function CreateChannelModal({ isOpen, onClose, communityId, onChannelCreated }: CreateChannelModalProps) {
  const [channelName, setChannelName] = useState('');
  const [channelType, setChannelType] = useState<'text' | 'voice'>('text');
  const [creating, setCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!channelName.trim() || creating) return;

    try {
      setCreating(true);
      const channelData: CreateChannelRequest = {
        name: channelName.trim(),
        communityId: communityId,
        type: channelType,
      };

      await apiService.createChannel(channelData);
      setChannelName('');
      setChannelType('text');
      onChannelCreated();
      onClose();
    } catch (error) {
      console.error('채널 생성 실패:', error);
      alert('채널 생성에 실패했습니다.');
    } finally {
      setCreating(false);
    }
  };

  const handleClose = () => {
    if (!creating) {
      setChannelName('');
      setChannelType('text');
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-gray-800 rounded-lg p-6 w-96 max-w-md mx-4">
        <h2 className="text-white text-xl font-bold mb-4">새 채널 만들기</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              채널 타입
            </label>
            <div className="flex space-x-4 mb-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="text"
                  checked={channelType === 'text'}
                  onChange={(e) => setChannelType(e.target.value as 'text' | 'voice')}
                  className="mr-2"
                />
                <Hash size={16} className="mr-1" />
                <span className="text-gray-300">텍스트 채널</span>
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="voice"
                  checked={channelType === 'voice'}
                  onChange={(e) => setChannelType(e.target.value as 'text' | 'voice')}
                  className="mr-2"
                />
                <Volume2 size={16} className="mr-1" />
                <span className="text-gray-300">음성 채널</span>
              </label>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-gray-300 text-sm font-medium mb-2">
              채널 이름
            </label>
            <input
              type="text"
              value={channelName}
              onChange={(e) => setChannelName(e.target.value)}
              placeholder={`${channelType === 'text' ? '텍스트' : '음성'} 채널 이름을 입력하세요`}
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
              disabled={!channelName.trim() || creating}
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

export default function ChannelList({ 
  selectedCommunityId, 
  onChannelSelect, 
  selectedChannelId,
  onShowExplorer
}: ChannelListProps) {
  const [textChannels, setTextChannels] = useState<TextChannel[]>([]);
  const [voiceChannels, setVoiceChannels] = useState<VoiceChannelWithParticipants[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentVoiceChannelId, setCurrentVoiceChannelId] = useState<number | null>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [voiceConnected, setVoiceConnected] = useState(false);
  
  // 🎤 음성 활동 상태 추적
  const [voiceActivityStatus, setVoiceActivityStatus] = useState<Map<number, boolean>>(new Map());
  
  // 컨텍스트 메뉴 상태
  const [contextMenu, setContextMenu] = useState<{
    isVisible: boolean;
    userId: number;
    username: string;
    position: { x: number; y: number };
  }>({
    isVisible: false,
    userId: 0,
    username: '',
    position: { x: 0, y: 0 }
  });

  const { getUserVolume } = useUserVolumeStore();

  useEffect(() => {
    if (selectedCommunityId) {
      loadChannels();
      setupVoiceChat();
    } else {
      setTextChannels([]);
      setVoiceChannels([]);
    }
  }, [selectedCommunityId]);

  const setupVoiceChat = async () => {
    try {
      if (!sfuVoiceChatService.isConnected()) {
        // 서버 URL을 가져와서 연결 (실제로는 설정에서 가져와야 함)
        const serverUrl = 'http://localhost:3000'; // 임시
        await sfuVoiceChatService.connect(serverUrl);
        setVoiceConnected(true);
      }

      // 채널 업데이트 리스너 등록
      sfuVoiceChatService.onChannelUpdate((data) => {
        setVoiceChannels(prev => 
          prev.map(channel => 
            channel.id === data.channelId 
              ? { 
                  ...channel, 
                  participantCount: data.participantCount,
                  participants: data.participants || channel.participants 
                }
              : channel
          )
        );
      });

      // 🎤 음성 활동 리스너 등록
      sfuVoiceChatService.onVoiceActivity((activityData) => {
        setVoiceActivityStatus(prev => {
          const newMap = new Map(prev);
          newMap.set(activityData.userId, activityData.isActive);
          return newMap;
        });
        
        // 디버깅용 로그 (선택사항)
        // console.log(`🎤 음성 활동: 사용자 ${activityData.userId} ${activityData.isActive ? '말하는 중' : '조용함'}`);
      });

    } catch (error) {
      console.error('음성 채팅 설정 실패:', error);
    }
  };

  const loadChannels = async () => {
    if (!selectedCommunityId) return;

    try {
      setLoading(true);
      
      // 텍스트 채널과 보이스 채널을 병렬로 로드
      const [textChannelData, voiceChannelData] = await Promise.all([
        apiService.getChannelsByCommunity(selectedCommunityId),
        apiService.getVoiceChannelsByCommunity(selectedCommunityId)
      ]);
      
      setTextChannels(textChannelData);
      setVoiceChannels(voiceChannelData);
      
      // 첫 번째 텍스트 채널을 자동 선택
      if (textChannelData.length > 0) {
        onChannelSelect(textChannelData[0].id, textChannelData[0].name);
      }
    } catch (error) {
      console.error('채널 로드 실패:', error);
      setTextChannels([]);
      setVoiceChannels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTextChannelClick = (channelId: number, channelName: string) => {
    onChannelSelect(channelId, channelName);
  };

  const handleVoiceChannelClick = async (channelId: number, communityId: number) => {
    if (currentVoiceChannelId === channelId) {
      // 같은 채널을 클릭하면 나가기
      await sfuVoiceChatService.leaveVoiceChannel();
      setCurrentVoiceChannelId(null);
    } else {
      // 다른 채널에 참가
      try {
        const success = await sfuVoiceChatService.joinVoiceChannel(channelId, communityId);
        if (success) {
          setCurrentVoiceChannelId(channelId);
        }
      } catch (error) {
        console.error('음성 채널 참가 실패:', error);
        alert('음성 채널에 참가할 수 없습니다. 마이크 권한을 확인해주세요.');
      }
    }
  };

  const toggleMute = () => {
    const newMuteState = sfuVoiceChatService.toggleMute();
    setIsMuted(newMuteState);
  };

  const handleChannelCreated = () => {
    loadChannels(); // 채널 목록 새로고침
  };

  // 참가자 우클릭 이벤트 핸들러
  const handleParticipantRightClick = (
    event: React.MouseEvent,
    participant: VoiceChannelParticipant
  ) => {
    event.preventDefault();
    event.stopPropagation();
    
    setContextMenu({
      isVisible: true,
      userId: participant.userId,
      username: participant.username,
      position: { x: event.clientX, y: event.clientY }
    });
  };

  // 컨텍스트 메뉴 닫기
  const handleCloseContextMenu = () => {
    setContextMenu(prev => ({ ...prev, isVisible: false }));
  };

  if (!selectedCommunityId) {
    return (
      <div className="w-48 bg-gray-800 p-2">
        <div className="text-gray-400 text-sm text-center py-4">
          커뮤니티를 선택하세요
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-48 bg-gray-800 p-2">
        <div className="space-y-4">
          <div>
            <h2 className="text-gray-300 text-sm font-bold mb-2 px-2">TEXT CHANNELS</h2>
            <div className="space-y-1">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="px-2 py-1">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h2 className="text-gray-300 text-sm font-bold mb-2 px-2">VOICE CHANNELS</h2>
            <div className="space-y-1">
              {[...Array(2)].map((_, i) => (
                <div key={i} className="px-2 py-1">
                  <div className="h-4 bg-gray-700 rounded animate-pulse"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="w-48 bg-gray-800 p-2 space-y-4">
        {/* 텍스트 채널 섹션 */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-gray-300 text-sm font-bold">TEXT CHANNELS</h2>
            <button
              onClick={() => setShowCreateModal(true)}
              className="text-gray-400 hover:text-white p-1 rounded transition-colors"
              title="새 채널 만들기"
            >
              <Plus size={16} />
            </button>
          </div>
          
          {textChannels.length === 0 ? (
            <div className="text-gray-400 text-sm px-2 py-1">
              텍스트 채널이 없습니다
            </div>
          ) : (
            textChannels.map((channel) => (
              <button
                key={channel.id}
                onClick={() => handleTextChannelClick(channel.id, channel.name)}
                className={clsx(
                  'w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition-all flex items-center space-x-1',
                  selectedChannelId === channel.id 
                    ? 'bg-gray-700 text-white font-semibold' 
                    : 'text-gray-400'
                )}
              >
                <Hash size={14} />
                <span>{channel.name}</span>
              </button>
            ))
          )}
        </div>

        {/* 음성 채널 섹션 */}
        <div>
          <div className="flex items-center justify-between px-2 mb-2">
            <h2 className="text-gray-300 text-sm font-bold">VOICE CHANNELS</h2>
          </div>
          
          {voiceChannels.length === 0 ? (
            <div className="text-gray-400 text-sm px-2 py-1">
              음성 채널이 없습니다
            </div>
          ) : (
            voiceChannels.map((channel) => (
              <div key={channel.id} className="mb-2">
                <button
                  onClick={() => handleVoiceChannelClick(channel.id, selectedCommunityId!)}
                  className={clsx(
                    'w-full text-left px-2 py-1 rounded hover:bg-gray-700 transition-all',
                    currentVoiceChannelId === channel.id 
                      ? 'bg-green-600 text-white font-semibold' 
                      : 'text-gray-400'
                  )}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Volume2 size={14} />
                      <span>{channel.name}</span>
                    </div>
                    
                    {channel.participantCount > 0 && (
                      <div className="flex items-center space-x-1 text-xs">
                        <Users size={12} />
                        <span>{channel.participantCount}</span>
                      </div>
                    )}
                  </div>
                </button>
                
                {/* 참가자 목록 표시 */}
                {channel.participants && channel.participants.length > 0 && (
                  <div className="ml-4 mt-1 space-y-1">
                    {channel.participants.map((participant) => {
                      const userVolume = getUserVolume(participant.userId);
                      return (
                        <div 
                          key={participant.userId}
                          className={clsx(
                            "flex items-center justify-between px-2 py-1 text-xs hover:bg-gray-700 rounded cursor-pointer transition-all duration-200",
                            voiceActivityStatus.get(participant.userId) 
                              ? "bg-green-800 text-green-200 border-l-2 border-green-400" 
                              : "text-gray-400"
                          )}
                          onContextMenu={(e) => handleParticipantRightClick(e, participant)}
                          title={`${participant.username} - 볼륨: ${userVolume}% (우클릭으로 조절) ${voiceActivityStatus.get(participant.userId) ? '🎤 말하는 중' : ''}`}
                        >
                          <div className="flex items-center space-x-2">
                            <div className="relative">
                              <User 
                                size={12} 
                                className={clsx(
                                  "transition-colors duration-200",
                                  voiceActivityStatus.get(participant.userId) 
                                    ? "text-green-300" 
                                    : "text-green-400"
                                )} 
                              />
                              {/* 🎤 음성 활동 표시 - 마이크 아이콘 오버레이 */}
                              {voiceActivityStatus.get(participant.userId) && (
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full flex items-center justify-center animate-pulse">
                                  <Mic size={6} className="text-green-900" />
                                </div>
                              )}
                            </div>
                            <span className={clsx(
                              "transition-colors duration-200",
                              voiceActivityStatus.get(participant.userId) ? "font-medium" : ""
                            )}>
                              {participant.username}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            {userVolume === 0 ? (
                              <VolumeX size={10} className="text-red-400" />
                            ) : userVolume < 50 ? (
                              <Volume1 size={10} className="text-yellow-400" />
                            ) : (
                              <Volume2 size={10} className="text-blue-400" />
                            )}
                            <span className="text-xs font-mono text-gray-500">{userVolume}%</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 음성 컨트롤 */}
        {currentVoiceChannelId && (
          <div className="border-t border-gray-700 pt-2">
            <div className="text-gray-300 text-xs mb-2 px-2">음성 연결됨</div>
            <div className="flex justify-center space-x-2">
              <button
                onClick={toggleMute}
                className={clsx(
                  'p-2 rounded transition-colors',
                  isMuted 
                    ? 'bg-red-600 text-white' 
                    : 'bg-gray-600 text-gray-300 hover:bg-gray-500'
                )}
                title={isMuted ? '음소거 해제' : '음소거'}
              >
                {isMuted ? <MicOff size={16} /> : <Mic size={16} />}
              </button>
              
              <button
                onClick={() => handleVoiceChannelClick(currentVoiceChannelId, selectedCommunityId!)}
                className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                title="음성 채널 나가기"
              >
                <Volume2 size={16} />
              </button>
            </div>
          </div>
        )}

        {/* 커뮤니티 찾기 */}
        <div className="border-t border-gray-600 pt-2">
          <div className="text-gray-300 text-xs mb-2 px-2">커뮤니티</div>
          <button
            onClick={onShowExplorer}
            className="w-full p-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded hover:from-blue-700 hover:to-purple-700 transition-all text-sm font-medium"
            title="커뮤니티 찾기"
          >
            <div className="flex items-center justify-center space-x-2">
              <Search size={16} />
              <span>커뮤니티 찾기</span>
            </div>
          </button>
        </div>

        {/* 디버그 컨트롤 */}
        <div className="border-t border-gray-600 pt-2">
          <div className="text-gray-300 text-xs mb-2 px-2">디버그 도구</div>
          <div className="grid grid-cols-2 gap-1">
            <button
              onClick={() => {
                if (window.electronAPI?.openDevTools) {
                  window.electronAPI.openDevTools();
                } else {
                  console.log('🔧 DevTools API not available');
                }
              }}
              className="p-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors text-xs"
              title="개발자 도구 열기"
            >
              <Bug size={12} />
            </button>
            
            <button
              onClick={() => {
                if (window.electronAPI?.toggleDevTools) {
                  window.electronAPI.toggleDevTools();
                } else {
                  console.log('🔧 DevTools API not available');
                }
              }}
              className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors text-xs"
              title="개발자 도구 토글"
            >
              <Code size={12} />
            </button>
          </div>
        </div>
      </div>

      <CreateChannelModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        communityId={selectedCommunityId}
        onChannelCreated={handleChannelCreated}
      />

      {/* 사용자 볼륨 컨텍스트 메뉴 */}
      <UserVolumeContextMenu
        userId={contextMenu.userId}
        username={contextMenu.username}
        position={contextMenu.position}
        onClose={handleCloseContextMenu}
        isVisible={contextMenu.isVisible}
      />
    </>
  );
}