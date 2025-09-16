import React, { useState } from "react";

interface Server {
  id: string;
  name: string;
  url: string;
  isDefault: boolean;
  isConnected: boolean;
}

export function ServerListSettings() {
  const [servers, setServers] = useState<Server[]>([
    { id: '1', name: '메인 서버', url: 'http://localhost:3000', isDefault: true, isConnected: true },
    { id: '2', name: '테스트 서버', url: 'http://localhost:3001', isDefault: false, isConnected: false },
  ]);

  const [isAddingServer, setIsAddingServer] = useState(false);
  const [editingServer, setEditingServer] = useState<Server | null>(null);
  const [newServer, setNewServer] = useState({ name: '', url: '' });

  const addServer = () => {
    if (newServer.name && newServer.url) {
      const server: Server = {
        id: Date.now().toString(),
        name: newServer.name,
        url: newServer.url,
        isDefault: false,
        isConnected: false,
      };
      setServers([...servers, server]);
      setNewServer({ name: '', url: '' });
      setIsAddingServer(false);
    }
  };

  const updateServer = () => {
    if (editingServer && editingServer.name && editingServer.url) {
      setServers(servers.map(server => 
        server.id === editingServer.id ? editingServer : server
      ));
      setEditingServer(null);
    }
  };

  const deleteServer = (id: string) => {
    setServers(servers.filter(server => server.id !== id));
  };

  const setDefaultServer = (id: string) => {
    setServers(servers.map(server => ({
      ...server,
      isDefault: server.id === id
    })));
  };

  const testConnection = async (server: Server) => {
    // 실제로는 서버 연결을 테스트합니다
    console.log(`Testing connection to ${server.url}`);
  };

  return (
    <div className="max-w-4xl">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">서버 목록</h2>
        <button
          onClick={() => setIsAddingServer(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          서버 추가
        </button>
      </div>

      {/* 서버 추가 폼 */}
      {isAddingServer && (
        <div className="bg-gray-700 rounded-lg p-4 mb-6">
          <h3 className="text-lg font-semibold text-white mb-4">새 서버 추가</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm mb-2">서버 이름</label>
              <input
                type="text"
                value={newServer.name}
                onChange={(e) => setNewServer({ ...newServer, name: e.target.value })}
                placeholder="서버 이름을 입력하세요"
                className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-300 text-sm mb-2">서버 URL</label>
              <input
                type="url"
                value={newServer.url}
                onChange={(e) => setNewServer({ ...newServer, url: e.target.value })}
                placeholder="http://localhost:3000"
                className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
            </div>
            <div className="flex space-x-3">
              <button
                onClick={addServer}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                추가
              </button>
              <button
                onClick={() => {
                  setIsAddingServer(false);
                  setNewServer({ name: '', url: '' });
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 서버 목록 */}
      <div className="space-y-4">
        {servers.map((server) => (
          <div key={server.id} className="bg-gray-700 rounded-lg p-4">
            {editingServer?.id === server.id ? (
              // 편집 모드
              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 text-sm mb-2">서버 이름</label>
                  <input
                    type="text"
                    value={editingServer.name}
                    onChange={(e) => setEditingServer({ ...editingServer, name: e.target.value })}
                    className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-gray-300 text-sm mb-2">서버 URL</label>
                  <input
                    type="url"
                    value={editingServer.url}
                    onChange={(e) => setEditingServer({ ...editingServer, url: e.target.value })}
                    className="w-full bg-gray-600 text-white border border-gray-500 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={updateServer}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    저장
                  </button>
                  <button
                    onClick={() => setEditingServer(null)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    취소
                  </button>
                </div>
              </div>
            ) : (
              // 보기 모드
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-lg font-semibold text-white">{server.name}</h3>
                    {server.isDefault && (
                      <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">기본</span>
                    )}
                    <span className={`text-xs px-2 py-1 rounded ${
                      server.isConnected 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-600 text-white'
                    }`}>
                      {server.isConnected ? '연결됨' : '연결 안됨'}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm mt-1">{server.url}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => testConnection(server)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                  >
                    연결 테스트
                  </button>
                  {!server.isDefault && (
                    <button
                      onClick={() => setDefaultServer(server.id)}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    >
                      기본으로 설정
                    </button>
                  )}
                  <button
                    onClick={() => setEditingServer(server)}
                    className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                  >
                    편집
                  </button>
                  {!server.isDefault && (
                    <button
                      onClick={() => deleteServer(server.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition-colors duration-200"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* 안내 메시지 */}
      <div className="mt-6 p-4 bg-blue-900 bg-opacity-20 border border-blue-700 rounded-lg">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">서버 관리</h3>
        <p className="text-gray-300 text-sm">
          여러 서버를 추가하여 다양한 환경에서 사용할 수 있습니다. 
          기본 서버는 애플리케이션 시작 시 자동으로 연결됩니다.
        </p>
      </div>
    </div>
  );
} 