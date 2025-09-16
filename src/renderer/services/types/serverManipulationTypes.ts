import { TextChannel, VoiceChannel } from "./serverDataTypes";

export interface CreateCommunityRequest {
  name: string;
}
export interface CreateVoiceChannelRequest {
  name: string;
  communityId: number;
  description?: string;
  maxUsers?: number;
}

export type ChannelType = "text" | "voice";



// 채널 생성 시 타입 선택
export interface CreateChannelRequest {
  name: string;
  communityId: number;
  type: ChannelType;
  description?: string;
  maxUsers?: number;
}
export interface SendMessageRequest {
  content: string;
}

export type CommunityErrorCode = "NotExisted" | "Invalid";
export type ChannelErrorCode = "NotExisted" | "Invalid";

export interface T3Error {
  msg: string;
  code: ChannelErrorCode | CommunityErrorCode;
}
