import { Module } from '@nestjs/common';
import { EventGateway } from './event.gateway';

@Module({
  imports: [],
  providers: [EventGateway],
})
export class SocketGatewayModule {}
