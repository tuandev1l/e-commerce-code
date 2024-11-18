import { ProductFilterDto } from '@libs/product/dto/product/withoutUser/productFilter.dto';
import { SearchType } from '@libs/searching/searchType.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class ProductFilterUsingKnn extends ProductFilterDto {
  @IsNotEmpty()
  @IsEnum(SearchType)
  type: SearchType;
}
