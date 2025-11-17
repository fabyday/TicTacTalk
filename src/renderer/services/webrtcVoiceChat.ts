// import { io, Socket } from "socket.io-client";
// import { apiService } from "./api";

// export interface VoiceActivityData {
//   userId: number;
//   channelId: number;
//   isActive: boolean;
//   timestamp: number;
// }

// export interface WebRTCSignalData {
//   type: 'offer' | 'answer' | 'ice-candidate';
//   fromUserId: number;
//   toUserId: number;
//   data: any;
//   channelId: number;
// }

// export interface VoiceChannelEventData {
//   channelId: number;
//   participantCount: number;
//   participants?: Array<{ userId: number; username: string }>;
// }

// // 🎤 WebRTC 피어 연결 관리
// interface PeerConnection {
//   userId: number;
//   connection: RTCPeerConnection;
//   stream: MediaStream | null;
//   audioElement: HTMLAudioElement | null;
//   isConnected: boolean;
// }

// class WebRTCVoiceChatService {
//   private socket: Socket | null = null;
//   private currentChannelId: number | null = null;
//   private localStream: MediaStream | null = null;
//   private isMuted = false;
  
//   // WebRTC 설정
//   private iceServers = [
//     { urls: 'stun:stun.l.google.com:19302' },
//     { urls: 'stun:stun1.l.google.com:19302' },
//   ];
  
//   // 피어 연결 관리
//   private peerConnections: Map<number, PeerConnection> = new Map();
//   private currentUserId: number | null = null;
  
//   // 콜백
//   private voiceActivityCallbacks: ((data: VoiceActivityData) => void)[] = [];
//   private channelUpdateCallbacks: ((data: VoiceChannelEventData) => void)[] = [];

//   async connect(serverUrl: string): Promise<void> {
//     return new Promise((resolve, reject) => {
//       try {
//         const token = apiService.getAccessToken();
//         if (!token) {
//           reject(new Error("인증 토큰이 없습니다. 먼저 로그인하세요."));
//           return;
//         }

//         this.socket = io(serverUrl, {
//           transports: ["websocket"],
//           autoConnect: true,
//           auth: { token },
//         });

//         this.socket.on("connect", () => {
//           console.log("🎤 WebRTC 음성 채팅 서버에 연결됨");
//           this.setupEventListeners();
//           resolve();
//         });

//         this.socket.on("connect_error", (error) => {
//           console.error("🎤 WebRTC 음성 채팅 서버 연결 실패:", error);
//           reject(error);
//         });

//         this.socket.on("disconnect", () => {
//           console.log("🎤 WebRTC 음성 채팅 서버와 연결 끊김");
//           this.cleanup();
//         });
//       } catch (error) {
//         reject(error);
//       }
//     });
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;

//     // WebRTC 시그널링
//     this.socket.on("webrtc-signal", (data: WebRTCSignalData) => {
//       this.handleSignaling(data);
//     });

//     // 사용자 참가/나가기
//     this.socket.on("user-joined", (data: any) => {
//       console.log("🎤 사용자 참가:", data);
//       if (data.userId !== this.currentUserId) {
//         this.createPeerConnection(data.userId);
//       }
//     });

//     this.socket.on("user-left", (data: any) => {
//       console.log("🎤 사용자 나감:", data);
//       this.removePeerConnection(data.userId);
//     });

//     // 채널 업데이트
//     this.socket.on("voice-channel-updated", (data: VoiceChannelEventData) => {
//       console.log("🎤 채널 업데이트:", data);
//       this.channelUpdateCallbacks.forEach((callback) => callback(data));
//     });

//     // 현재 사용자 ID 받기
//     this.socket.on("user-id", (userId: number) => {
//       this.currentUserId = userId;
//       console.log("🎤 현재 사용자 ID:", userId);
//     });
//   }

//   async joinVoiceChannel(channelId: number, communityId: number): Promise<boolean> {
//     if (!this.socket) {
//       throw new Error("Socket not connected");
//     }

//     try {
//       // 마이크 권한 및 로컬 스트림 설정
//       await this.setupLocalStream();

//       // 서버에 채널 참가 요청
//       const result = await this.emitWithResponse("join-voice-channel", {
//         channelId,
//         communityId,
//       });

//       if (result.success) {
//         this.currentChannelId = channelId;
//         console.log("🎤 WebRTC 음성 채널 참가 성공:", channelId);
        
//         // 기존 참가자들과 연결 생성
//         if (result.participants) {
//           for (const participant of result.participants) {
//             if (participant.userId !== this.currentUserId) {
//               await this.createPeerConnection(participant.userId, true); // offer 생성
//             }
//           }
//         }
        
