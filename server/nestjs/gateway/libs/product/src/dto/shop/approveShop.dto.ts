import { IsNotEmpty, IsString } from 'class-validator';

export class ApproveShopDto {
  @IsNotEmpty()
  @IsString()
  shopId: string;
}
