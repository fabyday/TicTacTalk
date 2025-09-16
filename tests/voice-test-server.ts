import { createServer, IncomingMessage, ServerResponse } from 'http';
import { createHash } from 'crypto';

// 🎤 간단한 음성 채팅 테스트 서버 (Node.js 내장 모듈만 사용)
// 기본 WebSocket 핸드셰이크와 메시지 처리를 직접 구현

// 메모리 내 데이터 저장소
interface MockUser {
  id: number;
  username: string;
  socketId?: string;
}

interface MockChannel {
  id: number;
  name: string;
  participants: Set<string>; // socket IDs
  userMap: Map<string, number>; // socketId -> userId
}

interface MockConnection {
  id: string;
  socket: any;
  userId?: number;
  username?: string;
  isAuthenticated: boolean;
}

// Mock 데이터
const mockUsers: Map<number, MockUser> = new Map([
  [1, { id: 1, username: 'test-user-1' }],
  [2, { id: 2, username: 'test-user-2' }],
  [3, { id: 3, username: 'test-user-3' }],
  [999, { id: 999, username: 'test-admin' }]
]);

const mockChannels: Map<number, MockChannel> = new Map([
  [1, { 
    id: 1, 
    name: 'General Voice', 
    participants: new Set(), 
    userMap: new Map() 
  }],
  [2, { 
    id: 2, 
    name: 'Test Channel', 
    participants: new Set(), 
    userMap: new Map() 
  }]
]);

// 연결된 소켓들 추적
const connections: Map<string, MockConnection> = new Map();
const userSockets: Map<number, string> = new Map(); // userId -> socketId

// 🔑 Mock JWT 토큰 검증 (항상 성공)
function mockVerifyToken(token: string): MockUser | null {
  try {
    if (!token || token.length < 10) {
      return null;
    }
    
    // 토큰에서 사용자 ID 추출 (mock)
    const userId = token.includes('admin') ? 999 : 
                  token.includes('user2') ? 2 :
                  token.includes('user3') ? 3 : 1;
    
    return mockUsers.get(userId) || null;
  } catch (error) {
    console.error('🔑 토큰 검증 오류:', error);
    return null;
  }
}

// 소켓 ID 생성
function generateSocketId(): string {
  return Math.random().toString(36).substring(2, 15);
}

// WebSocket 핸드셰이크 키 생성
function generateWebSocketKey(key: string): string {
  const magic = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
  return createHash('sha1').update(key + magic).digest('base64');
}

// 메시지 전송 헬퍼
function sendMessage(connection: MockConnection, type: string, data: any) {
  const message = JSON.stringify({ type, data });
  const buffer = Buffer.from(message, 'utf8');
  
  // WebSocket 프레임 생성 (간단한 텍스트 프레임)
  const frame = Buffer.alloc(2 + buffer.length);
  frame[0] = 0x81; // FIN bit + text frame
  frame[1] = buffer.length; // payload length
  buffer.copy(frame, 2);
  
  try {
    connection.socket.write(frame);
  } catch (error) {
    console.error(`메시지 전송 오류 (${connection.id}):`, error);
  }
}

// 채널 브로드캐스트
function broadcastToChannel(channelId: number, message: any, excludeSocketId?: string) {
  const channel = mockChannels.get(channelId);
  if (!channel) return;

  channel.participants.forEach(socketId => {
    if (socketId !== excludeSocketId) {
      const connection = connections.get(socketId);
      if (connection) {
        sendMessage(connection, message.type, message.data);
      }
    }
  });
}

