import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateBrandWithoutId } from '@libs/product/dto/brand/update-brand-wid.dto';

export class UpdateBrandDto extends UpdateBrandWithoutId {
  @IsNotEmpty()
  @IsString()
  brandId: string;
}
