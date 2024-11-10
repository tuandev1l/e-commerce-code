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
import { ChangePasswordDto } from '@auth/dto/changePassword.dto';
import { ForgotPasswordDto } from '@auth/dto/forgotPassword.dto';
import { ResetPasswordDto } from '@auth/dto/resetPassword.dto';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import * as crypto from 'crypto';
import { AddNewAddressDto } from '@auth/dto/addNewAddress.dto';
import { SetDefaultAddressDto } from '@auth/dto/setDefaultAddress.dto';
import { v4 as uuidv4 } from 'uuid';

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
    @InjectQueue('mail-queue') private readonly queue: Queue,
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
    const { email, password } = loginDto;

    const user = await this.repository.findOneBy({ email });
    if (!user) {
      throw new NotFoundException('There is no user with this email');
    }
    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Wrong username or password');
    }

    if (!user.isEmailVerified && !user.isPhoneVerified) {
      throw new BadRequestException(
        `Please verify ${user.email ? 'email' : 'phone'} first`,
      );
    }

    return this.generateJwt(user);
  }

  async signup(signupDto: SignupDto) {
    const { email, password, name, birthday, gender, avatarUrl } = signupDto;

    const resetToken = await this.createToken();

    const existedUser = await this.repository.findOneBy({ email });
    if (existedUser && existedUser.isEmailVerified) {
      throw new BadRequestException(
        'Email existed, please choose another email',
      );
    }

    const hashPassword = await this.hashPassword(password);
    // address.isDefault = true;
    // address.uuid = uuidv4();
    const user = this.repository.create({
      accountType: ACCOUNT_TYPE.EMAIL,
      birthday,
      gender,
      // address: [address],
      avatarUrl,
      password: hashPassword,
      name,
      email,
      resetToken: resetToken,
      resetTokenExpired: new Date(Date.now() + 10 * 60 * 1000),
    });

    await this.repository.save(user);

    const html = `Activate your Account
        To activate your account we just need to confirm your email address... It only takes a minute!
        Confirm Email Address: <a href="http://localhost:5173/auth/verify/${resetToken}">LINK<a>`;
    // sending email to verify user
    void this.sendingEmail(
      email,
      'ACTIVATE YOUR ACCOUNT (ONLY VALID ON 10 MINS)',
      html,
    );
  }

  async changePassword(user, changePasswordDto: ChangePasswordDto) {
    const { password, newPassword } = changePasswordDto;

    if (!(await bcrypt.compare(password, user.password))) {
      throw new BadRequestException('Wrong password');
    }

    user.password = await this.hashPassword(newPassword);

    void this.repository.save(user);
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto) {
    const { email } = forgotPasswordDto;
    const user = await this.repository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException('There is no user with this email');
    }

    const token = await this.createToken();
    const html = `Forgot your password? Submit a PATCH request with your new password and password confirm to: <a href="http://localhost:5173/auth/reset-password/${token}">LINK</a>. If you didn't forget your password, please ignore this email.`;

    user.resetToken = token;
    user.resetTokenExpired = new Date(Date.now() + 10 * 60 * 1000);
    await this.repository.save(user);
    void this.sendingEmail(
      email,
      'PASSWORD RESET TOKEN (ONLY VALID ON 10 MINS)',
      html,
    );
  }

  async verifyUser(token: string) {
    const user = await this.repository.findOneBy({ resetToken: token });
    if (!user) {
      throw new NotFoundException(
        'Verify fail, there is no user with this token',
      );
    }

    user.isEmailVerified = true;
    user.resetToken = undefined;
    user.resetTokenExpired = undefined;
    await this.repository.save(user);
    return true;
  }

  async resetPassword(resetToken, resetPasswordDto: ResetPasswordDto) {
    const { newPassword } = resetPasswordDto;
    const user = await this.repository.findOneBy({ resetToken });

    if (!user) {
      throw new NotFoundException('There is no user with this resetToken');
    }

    user.password = await this.hashPassword(newPassword);
    user.resetToken = undefined;
    user.resetTokenExpired = undefined;
    void this.repository.save(user);
  }

  async addNewAddress(user: User, addNewAddressDto: AddNewAddressDto) {
    let isDefault = false;
    if (addNewAddressDto.address.isDefault) {
      for (const address of user.address) {
        address.isDefault = false;
      }
      isDefault = true;
    } else if (!user.address.length) {
      isDefault = true;
    }

    user.address.push({
      ...addNewAddressDto.address,
      uuid: uuidv4(),
      isDefault,
    });
    await this.repository.save(user);
    return user.address;
  }

  async setDefaultAddress(
    user: User,
    setDefaultAddressDto: SetDefaultAddressDto,
  ) {
    const { address } = user;
    for (const add of address) {
      add.isDefault = add.uuid === setDefaultAddressDto.addressId;
    }
    await this.repository.save(user);
    return user.address;
  }

  async deleteAddress(user: User, addressId: string) {
    const addressIdx = user.address.findIndex(
      (address) => address.uuid == addressId,
    );
    user.address.splice(addressIdx, 1);
    await this.repository.save(user);
    return user.address;
  }

  private validateUsername(username: string) {
    const emailReg = new RegExp(emailRegex, 'gi');
    const phoneReg = new RegExp(phoneRegex, 'gi');

    const isEmail = emailReg.test(username);
    const isPhoneNumber = phoneReg.test(username);

    if (!isEmail && !isPhoneNumber) {
      throw new BadRequestException('Username must be either email or phone');
    }

    return [isEmail, isPhoneNumber];
  }

  // private async findUserByUsername(username: string, isEmail): Promise<User> {
  //   if (isEmail) {
  //     return this.repository.findOneBy({ email: username });
  //   }
  //
  //   return this.repository.findOneBy({ phoneNumber: username });
  // }

  private async hashPassword(password: string) {
    return bcrypt.hash(
      password,
      this.configService.get('PASSWORD_SALT_LENGTH'),
    );
  }

  private async createToken() {
    const randomString = crypto.randomBytes(32).toString('hex');
    return crypto.createHash('sha256').update(randomString).digest('hex');
  }

  private async sendingEmail(toEmail: string, subject: string, html?: string) {
    await this.queue.add('send-email', {
      toEmail,
      subject,
      html,
    });
  }
}
