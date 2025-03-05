import { IsArray, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { User } from '@user/entities/user.entity';
import { IRatingImage } from '@libs/rating/interface/ratingImage.interface';

export class CreateRatingDto {
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
  images?: IRatingImage[];

  @IsNotEmpty()
  @IsArray()
  productAttributes: string[];

  @IsNotEmpty()
  @IsString()
  productId: string;

  @IsNotEmpty()
  @Type(() => User)
  user: User;
}
