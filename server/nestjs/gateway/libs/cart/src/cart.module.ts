import { Module } from '@nestjs/common';
import { CartService } from '@libs/cart/cart.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Cart } from '@libs/cart/entity/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Cart])],
  providers: [CartService],
})
export class CartModule {}
