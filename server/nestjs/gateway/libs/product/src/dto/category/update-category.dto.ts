import { IsNotEmpty, IsString } from 'class-validator';
import { UpdateCategoryDtoWithoutId } from '@libs/product/dto/category/update-category-wid.dto';

export class UpdateCategoryDto extends UpdateCategoryDtoWithoutId {
  @IsNotEmpty()
  @IsString()
  categoryId: string;
}
