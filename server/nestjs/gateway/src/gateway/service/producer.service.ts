import { Global, Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Global()
@Injectable()
export class ProducerService {
  constructor(@Inject('RABBITMQ_PRODUCER') private producer: ClientProxy) {}

  async sendMessage(pattern: string, data: unknown = '') {
    return this.producer.send(pattern, data);
  }
}
