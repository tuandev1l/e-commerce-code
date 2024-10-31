import { BulkCreateOrderDtoWithoutUser } from '@libs/order/dto/withoutUser/bulkCreateOrder.dto';
import { IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class BulkCreateOrderDto extends BulkCreateOrderDtoWithoutUser {
  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
