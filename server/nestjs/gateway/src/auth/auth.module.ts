import { AuthService } from '@auth/auth.service';
import { Module, OnModuleInit } from '@nestjs/common';
import { UserModule } from '@user/user.module';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { User } from '@user/entities/user.entity';
import { AuthController } from '@auth/auth.controller';
import { JwtStrategy } from '@auth/jwt.strategy';
import { BullModule } from '@nestjs/bullmq';
import { Repository } from 'typeorm';
import { Role } from '@auth/role.enum';
import { ACCOUNT_TYPE } from '@share/enums';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    UserModule,
    PassportModule,
    BullModule.registerQueue({
      name: 'mail-queue',
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get('JWT_SECRET'),
        signOptions: { expiresIn: config.get('JWT_EXPIRED') },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthModule],
})
export class AuthModule implements OnModuleInit {
  constructor(
    @InjectRepository(User) private readonly repo: Repository<User>,
    private readonly authService: AuthService,
  ) {}

  async onModuleInit(): Promise<any> {
    if ((await this.repo.find()).length > 0) {
      return;
    }
    const accounts = [
      { email: 'admin@gmail.com', role: Role.ADMIN, name: 'ADMIN' },
      { email: 'tuantm@gmail.com', role: Role.USER, name: 'tuantm' },
    ];

    await Promise.all(
      accounts.map(async (acc) =>
        this.repo.save({
          email: acc.email,
          name: acc.name,
          isEmailVerified: true,
          hasPassword: true,
          accountType: ACCOUNT_TYPE.EMAIL,
          password: await this.authService.hashPassword('123456789'),
          avatarUrl: `https://avatar.iran.liara.run/public/boy?username=${acc.email}`,
          role: acc.role,
        }),
      ),
    );
  }
}
