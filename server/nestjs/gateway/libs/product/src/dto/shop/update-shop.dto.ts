import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateShopDtoWithoutId } from '@libs/product/dto/shop/update-shop-wid.dto';

export class UpdateShopDto extends UpdateShopDtoWithoutId {
  @IsNotEmpty()
  @IsString()
  shopId: string;
}
