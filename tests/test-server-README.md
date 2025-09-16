# 🎤 음성 채팅 테스트 서버

간단한 음성 채팅 기능을 테스트할 수 있는 Node.js 기본 WebSocket 서버입니다.

## 🚀 서버 실행

```bash
# 방법 1: npm 스크립트 사용
yarn test:server

# 방법 2: 직접 실행
npx tsx tests/run-test-server.ts

# 방법 3: 서버만 실행 (로그 포함)
npx tsx tests/voice-test-server.ts
```

## 🌐 서버 정보

- **HTTP 서버**: `http://localhost:3001`
- **WebSocket**: `ws://localhost:3001?token=토큰`
- **상태 확인**: `http://localhost:3001/status`

## 🔑 테스트용 토큰

다음 토큰들을 사용해서 테스트할 수 있습니다:

- `test-user-1-token` (사용자 1)
- `test-user-2-token` (사용자 2) 
- `test-user-3-token` (사용자 3)
- `test-admin-token` (관리자)

## 📺 기본 채널

- **채널 1**: "General Voice" (ID: 1)
- **채널 2**: "Test Channel" (ID: 2)

## 🎵 연결 방법

### JavaScript WebSocket 클라이언트 예제

```javascript
// 기본 WebSocket 연결 (Socket.IO 아님!)
const ws = new WebSocket('ws://localhost:3001?token=test-user-1-token');

ws.onopen = () => {
  console.log('연결됨');
  
  // 음성 채널 참가
  ws.send(JSON.stringify({
    type: 'join-voice-channel',
    data: { channelId: 1, communityId: 1 }
  }));
};

ws.onmessage = (event) => {
  const message = JSON.parse(event.data);
  console.log('수신:', message);
  
  if (message.type === 'voice-stream') {
    // 음성 데이터 수신 처리
    console.log('음성 데이터:', message.data);
  }
};

// 음성 데이터 전송 (Base64 인코딩된 오디오)
ws.send(JSON.stringify({
  type: 'voice-stream',
  data: {
    channelId: 1,
    audioData: 'base64EncodedAudioData...',
    audioFormat: 'webm-opus',
    timestamp: Date.now()
  }
}));
```

## 📋 지원하는 메시지 타입

### 클라이언트 → 서버

| 메시지 타입 | 설명 | 데이터 |
|------------|------|--------|
| `join-voice-channel` | 음성 채널 참가 | `{ channelId, communityId }` |
| `leave-voice-channel` | 음성 채널 나가기 | `{}` |
| `voice-stream` | 음성 데이터 전송 | `{ channelId, audioData, audioFormat, timestamp }` |
| `voice-echo` | 에코 테스트 | `{ audioData, audioFormat }` |
| `get-voice-channels` | 채널 목록 요청 | `{}` |

### 서버 → 클라이언트

| 메시지 타입 | 설명 | 데이터 |
|------------|------|--------|
| `user-id` | 사용자 ID 알림 | `number` |
| `voice-stream` | 음성 데이터 수신 | `{ channelId, audioData, audioFormat, fromUserId, fromUsername, timestamp }` |
| `voice-channel-updated` | 채널 상태 업데이트 | `{ channelId, participantCount, participants }` |
| `user-joined` | 사용자 참가 알림 | `{ userId, username, socketId }` |
| `user-left` | 사용자 나가기 알림 | `{ userId, username, socketId }` |
| `*-response` | 요청에 대한 응답 | `{ success, message?, ... }` |

## 🔧 클라이언트 연결 코드 수정

현재 음성 채팅 서비스가 Socket.IO를 사용하고 있다면, 이 테스트 서버는 **기본 WebSocket**만 지원하므로 클라이언트 코드를 약간 수정해야 합니다.

### Socket.IO → WebSocket 변경 예제

```typescript
// 기존 (Socket.IO)
const socket = io('ws://localhost:3001', { auth: { token } });

// 변경 (기본 WebSocket)
const socket = new WebSocket('ws://localhost:3001?token=' + token);

// 메시지 전송
// 기존: socket.emit('join-voice-channel', data, callback);
// 변경: socket.send(JSON.stringify({ type: 'join-voice-channel', data }));

// 메시지 수신
// 기존: socket.on('voice-stream', handler);
// 변경: socket.onmessage = (event) => {
//   const msg = JSON.parse(event.data);
//   if (msg.type === 'voice-stream') handler(msg.data);
// };
```

## 🐛 디버깅

### 서버 로그 확인

서버를 실행하면 다음과 같은 로그를 볼 수 있습니다:

```
🎤 ================================
🎤 음성 채팅 테스트 서버 시작됨!
🎤 ================================
🌐 HTTP: http://localhost:3001
🔌 WebSocket: ws://localhost:3001
📋 테스트용 토큰:
  - "test-user-1-token" (사용자 1)
  - "test-user-2-token" (사용자 2)
  - "test-user-3-token" (사용자 3)
  - "test-admin-token" (관리자)
🎵 연결 방법:
  ws://localhost:3001?token=test-user-1-token
⚠️  주의: Socket.IO가 아닌 기본 WebSocket을 사용합니다.
🎤 ================================

✅ WebSocket 연결 성공: test-user-1 (1) - abc123
🎤 음성 채널 참가 요청: 사용자 1 -> 채널 1
✅ 음성 채널 참가 성공: test-user-1 -> General Voice
🎵 음성 데이터 수신: test-user-1 (1024 bytes, webm-opus)
```

### 상태 확인

브라우저에서 `http://localhost:3001/status`를 열어서 현재 연결된 사용자와 채널 상태를 확인할 수 있습니다.

## ⚠️ 주의사항

- 이 서버는 **테스트 목적**으로만 사용하세요
- **Socket.IO가 아닌 기본 WebSocket**을 사용합니다
- JWT 토큰 검증은 **모킹**되어 있습니다
- 실제 음성 처리나 변환은 하지 않고 **단순 브로드캐스트**만 합니다
- 서버 재시작 시 모든 데이터가 **초기화**됩니다 