//         return true;
//       } else {
//         console.error("🎤 WebRTC 음성 채널 참가 실패:", result.message);
//         return false;
//       }
//     } catch (error) {
//       console.error("🎤 WebRTC 음성 채널 참가 오류:", error);
//       return false;
//     }
//   }

//   async leaveVoiceChannel(): Promise<void> {
//     if (!this.socket || !this.currentChannelId) return;

//     try {
//       // 모든 피어 연결 정리
//       for (const [userId, peer] of this.peerConnections) {
//         this.removePeerConnection(userId);
//       }

//       await this.emitWithResponse("leave-voice-channel", {});
//       this.cleanup();
//       this.currentChannelId = null;
//       console.log("🎤 WebRTC 음성 채널 나감");
//     } catch (error) {
//       console.error("🎤 WebRTC 음성 채널 나가기 오류:", error);
//     }
//   }

//   private async setupLocalStream(): Promise<void> {
//     try {
//       this.localStream = await navigator.mediaDevices.getUserMedia({
//         audio: {
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true,
//           channelCount: 1,
//           sampleRate: 48000,
//         },
//         video: false,
//       });

//       console.log("🎤 WebRTC 로컬 스트림 설정 완료");
//     } catch (error) {
//       console.error("🎤 WebRTC 마이크 권한 요청 실패:", error);
//       throw error;
//     }
//   }

//   private async createPeerConnection(userId: number, createOffer: boolean = false): Promise<void> {
//     if (this.peerConnections.has(userId)) return;

//     const connection = new RTCPeerConnection({
//       iceServers: this.iceServers,
//     });

//     const peer: PeerConnection = {
//       userId,
//       connection,
//       stream: null,
//       audioElement: null,
//       isConnected: false,
//     };

//     // 로컬 스트림 추가
//     if (this.localStream) {
//       this.localStream.getTracks().forEach((track) => {
//         connection.addTrack(track, this.localStream!);
//       });
//     }

//     // 원격 스트림 수신
//     connection.ontrack = (event) => {
//       console.log("🎤 원격 스트림 수신:", userId);
//       peer.stream = event.streams[0];
//       this.playRemoteStream(peer);
//     };

//     // ICE 후보 처리
//     connection.onicecandidate = (event) => {
//       if (event.candidate) {
//         this.sendSignal({
//           type: 'ice-candidate',
//           fromUserId: this.currentUserId!,
//           toUserId: userId,
//           data: event.candidate,
//           channelId: this.currentChannelId!,
//         });
//       }
//     };

//     // 연결 상태 모니터링
//     connection.onconnectionstatechange = () => {
//       console.log(`🎤 연결 상태 변경 (${userId}):`, connection.connectionState);
//       peer.isConnected = connection.connectionState === 'connected';
      
//       if (connection.connectionState === 'failed') {
//         console.error(`🎤 연결 실패 (${userId}), 재시도 중...`);
//         this.removePeerConnection(userId);
//         setTimeout(() => this.createPeerConnection(userId, createOffer), 1000);
//       }
//     };

//     this.peerConnections.set(userId, peer);

//     // Offer 생성 (기존 참가자에게 연결할 때)
//     if (createOffer) {
//       try {
//         const offer = await connection.createOffer();
//         await connection.setLocalDescription(offer);
        
//         this.sendSignal({
//           type: 'offer',
//           fromUserId: this.currentUserId!,
//           toUserId: userId,
//           data: offer,
//           channelId: this.currentChannelId!,
//         });
//       } catch (error) {
//         console.error(`🎤 Offer 생성 실패 (${userId}):`, error);
//       }
//     }
//   }

//   private async handleSignaling(signal: WebRTCSignalData): Promise<void> {
//     const peer = this.peerConnections.get(signal.fromUserId);
    
//     if (!peer) {
//       // 새로운 피어 연결 생성
//       await this.createPeerConnection(signal.fromUserId);
//       return this.handleSignaling(signal); // 재귀 호출
//     }

//     try {
//       switch (signal.type) {
//         case 'offer':
//           await peer.connection.setRemoteDescription(signal.data);
//           const answer = await peer.connection.createAnswer();
//           await peer.connection.setLocalDescription(answer);
          
//           this.sendSignal({
//             type: 'answer',
//             fromUserId: this.currentUserId!,
//             toUserId: signal.fromUserId,
//             data: answer,
//             channelId: this.currentChannelId!,
//           });
//           break;

//         case 'answer':
//           await peer.connection.setRemoteDescription(signal.data);
//           break;

//         case 'ice-candidate':
//           await peer.connection.addIceCandidate(signal.data);
//           break;
//       }
//     } catch (error) {
//       console.error("🎤 WebRTC 시그널링 처리 오류:", error);
//     }
//   }

//   private playRemoteStream(peer: PeerConnection): void {
//     if (!peer.stream) return;

