import { LoginDto } from '@auth/dto/login.dto';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GENDER } from '@share/enums';
import { Type } from 'class-transformer';

export class SignupDto extends LoginDto {
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

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  // @IsNotEmpty()
  // address: IUserAddress;
}
