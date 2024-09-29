import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IProductBadge, IProductImage } from '@app/interfaces';
import InventoryStatusEnum from '@app/enum';
import { Shop } from '@app/entities/shop.entity';
import { Brand } from '@app/entities/brand.entity';
import { Category } from '@app/entities/category.entity';

export class ProductDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  shortDescription: string;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsNotEmpty()
  @IsNumber()
  listPrice: number;

  @IsNotEmpty()
  @IsNumber()
  originalPrice: number;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  // @Type(() => IProductBadge)
  badges: IProductBadge[];

  @IsNotEmpty()
  @IsNumber()
  discount: number;

  @IsNotEmpty()
  @IsNumber()
  discountRate: number;

  @IsNotEmpty()
  @IsNumber()
  ratingAverage: number;

  @IsNotEmpty()
  @IsNumber()
  reviewCount: number;

  @IsNotEmpty()
  @IsString()
  reviewText: string;

  @IsNotEmpty()
  @IsNumber()
  favouriteCount: number;

  @IsNotEmpty()
  @IsString()
  thumbnailUrl: string;

  @IsNotEmpty()
  @IsEnum(InventoryStatusEnum)
  inventoryStatus: InventoryStatusEnum;

  @IsOptional()
  @ValidateNested()
  @Type(() => Shop)
  seller: Shop;

  @IsNotEmpty()
  @IsNumber()
  allTimeQuantitySold: number;

  @IsOptional()
  @IsString()
  metaTitle?: string;

  @IsOptional()
  @IsString()
  metaDescription?: string;

  @IsOptional()
  @IsString()
  metaKeywords?: string;

  @IsNotEmpty()
  @IsString()
  description: string;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  images: IProductImage[];

  @IsOptional()
  @ValidateNested()
  @Type(() => Brand)
  brand: Brand;

  @IsNotEmpty()
  @IsArray()
  specifications: Array<{
    name: string;
    attributes: Array<{
      code: string;
      name: string;
      value: string;
    }>;
  }>;

  @IsNotEmpty()
  @IsArray()
  configurableOptions: Array<{
    code: string;
    name: string;
    position: number;
    showPreviewImage: boolean;
    values: Array<{
      label: string;
    }>;
  }>;

  @IsNotEmpty()
  @ValidateNested()
  highlight: {
    items: string[];
    title: string;
  };

  @IsNotEmpty()
  @ValidateNested()
  stockItem: {
    maxSaleQty: number;
    minSaleQty: number;
    preorderDate?: string;
    qty: number;
  };

  @IsNotEmpty()
  @ValidateNested()
  quantitySold: {
    text: string;
    value: number;
  };

  @IsOptional()
  @ValidateNested()
  @Type(() => Category)
  categories: Category;

  @IsOptional()
  @IsString()
  videoUrl?: string;

  @IsOptional()
  @IsBoolean()
  isSellerInChatWhitelist?: boolean = true;

  @IsNotEmpty()
  @IsArray()
  @ValidateNested({ each: true })
  warrantyInfo: Array<{
    name: string;
    value: string;
    url: string;
  }>;

  @IsNotEmpty()
  @IsString()
  returnAndExchangePolicy: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  benefits: Array<{
    icon: string;
    text: string;
  }>;

  @IsOptional()
  @ValidateNested()
  returnPolicy: {
    body: Array<{
      label: string;
      content: string[];
    }>;
    title: string;
  };
}