// WebSocket 메시지 파싱
function parseWebSocketFrame(buffer: Buffer): string | null {
  if (buffer.length < 2) return null;
  
  const firstByte = buffer[0];
  const secondByte = buffer[1];
  
  const opcode = firstByte & 0x0F;
  const masked = (secondByte & 0x80) === 0x80;
  let payloadLength = secondByte & 0x7F;
  
  if (opcode !== 0x01) return null; // 텍스트 프레임만 처리
  
  let offset = 2;
  
  if (payloadLength === 126) {
    payloadLength = buffer.readUInt16BE(offset);
    offset += 2;
  } else if (payloadLength === 127) {
    return null; // 큰 메시지는 지원하지 않음
  }
  
  if (masked) {
    const maskKey = buffer.slice(offset, offset + 4);
    offset += 4;
    
    const payload = buffer.slice(offset, offset + payloadLength);
    for (let i = 0; i < payload.length; i++) {
      payload[i] ^= maskKey[i % 4];
    }
    
    return payload.toString('utf8');
  } else {
    return buffer.slice(offset, offset + payloadLength).toString('utf8');
  }
}

// HTTP 서버
const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
  // CORS 헤더 설정
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  res.setHeader('Content-Type', 'application/json');

  if (req.url === '/') {
    res.writeHead(200);
    res.end(JSON.stringify({
      message: '🎤 음성 채팅 테스트 서버',
      status: 'running',
      connectedUsers: connections.size,
      channels: Array.from(mockChannels.values()).map(ch => ({
        id: ch.id,
        name: ch.name,
        participants: ch.participants.size
      })),
      endpoints: {
        websocket: 'ws://localhost:3001?token=test-user-1-token',
        http: 'http://localhost:3001'
      },
      note: '⚠️ 이 서버는 기본 WebSocket만 지원합니다. Socket.IO가 아닌 기본 WebSocket을 사용하세요.'
    }));
  } else if (req.url === '/status') {
    res.writeHead(200);
    res.end(JSON.stringify({
      connectedUsers: Array.from(connections.entries()).map(([socketId, conn]) => ({
        socketId,
        userId: conn.userId,
        username: conn.username,
        authenticated: conn.isAuthenticated
      })),
      channels: Array.from(mockChannels.entries()).map(([id, channel]) => ({
        id,
        name: channel.name,
        participants: Array.from(channel.userMap.entries()).map(([socketId, userId]) => {
          const user = mockUsers.get(userId);
          return { socketId, userId, username: user?.username };
        })
      }))
    }));
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});

// WebSocket 업그레이드 처리
httpServer.on('upgrade', (request: IncomingMessage, socket: any, head: Buffer) => {
  const key = request.headers['sec-websocket-key'];
  if (!key) {
    socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
    return;
  }

  // URL에서 토큰 추출
  const url = new URL(request.url || '', `http://${request.headers.host}`);
  const token = url.searchParams.get('token') || url.searchParams.get('auth');

  // 인증 처리
  const user = mockVerifyToken(token || '');
  if (!user) {
    console.log(`❌ 인증 실패: 토큰 없음 또는 유효하지 않음`);
    socket.end('HTTP/1.1 401 Unauthorized\r\n\r\n');
    return;
  }

  // WebSocket 핸드셰이크 응답
  const acceptKey = generateWebSocketKey(key);
  const responseHeaders = [
    'HTTP/1.1 101 Switching Protocols',
    'Upgrade: websocket',
    'Connection: Upgrade',
    `Sec-WebSocket-Accept: ${acceptKey}`,
    '\r\n'
  ].join('\r\n');

  socket.write(responseHeaders);

  // 연결 정보 생성
  const connectionId = generateSocketId();
  const connection: MockConnection = {
    id: connectionId,
    socket,
    userId: user.id,
    username: user.username,
    isAuthenticated: true
  };

  connections.set(connectionId, connection);
  userSockets.set(user.id, connectionId);

  console.log(`✅ WebSocket 연결 성공: ${user.username} (${user.id}) - ${connectionId}`);

  // 사용자 ID 전송
  sendMessage(connection, 'user-id', user.id);

  // 메시지 수신 처리
  socket.on('data', (buffer: Buffer) => {
    try {
      const message = parseWebSocketFrame(buffer);
      if (!message) return;

      const data = JSON.parse(message);
      const { type, data: messageData } = data;

      switch (type) {
        case 'join-voice-channel':
          handleJoinVoiceChannel(connection, messageData);
          break;
        
        case 'leave-voice-channel':
          handleLeaveVoiceChannel(connection, messageData);
          break;
        
        case 'voice-stream':
          handleVoiceStream(connection, messageData);
          break;
        
        case 'voice-echo':
          handleVoiceEcho(connection, messageData);
          break;
        
        case 'get-voice-channels':
          handleGetVoiceChannels(connection, messageData);
          break;
        
        default:
          console.log(`❓ 알 수 없는 메시지 타입: ${type}`);
      }
    } catch (error) {
      console.error(`메시지 처리 오류 (${connection.id}):`, error);
    }
  });

  // 연결 해제 처리
  socket.on('close', () => {
    console.log(`🔌 WebSocket 연결 해제: ${connection.id} (${connection.username})`);
    
    // 모든 채널에서 사용자 제거
    mockChannels.forEach((channel, channelId) => {
      if (channel.participants.has(connection.id)) {
        channel.participants.delete(connection.id);
        channel.userMap.delete(connection.id);

        console.log(`🚪 연결 해제로 인한 채널 ${channelId} 나가기`);

        // 다른 참가자들에게 알림
        const participants = Array.from(channel.userMap.values()).map(userId => {
          const u = mockUsers.get(userId);
          return { userId, username: u?.username || 'unknown' };
        });

        broadcastToChannel(channelId, {
          type: 'voice-channel-updated',
          data: {
            channelId,
            participantCount: channel.participants.size,
            participants
          }
        }, connection.id);

        broadcastToChannel(channelId, {
          type: 'user-left',
          data: {
            userId: connection.userId,
            username: connection.username,
            socketId: connection.id
          }
        }, connection.id);
      }
    });

    // 연결 정보 정리
    connections.delete(connection.id);
    if (connection.userId) {
      userSockets.delete(connection.userId);
    }
  });

  socket.on('error', (error: Error) => {
    console.error(`소켓 오류 (${connection.id}):`, error);
  });
});

