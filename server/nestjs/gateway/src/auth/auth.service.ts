import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { LoginDto } from '@auth/dto/login.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '@user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignupDto } from '@auth/dto/signup.dto';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { ApiProperty } from '@nestjs/swagger';
import { emailRegex, phoneRegex } from '@share/regex';
import { ACCOUNT_TYPE } from '@share/enums';

export class IAuthRes {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  user: User;

  constructor(accessToken: string, user: User) {
    this.accessToken = accessToken;
    this.user = user;
  }
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
    private readonly configService: ConfigService,
    private readonly jwtService: JwtService,
    private readonly emailReg = new RegExp(emailRegex, 'gi'),
    private readonly phoneReg = new RegExp(phoneRegex, 'gi'),
  ) {}

  async generateJwt(user: User): Promise<IAuthRes> {
    const accessToken = this.jwtService.sign(
      { id: user.id },
      {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRE'),
      },
    );
    return new IAuthRes(accessToken, user);
  }

  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const [isEmail] = this.validateUsername(username);
    const user = await this.findUserByUsername(username, isEmail);
    if (!user) {
      throw new NotFoundException('There is no user with this ID');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Wrong username or password');
    }
    return this.generateJwt(user);
  }

  async signup(signupDto: SignupDto) {
    const { username, password, name, birthday, address, gender, avatarUrl } =
      signupDto;

    const [isEmail, isPhoneNumber] = this.validateUsername(username);

    let email = '',
      phoneNumber = '',
      accountType = ACCOUNT_TYPE.OTHER;

    if (isEmail) {
      email = username;
      accountType = ACCOUNT_TYPE.EMAIL;
    } else if (isPhoneNumber) {
      phoneNumber = username;
      accountType = ACCOUNT_TYPE.PHONE;
    }

    const isExisted = await this.findUserByUsername(username, isEmail);
    if (isExisted) {
      throw new BadRequestException(
        'Please choose another email or phone number',
      );
    }

    const hashPassword = await bcrypt.hash(
      password,
      this.configService.get('PASSWORD_SALT_LENGTH'),
    );
    const user = this.repository.create({
      accountType,
      birthday,
      gender,
      address,
      avatarUrl,
      password: hashPassword,
      name,
      email,
      phoneNumber,
    });

    await this.repository.save(user);
    return this.generateJwt(user);
  }

  private validateUsername(username: string) {
    const isEmail = this.emailReg.test(username);
    const isPhoneNumber = this.phoneReg.test(username);

    if (!isEmail && !isPhoneNumber) {
      throw new BadRequestException('Email or phone is invalid');
    }

    return [isEmail, isPhoneNumber];
  }

  private async findUserByUsername(username: string, isEmail): Promise<User> {
    if (isEmail) {
      return this.repository.findOneBy({ email: username });
    }

    return this.repository.findOneBy({ phoneNumber: username });
  }
}
