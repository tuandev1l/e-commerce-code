import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { SearchType } from '@libs/searching/searchType.enum';

export class ProductFilterDto {
  @IsString()
  @IsOptional()
  @Type(() => String)
  keyword?: string;

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => {
    const categories = value.toString().trim();
    if (categories === '') {
      return [];
    }
    return categories.split(',');
  })
  categories?: string[];

  @IsArray()
  @IsOptional()
  @IsString({ each: true })
  @Type(() => String)
  @Transform(({ value }) => {
    const brands = value.toString().trim();
    if (brands === '') {
      return [];
    }
    return brands.split(',');
  })
  brands?: string[];

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => +value)
  fromNumber?: number = 0;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => +value)
  toNumber?: number = 99999999;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  @Transform(({ value }) => +value)
  page?: number = 1;

  @IsNotEmpty()
  @IsBoolean()
  @Transform(({ value }) => {
    return value.toString().trim().toLowerCase() === 'true';
  })
  usingKnn: boolean;

  @IsOptional()
  @IsEnum(SearchType)
  @Transform(({ value }) => {
    return value === SearchType.TEXT ? SearchType.TEXT : SearchType.IMAGE;
  })
  type?: SearchType;
}
