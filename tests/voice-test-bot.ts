import { io, Socket } from "socket.io-client";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import ffmpegInstaller from "@ffmpeg-installer/ffmpeg";
import { apiService } from "../src/renderer/services/api.js";

// FFmpeg 실행 파일 경로 설정
ffmpeg.setFfmpegPath(ffmpegInstaller.path);

// Opus 인코더 추가
let OpusEncoder: any;
try {
  const nodeOpus = require('node-opus');
  OpusEncoder = nodeOpus.OpusEncoder;
  console.log('✅ node-opus 로드 성공');
} catch (error: any) {
  console.log('❌ node-opus 로드 실패, FFmpeg 방식 사용:', error.message);
}

// 타입 정의
interface VoiceStreamData {
  channelId: number;
  audioData: string;
  audioFormat: string;
  timestamp: number;
  sequence?: number;
  sampleRate?: number;
  channels?: number;
  chunkDuration?: number;
}

interface JoinVoiceChannelData {
  channelId: number;
  communityId: number;
}

interface SFUSignalData {
  type: 'offer' | 'answer' | 'ice-candidate' | 'transport-created' | 'error';
  data: any;
  channelId: number;
}

interface MediasoupTransportData {
  rtpCapabilities: any;
  sendTransport: {
    id: string;
    iceParameters: any;
    iceCandidates: any;
    dtlsParameters: any;
  };
  recvTransport: {
    id: string;
    iceParameters: any;
    iceCandidates: any;
    dtlsParameters: any;
  };
}

interface AudioMetadata {
  bitrate: number;
  sampleRate: number;
  channels: number;
  duration: number;
  fileSize: number;
}

class VoiceTestBot {
  private socket: Socket | null = null;
  private accessToken: string | null = null;
  private currentUserId: number | null = null;
  private targetCommunityId: number | null = null;
  private targetChannelId: number | null = null;
  private streamInterval: NodeJS.Timeout | null = null;
  
  // 오디오 데이터 저장
  private pcmBuffer: Buffer | null = null;
  private pcmChunks: Buffer[] = []; // 20ms PCM 청크들
  private audioMetadata: AudioMetadata | null = null;
  
  // 설정
  private serverUrl: string = "http://localhost:3000";
  private targetCommunityName: string = "qqqsad";
  private targetChannelName: string = "yaho";
  private botUsername: string = "test-bot-" + Date.now();
  private botPassword: string = "testpassword123";
  private musicFilePath: string = "D:\\project\\tictactalk\\client\\resources\\sounds\\login_sound.mp3";
  private useSFUMode: boolean = true; // SFU 모드 기본 사용
  
  // SFU 관련 속성
  private sendTransportId: string | null = null;
  private recvTransportId: string | null = null;
  private producerId: string | null = null;
  private rtpCapabilities: any = null;
  private sfuConnected: boolean = false;

  constructor() {
    // Command line arguments 파싱
    this.parseCommandLineArgs();
  }

