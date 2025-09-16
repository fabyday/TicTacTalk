import { io, Socket } from "socket.io-client";
import { LoginResponse, RegisterResponse } from "./authTypes";
import {
  Community,
  CreateTextChannelRequest,
  Message,
  TextChannel,
  UserProfile,
  VoiceChannel,
} from "./serverDataTypes";
import type { EventsMap } from "@socket.io/component-emitter";
import { CreateChannelRequest } from "./serverManipulationTypes";

export interface TTTSockListenEvents extends EventsMap {
  lis: () => void;
}

export interface TTTSockEmitEvents {
  test: () => void;
  q: () => void;
}

export type TTTSock = Socket<TTTSockListenEvents, TTTSockEmitEvents>;

export interface VoiceChatConnection {}

interface IT3TextChannelResponseMap {
  "/text-channel": TextChannel;
  [
    key: `/text-channel/${string}/messages?skip=${string}&take=${string}`
  ]: Message[];
  [key: `/text-channel/${string}/messages`]: Message;
  [key: `/text-channel/${string}/read`]: void;
}
interface IT3CommunityResponseMap {
  "/chat/community": Community;
}
interface IT3AuthResponseMap {
  "/auth/login": LoginResponse;
  "/auth/register": RegisterResponse;
  "/auth/profile": UserProfile;
}
interface IT3VoiceChatResponseMap {
  "/voicechat/channels": VoiceChannel;
}

export interface ApiResponseMap
  extends IT3TextChannelResponseMap,
    IT3CommunityResponseMap,
    IT3AuthResponseMap,
    IT3VoiceChatResponseMap {
  "/users": { id: string; name: string }[];
  "/posts": { id: number; title: string }[];

  [key: `/user/${string}`]: UserProfile;
}

export interface ApiError {
  message: string;
  statusCode: number;
}
