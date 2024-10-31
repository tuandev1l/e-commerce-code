import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateRatingDtoWithoutUser {
  @IsNotEmpty()
  @IsNumber()
  orderId: number;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsNotEmpty()
  @IsString()
  content: string;

  @IsNotEmpty()
  @IsNumber()
  rating: number;

  @IsNotEmpty()
  @IsArray()
  images?: string[];

  @IsNotEmpty()
  @IsArray()
  productAttributes: string[];

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @IsNumber()
  deliveryRating: number;
}
