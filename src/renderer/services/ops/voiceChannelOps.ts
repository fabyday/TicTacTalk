import { T3Server } from "../ttapi";
import { VoiceChannel } from "../types/serverDataTypes";

export class T3VoiceChannelOp {
  m_server: T3Server;
  m_voiceChannelInfo: VoiceChannel;
  constructor(server: T3Server, voicechannel: VoiceChannel) {
    this.m_server = server;
    this.m_voiceChannelInfo = voicechannel;
  }

  async join() {}
}
