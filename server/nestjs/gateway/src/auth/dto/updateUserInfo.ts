import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GENDER } from '@share/enums';

export class UpdateUserInfo {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  birthday?: Date;

  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER;
}
