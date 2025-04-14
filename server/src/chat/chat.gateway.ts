import {
  ConnectedSocket,
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
// chat.gateway.ts

@WebSocketGateway({ cors: true })
export class ChatGateway {
  @WebSocketServer()
  server: Server; // ⬅ socket.io 서버 인스턴스

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() data: any, @ConnectedSocket() client: Socket) {
    this.server.emit('message', {
      user: client.id,
      text: data.text,
    });
  }
}
