import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { AuthService, IAuthRes } from '@auth/auth.service';
import { LoginDto } from '@auth/dto/login.dto';
import { SignupDto } from '@auth/dto/signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';
import { GetUser } from '@auth/decorator/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { ChangePasswordDto } from '@auth/dto/changePassword.dto';
import { ForgotPasswordDto } from '@auth/dto/forgotPassword.dto';
import { ResetPasswordDto } from '@auth/dto/resetPassword.dto';
import { AddNewAddressDto } from '@auth/dto/addNewAddress.dto';
import { SetDefaultAddressDto } from '@auth/dto/setDefaultAddress.dto';
import { UpdateUserInfo } from '@auth/dto/updateUserInfo';

@Controller('auth')
@ApiTags('Auth')
@ApiOkResponse({
  type: IAuthRes,
})
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.service.login(loginDto);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'signup' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.service.signup(signupDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'change-password' })
  @Post('change-password')
  async changePassword(
    @GetUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return this.service.changePassword(user, changePasswordDto);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'forgot-password' })
  @Post('forgot-password')
  async forgotPassword(@Body() forgotPasswordDto: ForgotPasswordDto) {
    return this.service.forgotPassword(forgotPasswordDto);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'verify-user' })
  @Get('verify/:token')
  async verifyUser(@Param('token') token: string) {
    return this.service.verifyUser(token);
  }

  @SkipAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'reset-password' })
  @Post('reset-password/:resetToken')
  async resetPassword(
    @Param('resetToken') resetToken: string,
    @Body() resetPasswordDto: ResetPasswordDto,
  ) {
    return this.service.resetPassword(resetToken, resetPasswordDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add-address' })
  @Patch('user-info')
  async updateUserInfo(
    @GetUser() user: User,
    @Body() updateUserInfo: UpdateUserInfo,
  ) {
    return this.service.updateUserInfo(user, updateUserInfo);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'add-address' })
  @Post('add-address')
  async addNewAddress(
    @GetUser() user: User,
    @Body() addNewAddressDto: AddNewAddressDto,
  ) {
    return this.service.addNewAddress(user, addNewAddressDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'set-default-address' })
  @Post('set-default-address')
  async setDefaultAddress(
    @GetUser() user: User,
    @Body() setDefaultAddressDto: SetDefaultAddressDto,
  ) {
    return this.service.setDefaultAddress(user, setDefaultAddressDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'set-default-address' })
  @Delete('delete-address/:addressId')
  async deleteAddress(
    @GetUser() user: User,
    @Param('addressId') addressId: string,
  ) {
    return this.service.deleteAddress(user, addressId);
  }
}
