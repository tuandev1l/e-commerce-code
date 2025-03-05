import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class DeleteProductDto {
  @IsNotEmpty()
  @IsString()
  id: string;

  @IsOptional()
  @Type(() => User)
  user?: User;
}
