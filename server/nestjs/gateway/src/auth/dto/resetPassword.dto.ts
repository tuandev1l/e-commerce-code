import { IsNotEmpty, IsString } from 'class-validator';
import { Match } from '@auth/decorator/password-match.decorator';

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  newPassword: string;

  @IsNotEmpty()
  @IsString()
  @Match('newPassword')
  newConfirmPassword: string;
}
