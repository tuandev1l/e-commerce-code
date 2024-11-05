import { IShopAddress } from '@libs/product/interfaces';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateShopDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  logo: string;

  @IsNotEmpty()
  @IsString()
  telephone: string;

  @IsNotEmpty()
  @IsString()
  url: string;

  @IsNotEmpty()
  address: IShopAddress;
}
