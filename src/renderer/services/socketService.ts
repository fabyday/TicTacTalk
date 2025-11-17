// import { io, Socket } from "socket.io-client";
// import { Message } from "./api";

// type MessageHandler = (message: Message) => void;
// type TypingHandler = (data: { userId: number; channelId: number }) => void;
// type ErrorHandler = (error: any) => void;

// class SocketService {
//   private socket: Socket | null = null;
//   private messageHandlers: MessageHandler[] = [];
//   private typingHandlers: TypingHandler[] = [];
//   private errorHandlers: ErrorHandler[] = [];
//   private currentChannelId: number | null = null;

//   connect(serverUrl: string, accessToken: string) {
//     if (this.socket?.connected) {
//       console.log("🔌 이미 WebSocket에 연결되어 있습니다.");
//       return;
//     }

//     console.log("🔌 WebSocket 연결 시도:", serverUrl);

//     this.socket = io(serverUrl, {
//       auth: {
//         token: accessToken,
//       },
//       transports: ["websocket", "polling"],
//     });

//     this.setupEventListeners();
//   }

//   private setupEventListeners() {
//     if (!this.socket) return;

//     this.socket.on("connect", () => {
//       console.log("✅ WebSocket 연결 성공! Socket ID:", this.socket?.id);
//     });

//     this.socket.on("disconnect", (reason: string) => {
//       console.log("❌ WebSocket 연결 해제:", reason);
//     });

//     this.socket.on("newMessage", (message: Message) => {
//       console.log("📨 새 메시지 수신:", message);
//       this.messageHandlers.forEach((handler) => handler(message));
//     });

//     this.socket.on(
//       "userTyping",
//       (data: { userId: number; channelId: number }) => {
//         console.log("⌨️ 타이핑 감지:", data);
//         this.typingHandlers.forEach((handler) => handler(data));
//       }
//     );

//     this.socket.on("joinedChannel", (channelId: number) => {
//       console.log(`✅ 채널 ${channelId} 참가 완료`);
//     });

//     this.socket.on("error", (error: any) => {
//       console.error("🚨 WebSocket 에러:", error);
//       this.errorHandlers.forEach((handler) => handler(error));
//     });
//   }

//   disconnect() {
//     if (this.socket) {
//       console.log("🔌 WebSocket 연결 해제");
//       this.socket.disconnect();
//       this.socket = null;
//       this.currentChannelId = null;
//     }
//   }

//   joinChannel(channelId: number) {
//     if (!this.socket?.connected) {
//       console.warn("⚠️ WebSocket이 연결되지 않았습니다.");
//       return;
//     }

//     // 이전 채널에서 나가기
//     if (this.currentChannelId && this.currentChannelId !== channelId) {
//       this.socket.emit("leaveChannel", this.currentChannelId);
//     }

//     console.log(`🚪 채널 ${channelId} 참가 시도`);
//     this.socket.emit("joinChannel", channelId);
//     this.currentChannelId = channelId;
//   }

//   leaveChannel(channelId: number) {
//     if (!this.socket?.connected) return;

//     console.log(`🚪 채널 ${channelId} 나가기`);
//     this.socket.emit("leaveChannel", channelId);

//     if (this.currentChannelId === channelId) {
//       this.currentChannelId = null;
//     }
//   }

//   sendMessage(channelId: number, content: string) {
//     if (!this.socket?.connected) {
//       console.warn("⚠️ WebSocket이 연결되지 않았습니다.");
//       return false;
//     }

//     console.log(`📤 WebSocket으로 메시지 전송:`, { channelId, content });
//     this.socket.emit("sendMessage", {
//       channelId,
//       content,
//     });
//     return true;
//   }

//   sendTyping(channelId: number) {
//     if (!this.socket?.connected) return;

//     this.socket.emit("typing", channelId);
//   }

//   // 이벤트 핸들러 등록
//   onNewMessage(handler: MessageHandler) {
//     this.messageHandlers.push(handler);
//   }

//   onTyping(handler: TypingHandler) {
//     this.typingHandlers.push(handler);
//   }

//   onError(handler: ErrorHandler) {
//     this.errorHandlers.push(handler);
//   }

//   // 이벤트 핸들러 제거
//   removeMessageHandler(handler: MessageHandler) {
//     const index = this.messageHandlers.indexOf(handler);
//     if (index > -1) {
//       this.messageHandlers.splice(index, 1);
//     }
//   }

//   removeTypingHandler(handler: TypingHandler) {
//     const index = this.typingHandlers.indexOf(handler);
//     if (index > -1) {
//       this.typingHandlers.splice(index, 1);
//     }
//   }

//   removeErrorHandler(handler: ErrorHandler) {
//     const index = this.errorHandlers.indexOf(handler);
//     if (index > -1) {
//       this.errorHandlers.splice(index, 1);
//     }
//   }

//   isConnected(): boolean {
//     return this.socket?.connected || false;
//   }

//   getCurrentChannelId(): number | null {
//     return this.currentChannelId;
//   }
// }

// export const socketService = new SocketService();
