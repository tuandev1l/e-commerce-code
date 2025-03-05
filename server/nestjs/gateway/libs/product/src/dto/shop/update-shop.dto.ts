import { IsNotEmpty, IsString } from 'class-validator';
import { IShopAddress } from '@libs/product/interfaces';

export class UpdateShopDto {
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

  @IsNotEmpty()
  @IsString()
  shopId: string;
}
