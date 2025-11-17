import { T3Server } from "../ttapi";
import { Community, Message, TextChannel, VoiceChannel } from "../types";
import {
  ChannelType,
  SendMessageRequest,
} from "../types/serverManipulationTypes";
import { T3TextChannelOp } from "./textChannelOps";
import { T3VoiceChannelOp } from "./voiceChannelOps";

interface ChannelTypeMap {
  text: T3TextChannelOp;
  voice: T3VoiceChannelOp;
}

/**
 * Manipulation
 */
export class T3CommunityOp {
  m_server: T3Server;
  m_communityInfo: Community;
  constructor(server: T3Server, community: Community) {
    this.m_server = server;
    this.m_communityInfo = community;
  }

  async getVoiceChannelList(): Promise<VoiceChannel[]> {
    return this.m_server.request(
      `/voicechat/channels/community/${this.m_communityInfo.id}`,
      {
        method: "GET",
      }
    );
  }
  async getTextChannelList(): Promise<TextChannel[]> {
    return this.m_server.request(
      `/text-channel/community/${this.m_communityInfo.id}`,
      {
        method: "GET",
      }
    );
  }

  async deleteChannel(channelId: number | T3TextChannelOp): Promise<void> {
    const response = await this.m_server.request(
      `/voicechat/channels/${
        typeof channelId === "number"
          ? channelId
          : channelId.m_textChannelInfo.id
      }`,
      {
        method: "DELETE",
      }
    );

    if (!response.success) {
      throw new Error(response.message || "Failed to delete voice channel");
    }
  }

  /**
   *
   * @param channelName
   * @param channelType
   * @param maxUsers
   * @param description
   * @returns
   */
  async createChannel<T extends ChannelType>(
    channelName: string,
    channelType: T,
    maxUsers: number,
    description?: string
  ): Promise<ChannelTypeMap[T]> {
    if (channelType === "text") {
      return new T3TextChannelOp(
        this.m_server,
        await this.m_server.request("/text-channel", {
          method: "POST",
          body: JSON.stringify({
            name: channelName,
            communityId: this.m_communityInfo.id,
          }),
        })
      ) as ChannelTypeMap[T];
    } else {
      return new T3VoiceChannelOp(
        this.m_server,
        await this.m_server.request("/voicechat/channels", {
          method: "POST",
          body: JSON.stringify({
            name: channelName,
            communityId: this.m_communityInfo.id,
            description: description,
            maxUsers: maxUsers,
          }),
        })
      ) as ChannelTypeMap[T];
    }
  }
}
