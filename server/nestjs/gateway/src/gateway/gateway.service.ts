import { Inject, Injectable } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class GatewayService {
  constructor(@Inject('RABBITMQ_PRODUCER') private producer: ClientProxy) {}

  // create(createGatewayDto: CreateGatewayDto) {
  //   return 'This action adds a new gateway';
  // }

  findAllProduct() {
    console.log('producer sent');
    return this.producer.send('findAllProduct', 'Hello World!');
  }

  findOne(id: number) {
    return `This action returns a #${id} gateway`;
  }

  // update(id: number, updateGatewayDto: UpdateGatewayDto) {
  //   return `This action updates a #${id} gateway`;
  // }

  remove(id: number) {
    return `This action removes a #${id} gateway`;
  }
}
