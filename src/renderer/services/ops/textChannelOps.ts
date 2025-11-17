import { T3Server } from "../ttapi";
import { Message, SendMessageRequest, TextChannel } from "../types";

export class T3TextChannelOp {
  m_server: T3Server;
  m_textChannelInfo: TextChannel;
  constructor(server: T3Server, textChannel: TextChannel) {
    this.m_server = server;
    this.m_textChannelInfo = textChannel;
  }
  async sendMessage(data: SendMessageRequest): Promise<Message> {
    return this.m_server.request(
      `/text-channel/${this.m_textChannelInfo.id}/messages`,
      {
        method: "POST",
        body: JSON.stringify(data),
      }
    );
  }

  async markChannelAsRead(): Promise<void> {
    return this.m_server.request(
      `/text-channel/${this.m_textChannelInfo.id}/read`,
      {
        method: "POST",
      }
    );
  }

  async getChannelMessages(
    skip: number = 0,
    take: number = 50
  ): Promise<Message[]> {
    return this.m_server.request(
      `/text-channel/${this.m_textChannelInfo.id}/messages?skip=${skip}&take=${take}`,
      {
        method: "GET",
      }
    );
  }
}
