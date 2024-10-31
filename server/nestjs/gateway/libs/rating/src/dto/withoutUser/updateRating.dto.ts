import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class UpdateRatingDtoWithoutUser {
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
  @IsNumber()
  deliveryRating: number;
}
