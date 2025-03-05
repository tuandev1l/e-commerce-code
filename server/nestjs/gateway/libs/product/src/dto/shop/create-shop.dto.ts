import { IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { IUserAddress } from '@share/interfaces';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNotEmpty()
  address: IUserAddress;

  @IsNotEmpty()
  @Type(() => User)
  user?: User;
}