  private parseCommandLineArgs(): void {
    const args = process.argv.slice(2);
    
    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      
      if (arg === '--music' || arg === '-m') {
        if (i + 1 < args.length) {
          this.musicFilePath = args[i + 1];
          console.log(`🎵 음악 파일 경로 설정: ${this.musicFilePath}`);
          i++; // 다음 인자 건너뛰기
        } else {
          console.error('❌ --music 옵션에 파일 경로가 필요합니다');
          process.exit(1);
        }
      } else if (arg === '--server' || arg === '-s') {
        if (i + 1 < args.length) {
          this.serverUrl = args[i + 1];
          console.log(`📡 서버 URL 설정: ${this.serverUrl}`);
          i++;
        } else {
          console.error('❌ --server 옵션에 URL이 필요합니다');
          process.exit(1);
        }
      } else if (arg === '--community' || arg === '-c') {
        if (i + 1 < args.length) {
          this.targetCommunityName = args[i + 1];
          console.log(`🎯 커뮤니티 이름 설정: ${this.targetCommunityName}`);
          i++;
        } else {
          console.error('❌ --community 옵션에 커뮤니티 이름이 필요합니다');
          process.exit(1);
        }
      } else if (arg === '--channel' || arg === '-ch') {
        if (i + 1 < args.length) {
          this.targetChannelName = args[i + 1];
          console.log(`🎯 채널 이름 설정: ${this.targetChannelName}`);
          i++;
        } else {
          console.error('❌ --channel 옵션에 채널 이름이 필요합니다');
          process.exit(1);
        }
              } else if (arg === '--sfu') {
          this.useSFUMode = true;
          console.log('✅ SFU 모드 사용');
        } else if (arg === '--legacy') {
          this.useSFUMode = false;
          console.log('✅ 기존 모드 사용');
      } else if (arg === '--help' || arg === '-h') {
        this.showHelp();
        process.exit(0);
      } else if (arg.startsWith('-')) {
        console.error(`❌ 알 수 없는 옵션: ${arg}`);
        this.showHelp();
        process.exit(1);
      }
    }
  }

  private showHelp(): void {
    console.log(`
🤖 TicTacTalk 음성 테스트 봇 사용법:

사용법: npm run test-voice [옵션]

옵션:
  -m, --music <path>     음악 파일 경로 (기본값: login_sound.mp3)
  -s, --server <url>     서버 URL (기본값: http://localhost:3000)
  -c, --community <name> 커뮤니티 이름 (기본값: qqqsad)
  -ch, --channel <name>  채널 이름 (기본값: yaho)
  --sfu                  SFU/WebRTC 모드 사용 (기본값)
  --legacy               기존 voice-stream 모드 사용
  -h, --help            도움말 표시

모드 설명:
  SFU 모드:     Mediasoup SFU + WebRTC Transport (미래 지향적, 확장성 좋음)
  Legacy 모드:  기존 Socket.IO voice-stream (단순, 호환성 좋음)

예시:
  npm run test-voice                                           # SFU 모드 (기본)
  npm run test-voice -- --legacy                              # 기존 모드
  npm run test-voice -- --music "D:\\music\\test.mp3"         # SFU 모드 + 커스텀 음악
  npm run test-voice -- --sfu --community "testcommunity"     # SFU 모드 + 커스텀 커뮤니티
  npm run test-voice -- --legacy -c "testcommunity"           # 기존 모드 + 커스텀 커뮤니티
`);
  }

  async start(): Promise<void> {
    console.log("🤖 TicTacTalk 음성 테스트 봇 시작");
    console.log(`📡 서버: ${this.serverUrl}`);
    console.log(`🎯 대상 커뮤니티: ${this.targetCommunityName}`);
    console.log(`🎯 대상 채널: ${this.targetChannelName}`);
    console.log(`🎵 모드: ${this.useSFUMode ? 'SFU/WebRTC (Mediasoup)' : 'Legacy (voice-stream)'}`);
    console.log("");

    try {
      // API 서비스 초기화
      apiService.setBaseUrl(this.serverUrl);

      // 1. 서버 연결 테스트
      await this.testConnection();

      // 2. 회원가입/로그인
      await this.registerAndLogin();

      // 3. 커뮤니티 찾기 및 가입
      await this.findAndJoinCommunity();

      // 4. 보이스 채널 찾기 및 참가
      await this.findAndJoinVoiceChannel();

      // 5. 음악 스트리밍 시작
      await this.startMusicStreaming();
    } catch (error) {
      console.error("❌ 봇 실행 중 오류:", error);
      this.cleanup();
    }
  }

  async testConnection(): Promise<void> {
    console.log("📡 서버 연결 테스트 중...");

    try {
      const isConnected = await apiService.testConnection();
      if (isConnected) {
        console.log("✅ 서버 연결 성공");
      } else {
        throw new Error("서버 연결 실패");
      }
    } catch (error: any) {
      throw new Error(`서버 연결 실패: ${error.message}`);
    }
  }

  async registerAndLogin(): Promise<void> {
    console.log("👤 사용자 등록 및 로그인 중...");

    try {
      // 회원가입 시도
      console.log(`📝 회원가입 시도: ${this.botUsername}`);

      try {
        await apiService.register({
          username: this.botUsername,
          password: this.botPassword,
        });
        console.log("✅ 회원가입 성공");
      } catch (error: any) {
        if (error.message && error.message.includes("already exists")) {
          console.log("ℹ️ 이미 존재하는 사용자, 로그인 시도");
        } else {
          console.warn("⚠️ 회원가입 실패, 로그인 시도:", error.message);
        }
      }

      // 로그인
      console.log("🔑 로그인 중...");

      const loginResponse = await apiService.login({
        username: this.botUsername,
        password: this.botPassword,
      });

      this.accessToken = loginResponse.accessToken;
      apiService.setAccessToken(this.accessToken);

      // 사용자 정보 조회
      const profileData = await apiService.getProfile();
      this.currentUserId = parseInt(profileData.userId);

      console.log(`✅ 로그인 성공 - 사용자 ID: ${this.currentUserId}`);
    } catch (error: any) {
      throw new Error(`인증 실패: ${error.message}`);
    }
  }

  async findAndJoinCommunity(): Promise<void> {
    console.log(`🔍 "${this.targetCommunityName}" 커뮤니티 찾는 중...`);

    try {
      const communities = await apiService.getAllCommunitiesWithMembership();
      console.log(`📊 총 ${communities.length}개 커뮤니티 발견`);

      const targetCommunity = communities.find(
        (c) => c.name.toLowerCase() === this.targetCommunityName.toLowerCase()
      );

      if (!targetCommunity) {
        throw new Error(
          `"${this.targetCommunityName}" 커뮤니티를 찾을 수 없습니다`
        );
      }

      this.targetCommunityId = targetCommunity.id;
      console.log(`✅ 커뮤니티 발견 - ID: ${this.targetCommunityId}`);

      if (targetCommunity.isJoined) {
        console.log("ℹ️ 이미 가입된 커뮤니티입니다");
        return;
      }

      console.log("🚪 커뮤니티 가입 중...");
      const joinResult = await apiService.joinCommunity(this.targetCommunityId);

      if (!joinResult.success) {
        throw new Error(`커뮤니티 가입 실패: ${joinResult.message}`);
      }

      console.log("✅ 커뮤니티 가입 성공");
    } catch (error: any) {
      throw new Error(`커뮤니티 처리 실패: ${error.message}`);
    }
  }

  async findAndJoinVoiceChannel(): Promise<void> {
    console.log(`🔍 "${this.targetChannelName}" 보이스 채널 찾는 중...`);

    try {
      if (!this.targetCommunityId) {
        throw new Error("커뮤니티 ID가 설정되지 않았습니다");
      }

      const voiceChannels = await apiService.getVoiceChannelsByCommunity(this.targetCommunityId);
      console.log(`📊 총 ${voiceChannels.length}개 보이스 채널 발견`);

      let targetChannel = voiceChannels.find(
        (c) => c.name.toLowerCase() === this.targetChannelName.toLowerCase()
      );

      if (!targetChannel) {
        console.log(`📝 "${this.targetChannelName}" 채널 생성 중...`);
        targetChannel = await apiService.createVoiceChannel({
          name: this.targetChannelName,
          communityId: this.targetCommunityId,
          description: "테스트 봇용 음성 채널",
          maxUsers: 10,
        });
        console.log("✅ 보이스 채널 생성 성공");
      }

      this.targetChannelId = targetChannel.id;
      console.log(`✅ 보이스 채널 발견 - ID: ${this.targetChannelId}`);

      // Socket.IO 연결
      await this.connectSocket();
      
      // 보이스 채널 참가
      await this.joinVoiceChannel();
    } catch (error: any) {
      throw new Error(`보이스 채널 처리 실패: ${error.message}`);
    }
  }

  async connectSocket(): Promise<void> {
    console.log("🔌 Socket.IO 연결 중...");

    return new Promise<void>((resolve, reject) => {
      this.socket = io(this.serverUrl, {
        auth: {
          token: this.accessToken,
        },
        transports: ["websocket", "polling"],
      });

      this.socket.on("connect", () => {
        console.log("✅ Socket.IO 연결 성공");
        this.setupSocketListeners();
        resolve();
      });

      this.socket.on("connect_error", (error) => {
        console.error("❌ Socket.IO 연결 실패:", error);
        reject(new Error(`Socket 연결 실패: ${error.message}`));
      });

      this.socket.on("disconnect", (reason) => {
        console.log("🔌 Socket.IO 연결 끊김:", reason);
      });

      setTimeout(() => {
        if (!this.socket?.connected) {
          reject(new Error("Socket 연결 타임아웃"));
        }
      }, 10000);
    });
  }

  setupSocketListeners(): void {
    if (!this.socket) return;

    this.socket.on("voice-stream", (data: any) => {
      console.log(`🎤 음성 수신: 사용자 ${data.fromUserId || "unknown"}`);
    });

    this.socket.on("voice-channel-updated", (data: any) => {
      console.log(`📢 채널 업데이트: 참가자 ${data.participantCount}명`);
    });

    this.socket.on("user-joined-voice", (data: any) => {
      console.log(`👋 사용자 참가: 채널 ${data.channelId}`);
    });

    this.socket.on("user-left-voice", (data: any) => {
      console.log(`👋 사용자 나감: 채널 ${data.channelId}`);
    });

    // SFU 시그널링 리스너
    this.socket.on("sfu-signal", (data: SFUSignalData) => {
      this.handleSFUSignaling(data);
    });
  }

  async joinVoiceChannel(): Promise<void> {
    console.log("🎤 보이스 채널 참가 중...");

    return new Promise<void>((resolve, reject) => {
      if (!this.socket || !this.targetChannelId || !this.targetCommunityId) {
        reject(new Error("필요한 정보가 설정되지 않았습니다"));
        return;
      }

      this.socket.emit(
        "join-voice-channel",
        {
          channelId: this.targetChannelId,
          communityId: this.targetCommunityId,
        } as JoinVoiceChannelData,
        (response: any) => {
          if (response.success) {
            console.log("✅ 보이스 채널 참가 성공");
            
            if (this.useSFUMode) {
              // SFU 연결 시작
              this.initiateSFUConnection();
            }
            
            resolve();
          } else {
            reject(new Error(`보이스 채널 참가 실패: ${response.message}`));
          }
        }
      );

      setTimeout(() => {
        reject(new Error("보이스 채널 참가 타임아웃"));
      }, 10000);
    });
  }

  // SFU 연결 시작
  private initiateSFUConnection(): void {
    console.log("🎤 SFU 연결 시작 중...");
    
    if (!this.socket || !this.targetChannelId) {
      console.error("❌ Socket 또는 채널 ID가 없습니다");
      return;
    }

    // SFU 연결 요청
    this.socket.emit("sfu-signal", {
      type: 'offer',
      data: { request: 'start-sfu-connection' },
      channelId: this.targetChannelId,
    } as SFUSignalData);
  }

  // SFU 시그널링 처리
  private async handleSFUSignaling(signal: SFUSignalData): Promise<void> {
    try {
      console.log(`🎤 SFU 시그널 수신: ${signal.type}`);

      switch (signal.type) {
        case 'transport-created':
          console.log("🎤 SFU Transport 생성됨");
          await this.setupMediasoupTransports(signal.data);
          break;

        case 'error':
          console.error("🎤 SFU 오류:", signal.data);
          break;

        default:
          console.log(`🎤 처리되지 않은 SFU 시그널: ${signal.type}`);
      }
    } catch (error) {
      console.error("🎤 SFU 시그널링 처리 오류:", error);
    }
  }

  // Mediasoup Transport 설정
  private async setupMediasoupTransports(data: MediasoupTransportData): Promise<void> {
    try {
      console.log("🎤 Mediasoup Transport 설정 중...");
      
      this.rtpCapabilities = data.rtpCapabilities;
      this.sendTransportId = data.sendTransport.id;
      this.recvTransportId = data.recvTransport.id;

      console.log(`✅ Transport 준비 완료:`);
      console.log(`   - Send Transport ID: ${this.sendTransportId}`);
      console.log(`   - Recv Transport ID: ${this.recvTransportId}`);

      // Send Transport 연결
      await this.connectTransport(data.sendTransport, 'send');
      
      // Producer 생성 (오디오 송신)
      await this.createProducer();

      this.sfuConnected = true;
      console.log("✅ SFU 연결 완료");
    } catch (error) {
      console.error("❌ Mediasoup Transport 설정 오류:", error);
    }
  }

  // Transport 연결
  private async connectTransport(transportParams: any, direction: 'send' | 'recv'): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.socket) {
        reject(new Error("Socket이 연결되지 않았습니다"));
        return;
      }

      console.log(`🔗 ${direction} Transport 연결 중...`);

      this.socket.emit(
        "connect-transport",
        {
          transportId: transportParams.id,
          dtlsParameters: transportParams.dtlsParameters, // 실제로는 WebRTC에서 가져와야 함
        },
        (response: any) => {
          if (response.success) {
            console.log(`✅ ${direction} Transport 연결 성공`);
            resolve();
          } else {
            reject(new Error(`${direction} Transport 연결 실패: ${response.message}`));
          }
        }
      );

      setTimeout(() => {
        reject(new Error(`${direction} Transport 연결 타임아웃`));
      }, 10000);
    });
  }

  // Producer 생성 (오디오 송신)
  private async createProducer(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (!this.socket || !this.sendTransportId) {
        reject(new Error("Socket 또는 Send Transport가 준비되지 않았습니다"));
        return;
      }

      console.log("🎤 Producer 생성 중...");

      // 기본 Opus RTP Parameters (실제로는 WebRTC에서 생성해야 함)
      const rtpParameters = {
        codecs: [
          {
            mimeType: 'audio/opus',
            payloadType: 111,
            clockRate: 48000,
            channels: 2,
            parameters: {
              'sprop-stereo': 1,
            },
          },
        ],
        headerExtensions: [
          {
            uri: 'urn:ietf:params:rtp-hdrext:sdes:mid',
            id: 1,
          },
          {
            uri: 'http://www.webrtc.org/experiments/rtp-hdrext/abs-send-time',
            id: 4,
          },
        ],
        encodings: [{ 
          ssrc: Math.floor(Math.random() * 0xFFFFFFFF),
          dtx: false,
        }],
        rtcp: { 
          cname: `bot-${Date.now()}`,
          reducedSize: true,
        },
      };

      this.socket.emit(
        "create-producer",
        {
          transportId: this.sendTransportId,
          rtpParameters: rtpParameters,
          kind: 'audio',
        },
        (response: any) => {
          if (response.success) {
            this.producerId = response.producerId;
            console.log(`✅ Producer 생성 성공: ${this.producerId}`);
            resolve();
          } else {
            reject(new Error(`Producer 생성 실패: ${response.message}`));
          }
        }
      );

      setTimeout(() => {
        reject(new Error("Producer 생성 타임아웃"));
      }, 10000);
    });
  }

  async startMusicStreaming(): Promise<void> {
    if (this.useSFUMode) {
      console.log("🎵 SFU 음악 스트리밍 시작...");
      await this.startSFUMusicStreaming();
    } else {
      console.log("🎵 기존 방식 음악 스트리밍 시작...");
      await this.startLegacyMusicStreaming();
    }
  }

  async startSFUMusicStreaming(): Promise<void> {
    try {
      console.log("🎵 SFU 방식으로 음악 스트리밍 시작...");
      
      // SFU 연결 대기
      if (!this.sfuConnected) {
        console.log("⏳ SFU 연결 대기 중...");
        await this.waitForSFUConnection();
      }

      // 1. MP3 파일 존재 확인
      console.log("🎵 MP3 파일 로딩 중:", this.musicFilePath);
      
      if (!fs.existsSync(this.musicFilePath)) {
        throw new Error(`MP3 파일을 찾을 수 없습니다: ${this.musicFilePath}`);
      }
      
      const mp3FileSize = fs.statSync(this.musicFilePath).size;
      console.log(`🎵 MP3 파일 발견: ${(mp3FileSize / 1024 / 1024).toFixed(2)}MB`);
      
      // 2. FFmpeg로 메타데이터 추출
      await this.extractAudioMetadata();
      
      console.log("✅ SFU Producer가 생성되었으므로 오디오 스트리밍 준비 완료");
      
      // 🎵 하이브리드 방식: SFU + Legacy 동시 사용
      console.log("🔀 하이브리드 스트리밍 시작: SFU(시그널링) + Legacy(실제오디오)");
      
      // Legacy 방식으로 실제 오디오 전송
      console.log("🎵 Legacy 방식으로 실제 오디오 전송 시작...");
      await this.startLegacyAudioStreaming();
      
    } catch (error: any) {
      throw new Error(`SFU 음악 스트리밍 실패: ${error.message}`);
    }
  }

  // 🎵 Legacy 방식 오디오 스트리밍 (SFU와 병행)
  private async startLegacyAudioStreaming(): Promise<void> {
    console.log("🎵 Legacy PCM 스트리밍 시작 (SFU 병행)...");

    try {
      // PCM 디코딩 및 청크 분할
      await this.decodeMp3ToPcm();
      await this.splitPcmIntoChunks();
      
      // Legacy 방식으로 스트리밍
      await this.streamPcmChunks();
      
    } catch (error: any) {
      throw new Error(`Legacy 오디오 스트리밍 실패: ${error.message}`);
    }
  }

  async startLegacyMusicStreaming(): Promise<void> {
    console.log("🎵 음악 스트리밍 시작 (Raw Opus 청크)...");

    try {
      // 1. MP3 파일 존재 확인
      console.log("🎵 MP3 파일 로딩 중:", this.musicFilePath);
      
      if (!fs.existsSync(this.musicFilePath)) {
        throw new Error(`MP3 파일을 찾을 수 없습니다: ${this.musicFilePath}`);
      }
      
      const mp3FileSize = fs.statSync(this.musicFilePath).size;
      console.log(`🎵 MP3 파일 발견: ${(mp3FileSize / 1024 / 1024).toFixed(2)}MB`);
      
      // 2. FFmpeg로 메타데이터 추출
      await this.extractAudioMetadata();
      
      // 3. MP3를 PCM으로 디코딩
      await this.decodeMp3ToPcm();
      
      // 4. PCM을 20ms 청크로 분할하여 직접 전송
      await this.splitPcmIntoChunks();
      
      // 5. Raw PCM 청크들을 18ms 간격으로 전송
      await this.streamPcmChunks();
      
    } catch (error: any) {
      throw new Error(`음악 스트리밍 실패: ${error.message}`);
    }
  }

  // SFU 연결 대기
  private async waitForSFUConnection(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const checkInterval = setInterval(() => {
        if (this.sfuConnected) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 100);

      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error("SFU 연결 타임아웃"));
      }, 30000); // 30초 타임아웃
    });
  }

  private async extractAudioMetadata(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log("📊 오디오 메타데이터 추출 중...");
      
      ffmpeg.ffprobe(this.musicFilePath, (err, metadata) => {
        if (err) {
          reject(new Error(`메타데이터 추출 실패: ${err.message}`));
          return;
        }
        
        const audioStream = metadata.streams.find(stream => stream.codec_type === 'audio');
        if (!audioStream) {
          reject(new Error("오디오 스트림을 찾을 수 없습니다"));
          return;
        }
        
        this.audioMetadata = {
          bitrate: parseInt(String(audioStream.bit_rate || '128000')) / 1000,
          sampleRate: parseInt(String(audioStream.sample_rate || '44100')),
          channels: audioStream.channels || 2,
          duration: parseFloat(String(metadata.format.duration || '0')),
          fileSize: parseInt(String(metadata.format.size || '0'))
        };
        
        console.log(`✅ 메타데이터 추출 완료:`);
        console.log(`   - 비트레이트: ${this.audioMetadata.bitrate}kbps`);  
        console.log(`   - 샘플레이트: ${this.audioMetadata.sampleRate}Hz ⚠️`);
        console.log(`   - 채널: ${this.audioMetadata.channels}개`);
        console.log(`   - 재생 시간: ${(this.audioMetadata.duration / 60).toFixed(1)}분`);
        
        resolve();
      });
    });
  }

  private async decodeMp3ToPcm(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      console.log("🔧 MP3를 PCM으로 디코딩 중...");
      
      const pcmChunks: Buffer[] = [];
      
      ffmpeg(this.musicFilePath)
        .audioCodec('pcm_s16le')
        .audioChannels(2)
        .audioFrequency(48000) // AudioContext 표준 샘플레이트로 통일
        .format('s16le')
        .on('start', (commandLine) => {
          console.log('🎵 FFmpeg 명령어:', commandLine);
        })
        .on('progress', (progress) => {
          // 진행률 로그 제거 (성능 향상)
          // if (progress.percent) {
          //   console.log(`🔧 디코딩 진행률: ${progress.percent.toFixed(1)}%`);
          // }
        })
        .on('end', () => {
          this.pcmBuffer = Buffer.concat(pcmChunks);
          console.log(`✅ PCM 디코딩 완료: ${(this.pcmBuffer.length / 1024 / 1024).toFixed(2)}MB`);
          resolve();
        })
        .on('error', (err) => {
          reject(new Error(`PCM 디코딩 실패: ${err.message}`));
        })
        .pipe()
        .on('data', (chunk: Buffer) => {
          pcmChunks.push(chunk);
        });
    });
  }

  private async splitPcmIntoChunks(): Promise<void> {
    console.log("🔧 PCM을 40ms 청크로 분할 중...");
    
    if (!this.pcmBuffer) {
      throw new Error("PCM 버퍼가 없습니다");
    }
    
    // 🔧 40ms 청크로 증가 (더 부드러운 재생)
    const sampleRate = 48000;
    const chunkSize = Math.floor(sampleRate * 0.04 * 2 * 2); // 40ms PCM 데이터 크기 = 15360 bytes
    const totalChunks = Math.ceil(this.pcmBuffer.length / chunkSize);
    
    console.log(`📊 PCM 청크 분할 정보:`);
    console.log(`   - PCM 버퍼 크기: ${(this.pcmBuffer.length / 1024 / 1024).toFixed(2)}MB`);
    console.log(`   - 40ms 청크 크기: ${chunkSize} bytes`);
    console.log(`   - 총 청크 수: ${totalChunks}개`);
    
    this.pcmChunks = [];
    
    for (let offset = 0; offset < this.pcmBuffer.length; offset += chunkSize) {
      let chunk = this.pcmBuffer.slice(offset, offset + chunkSize);
      
      // 마지막 청크가 작으면 0으로 패딩
      if (chunk.length < chunkSize) {
        const paddedChunk = Buffer.alloc(chunkSize);
        chunk.copy(paddedChunk);
        chunk = paddedChunk;
      }
      
      this.pcmChunks.push(chunk);
      
      // 진행률 표시 (2500개 청크마다)
      if ((this.pcmChunks.length % 2500) === 0) {
        const progress = (this.pcmChunks.length / totalChunks * 100).toFixed(1);
        console.log(`🔧 PCM 분할 진행률: ${progress}% (${this.pcmChunks.length}/${totalChunks})`);
      }
    }
    
    console.log(`✅ PCM 청크 분할 완료: ${this.pcmChunks.length}개 청크`);
    console.log(`   - 총 크기: ${(this.pcmBuffer.length / 1024).toFixed(2)}KB`);
    console.log(`   - 평균 청크 크기: ${(this.pcmBuffer.length / this.pcmChunks.length).toFixed(0)} bytes`);
  }

  private async streamPcmChunks(): Promise<void> {
    console.log("🎵 40ms Raw PCM 청크 스트리밍 시작...");
    
    if (this.pcmChunks.length === 0) {
      throw new Error("PCM 청크가 없습니다");
    }
    
    // 🔧 전송 간격을 청크 길이와 정확히 맞춤
    const sendIntervalMs = 40; // 40ms 간격으로 전송 (청크 길이와 동일)
    
    console.log(`🎵 스트리밍 설정:`);
    console.log(`   - 총 청크: ${this.pcmChunks.length}개`);
    console.log(`   - 청크 길이: 40ms`);
    console.log(`   - 전송 간격: ${sendIntervalMs}ms (정확히 맞춤)`);
    console.log(`   - 포맷: Raw PCM (지직거림 개선)`);
    
    let chunkIndex = 0;
    let globalSequence = 0;
    let loopCount = 0;
    const startTime = Date.now();

    this.streamInterval = setInterval(() => {
      if (chunkIndex >= this.pcmChunks.length) {
        chunkIndex = 0;
        loopCount++;
        console.log(`🔄 음악 반복 재생 시작 (${loopCount}번째)`);
      }

      const pcmChunk = this.pcmChunks[chunkIndex];
      const base64PcmData = pcmChunk.toString('base64');

      // Raw PCM 스트림 전송
      if (this.socket && this.targetChannelId) {
        this.socket.emit("voice-stream", {
          channelId: this.targetChannelId,
          audioData: base64PcmData,
          audioFormat: "pcm",
          timestamp: Date.now(),
          sequence: globalSequence,
          sampleRate: 48000,
          channels: 2,
          chunkDuration: 40 // 🔧 40ms로 변경
        } as VoiceStreamData);
      }

      // 진행 상황 표시 (1000개 청크마다)
      if (chunkIndex % 1000 === 0) {
        const progress = ((chunkIndex / this.pcmChunks.length) * 100).toFixed(1);
        const elapsedSeconds = (Date.now() - startTime) / 1000;
        console.log(
          `🎵 PCM 청크: ${progress}% (${chunkIndex}/${this.pcmChunks.length}) | 경과: ${elapsedSeconds.toFixed(1)}초 [반복: ${loopCount}회]`
        );
      }

      chunkIndex++;
      globalSequence++;
    }, sendIntervalMs);
    
    console.log("🔄 개선된 PCM 청크 스트리밍 모드 - 지직거림 감소");
  }

  cleanup(): void {
    console.log("🧹 정리 중...");

    if (this.streamInterval) {
      clearInterval(this.streamInterval);
      this.streamInterval = null;
      console.log("🔄 스트리밍 중단됨");
    }

    if (this.socket) {
      if (this.targetChannelId) {
        this.socket.emit("leave-voice-channel");
      }
      
      // SFU 정리
      if (this.useSFUMode && this.sfuConnected) {
        console.log("🧹 SFU 연결 정리 중...");
        this.producerId = null;
        this.sendTransportId = null;
        this.recvTransportId = null;
        this.sfuConnected = false;
      }
      
      this.socket.disconnect();
    }

    console.log(`✅ 봇 종료 완료 (${this.useSFUMode ? 'SFU' : 'Legacy'} 모드)`);
    process.exit(0);
  }
}

// 봇 실행
const bot = new VoiceTestBot();

// 프로세스 종료 시 정리
process.on("SIGINT", () => {
  console.log("\n⚡ 강제 종료 감지");
  bot.cleanup();
});

process.on("SIGTERM", () => {
  console.log("\n⚡ 프로세스 종료 요청");
  bot.cleanup();
});

// 에러 핸들링
process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ 처리되지 않은 Promise 거부:", reason);
  bot.cleanup();
});

process.on("uncaughtException", (error) => {
  console.error("❌ 처리되지 않은 예외:", error);
  bot.cleanup();
});

// 봇 시작
bot.start().catch((error) => {
  console.error("❌ 봇 시작 실패:", error);
  process.exit(1);
});
