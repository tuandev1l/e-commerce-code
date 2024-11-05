import { LoginDto } from '@auth/dto/login.dto';
import {
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { GENDER } from '@share/enums';
import { IUserAddress } from '@share/interfaces';

export class SignupDto extends LoginDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsDate()
  birthday?: Date;

  @IsNotEmpty()
  @IsEnum(GENDER)
  gender: GENDER;

  @IsOptional()
  @IsString()
  avatarUrl?: string;

  @IsNotEmpty()
  address: IUserAddress;
}
