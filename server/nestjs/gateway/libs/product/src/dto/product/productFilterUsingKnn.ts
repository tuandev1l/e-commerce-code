import { SearchType } from '@libs/searching/searchType.enum';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { ProductFilterDto } from '@libs/product/dto/product/productFilter.dto';

export class ProductFilterUsingKnn extends ProductFilterDto {
  @IsNotEmpty()
  @IsEnum(SearchType)
  type: SearchType;
}
