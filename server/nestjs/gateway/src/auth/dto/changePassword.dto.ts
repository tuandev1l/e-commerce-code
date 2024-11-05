import { IsNotEmpty, IsString } from 'class-validator';
import { ResetPasswordDto } from '@auth/dto/resetPassword.dto';

export class ChangePasswordDto extends ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}
