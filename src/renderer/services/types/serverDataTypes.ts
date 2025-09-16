import { Transport } from "mediasoup-client/lib/Transport";
import { Consumer, Producer } from "mediasoup-client/lib/types";

export interface UserProfile {
  userId: string;
  username: string;
}

/**
 * this is alias
 */
type userId = string;

export interface VoiceRoomConnection {
  roomId: string;
  sendTransport: Transport;
  recvTransport: Transport;
  producer: Producer;
  consumers: Map<userId, Consumer>;
}


// 커뮤니티 관련 인터페이스
export interface Community {
  id: number;
  name: string;
  ownerId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Membership {
  id: number;
  userId: number;
  communityId: number;
  role: "OWNER" | "ADMIN" | "MEMBER";
  community: Community;
}

export interface PublicCommunity {
  id: number;
  name: string;
  memberCount: number;
  owner: {
    id: number;
    username: string;
  };
  createdAt: string;
  isJoined?: boolean; // 가입 여부 (선택적)
}


// 텍스트 채널 관련 인터페이스
export interface TextChannel {
  id: number;
  name: string;
  communityId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTextChannelRequest {
  name: string;
  communityId: number;
  categoryId?: number;
}

// 보이스 채널 관련 인터페이스
export interface VoiceChannel {
  id: number;
  name: string;
  communityId: number;
  participantCount: number;
  createdAt?: string;
  updatedAt?: string;
}


export interface Message {
  id: number;
  content: string;
  textChannelId: number;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: number;
    username: string;
  };
}