//     // 오디오 엘리먼트 생성 및 재생
//     peer.audioElement = new Audio();
//     peer.audioElement.srcObject = peer.stream;
//     peer.audioElement.autoplay = true;
    
//     // 음성 활동 감지 (간단한 버전)
//     const audioContext = new AudioContext();
//     const source = audioContext.createMediaStreamSource(peer.stream);
//     const analyser = audioContext.createAnalyser();
//     source.connect(analyser);
    
//     const detectActivity = () => {
//       const dataArray = new Uint8Array(analyser.frequencyBinCount);
//       analyser.getByteFrequencyData(dataArray);
//       const average = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;
      
//       const isActive = average > 10; // 임계값
//       this.triggerVoiceActivity(peer.userId, isActive);
      
//       if (peer.isConnected) {
//         requestAnimationFrame(detectActivity);
//       }
//     };
    
//     detectActivity();
    
//     console.log(`🎤 원격 스트림 재생 시작 (${peer.userId})`);
//   }

//   private sendSignal(signal: WebRTCSignalData): void {
//     if (this.socket) {
//       this.socket.emit("webrtc-signal", signal);
//     }
//   }

//   private removePeerConnection(userId: number): void {
//     const peer = this.peerConnections.get(userId);
//     if (peer) {
//       peer.connection.close();
//       if (peer.audioElement) {
//         peer.audioElement.pause();
//         peer.audioElement.srcObject = null;
//       }
//       this.peerConnections.delete(userId);
//       console.log(`🎤 피어 연결 제거 (${userId})`);
//     }
//   }

//   private triggerVoiceActivity(userId: number, isActive: boolean): void {
//     const activityData: VoiceActivityData = {
//       userId,
//       channelId: this.currentChannelId || 0,
//       isActive,
//       timestamp: Date.now(),
//     };

//     this.voiceActivityCallbacks.forEach((callback) => {
//       try {
//         callback(activityData);
//       } catch (error) {
//         console.error("🎤 음성 활동 콜백 오류:", error);
//       }
//     });
//   }

//   private emitWithResponse(event: string, data: any): Promise<any> {
//     return new Promise((resolve) => {
//       if (!this.socket) {
//         resolve({ success: false, message: "Socket not connected" });
//         return;
//       }

//       this.socket.emit(event, data, (response: any) => {
//         resolve(response);
//       });
//     });
//   }

//   private cleanup(): void {
//     // 모든 피어 연결 정리
//     for (const [userId, peer] of this.peerConnections) {
//       this.removePeerConnection(userId);
//     }

//     // 로컬 스트림 정리
//     if (this.localStream) {
//       this.localStream.getTracks().forEach((track) => track.stop());
//       this.localStream = null;
//     }
//   }

//   // 음소거 토글
//   toggleMute(): boolean {
//     this.isMuted = !this.isMuted;
    
//     if (this.localStream) {
//       this.localStream.getAudioTracks().forEach((track) => {
//         track.enabled = !this.isMuted;
//       });
//     }
    
//     console.log("🎤 음소거:", this.isMuted);
//     return this.isMuted;
//   }

//   // 상태 확인 메서드들
//   isConnected(): boolean {
//     return this.socket?.connected || false;
//   }

//   isInVoiceChannel(): boolean {
//     return this.currentChannelId !== null;
//   }

//   getCurrentChannelId(): number | null {
//     return this.currentChannelId;
//   }

//   isMutedState(): boolean {
//     return this.isMuted;
//   }

//   getConnectedPeers(): number[] {
//     return Array.from(this.peerConnections.keys()).filter(
//       userId => this.peerConnections.get(userId)?.isConnected
//     );
//   }

//   // 사용자별 볼륨 조절 (WebRTC 방식)
//   updateUserVolume(userId: number, volume: number): void {
//     const peer = this.peerConnections.get(userId);
//     if (peer && peer.audioElement) {
//       peer.audioElement.volume = volume / 100; // 0.0 ~ 1.0 범위로 변환
//       console.log(`🎤 사용자 ${userId} 볼륨 조절: ${volume}%`);
//     }
//   }

//   // 이벤트 리스너 등록
//   onVoiceActivity(callback: (data: VoiceActivityData) => void): void {
//     this.voiceActivityCallbacks.push(callback);
//   }

//   onChannelUpdate(callback: (data: VoiceChannelEventData) => void): void {
//     this.channelUpdateCallbacks.push(callback);
//   }

//   disconnect(): void {
//     if (this.socket) {
//       this.socket.disconnect();
//       this.socket = null;
//     }
//     this.cleanup();
//     this.currentChannelId = null;
//     console.log("🎤 WebRTC 음성 채팅 서비스 연결 해제");
//   }
// }

// export const webrtcVoiceChatService = new WebRTCVoiceChatService(); 