// 메시지 핸들러들
function handleJoinVoiceChannel(connection: MockConnection, data: any) {
  const { channelId, communityId } = data;
  console.log(`🎤 음성 채널 참가 요청: 사용자 ${connection.userId} -> 채널 ${channelId}`);

  const channel = mockChannels.get(channelId);
  if (!channel) {
    sendMessage(connection, 'join-voice-channel-response', { 
      success: false, 
      message: '존재하지 않는 채널입니다.' 
    });
    return;
  }

  // 기존 채널에서 나가기
  mockChannels.forEach((ch) => {
    if (ch.participants.has(connection.id)) {
      ch.participants.delete(connection.id);
      ch.userMap.delete(connection.id);
      console.log(`🚪 사용자 ${connection.userId}가 채널 ${ch.id}에서 나감`);
    }
  });

  // 새 채널에 참가
  channel.participants.add(connection.id);
  channel.userMap.set(connection.id, connection.userId!);

  const response = {
    success: true,
    channel: {
      id: channel.id,
      name: channel.name,
      participantCount: channel.participants.size
    }
  };

  console.log(`✅ 음성 채널 참가 성공: ${connection.username} -> ${channel.name}`);
  sendMessage(connection, 'join-voice-channel-response', response);

  // 다른 참가자들에게 알림
  const participants = Array.from(channel.userMap.values()).map(userId => {
    const u = mockUsers.get(userId);
    return { userId, username: u?.username || 'unknown' };
  });

  broadcastToChannel(channelId, {
    type: 'voice-channel-updated',
    data: {
      channelId,
      participantCount: channel.participants.size,
      participants
    }
  });

  broadcastToChannel(channelId, {
    type: 'user-joined',
    data: {
      userId: connection.userId,
      username: connection.username,
      socketId: connection.id
    }
  }, connection.id);
}

