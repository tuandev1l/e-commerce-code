import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService, IAuthRes } from '@auth/auth.service';
import { LoginDto } from '@auth/dto/login.dto';
import { SignupDto } from '@auth/dto/signup.dto';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { SkipAuth } from '@auth/decorator/skip-auth.decorator';

@Controller('auth')
@ApiTags('Auth')
@ApiOkResponse({
  type: IAuthRes,
})
@SkipAuth()
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'login' })
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.service.login(loginDto);
  }

  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'signup' })
  @Post('signup')
  async signup(@Body() signupDto: SignupDto) {
    return this.service.signup(signupDto);
  }
}
