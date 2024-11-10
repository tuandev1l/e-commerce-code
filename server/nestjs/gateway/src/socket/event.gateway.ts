import {
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Injectable } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: true,
})
@Injectable()
export class EventGateway {
  @WebSocketServer()
  server: Server;

  constructor() {}

  @SubscribeMessage('message')
  async handleMessage(client: Socket, data: any) {}
}