function handleLeaveVoiceChannel(connection: MockConnection, data: any) {
  console.log(`🚪 음성 채널 나가기 요청: 사용자 ${connection.userId}`);

  let leftChannelId: number | null = null;

  // 모든 채널에서 사용자 제거
  mockChannels.forEach((channel, channelId) => {
    if (channel.participants.has(connection.id)) {
      channel.participants.delete(connection.id);
      channel.userMap.delete(connection.id);
      leftChannelId = channelId;

      console.log(`✅ 사용자 ${connection.userId}가 채널 ${channelId}에서 나감`);

      // 다른 참가자들에게 알림
      const participants = Array.from(channel.userMap.values()).map(userId => {
        const u = mockUsers.get(userId);
        return { userId, username: u?.username || 'unknown' };
      });

      broadcastToChannel(channelId, {
        type: 'voice-channel-updated',
        data: {
          channelId,
          participantCount: channel.participants.size,
          participants
        }
      }, connection.id);

      broadcastToChannel(channelId, {
        type: 'user-left',
        data: {
          userId: connection.userId,
          username: connection.username,
          socketId: connection.id
        }
      }, connection.id);
    }
  });

  sendMessage(connection, 'leave-voice-channel-response', { success: true });
}

function handleVoiceStream(connection: MockConnection, data: any) {
  const { channelId, audioData, audioFormat, timestamp } = data;
  
  // 현재 사용자가 속한 채널 찾기
  const channel = mockChannels.get(channelId);
  if (!channel || !channel.participants.has(connection.id)) {
    return; // 채널에 속하지 않으면 무시
  }

  // 통계 (선택적)
  if (audioData && audioData.length > 0) {
    const dataSize = Math.floor((audioData.length * 3) / 4); // Base64 -> bytes
    console.log(`🎵 음성 데이터 수신: ${connection.username} (${dataSize} bytes, ${audioFormat})`);
  }

  // 같은 채널의 다른 사용자들에게 브로드캐스트
  broadcastToChannel(channelId, {
    type: 'voice-stream',
    data: {
      ...data,
      fromUserId: connection.userId,
      fromUsername: connection.username,
      timestamp: Date.now()
    }
  }, connection.id);
}

function handleVoiceEcho(connection: MockConnection, data: any) {
  console.log(`🔊 에코 테스트: ${connection.username}`);
  
  // 즉시 다시 보내기 (에코)
  sendMessage(connection, 'voice-stream', {
    ...data,
    fromUserId: 'echo-server',
    fromUsername: 'Echo Server',
    timestamp: Date.now()
  });
}

function handleGetVoiceChannels(connection: MockConnection, data: any) {
  const channels = Array.from(mockChannels.values()).map(channel => ({
    id: channel.id,
    name: channel.name,
    participantCount: channel.participants.size,
    participants: Array.from(channel.userMap.values()).map(userId => {
      const u = mockUsers.get(userId);
      return { userId, username: u?.username || 'unknown' };
    })
  }));

  sendMessage(connection, 'get-voice-channels-response', { success: true, channels });
}

// 서버 시작
const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log('🎤 ================================');
  console.log('🎤 음성 채팅 테스트 서버 시작됨!');
  console.log('🎤 ================================');
  console.log(`🌐 HTTP: http://localhost:${PORT}`);
  console.log(`🔌 WebSocket: ws://localhost:${PORT}`);
  console.log('');
  console.log('📋 테스트용 토큰:');
  console.log('  - "test-user-1-token" (사용자 1)');
  console.log('  - "test-user-2-token" (사용자 2)');
  console.log('  - "test-user-3-token" (사용자 3)');
  console.log('  - "test-admin-token" (관리자)');
  console.log('');
  console.log('🎵 연결 방법:');
  console.log('  ws://localhost:3001?token=test-user-1-token');
  console.log('');
  console.log('⚠️  주의: Socket.IO가 아닌 기본 WebSocket을 사용합니다.');
  console.log('🎤 ================================');
});

// 🎵 10초마다 서버 상태 출력
setInterval(() => {
  if (connections.size > 0) {
    console.log(`📊 [${new Date().toLocaleTimeString()}] 연결된 사용자: ${connections.size}명`);
    
    mockChannels.forEach((channel, channelId) => {
      if (channel.participants.size > 0) {
        console.log(`  📺 채널 ${channelId} (${channel.name}): ${channel.participants.size}명`);
      }
    });
  }
}, 10000);

console.log('🎤 테스트 서버 설정 완료');

export default httpServer; 