import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '@user/entities/user.entity';
import { CrudBase } from '@base/crud.base';
import { LoggingService } from '@logging/logging.service';

@Injectable()
export class UserService extends CrudBase<User> {
  constructor(
    @InjectRepository(User) protected readonly repository: Repository<User>,
    loggingService: LoggingService,
  ) {
    super(repository, User.name, loggingService);
  }

  async verifyUser(id: number) {
    const user = await this.getOneBy({ id });
    if (!user) {
      throw new UnauthorizedException('Wrong or expired JWT');
    }
    return user;
  }

  findAllUsers() {
    return this.list();
  }

  findOneUser(id: number) {
    return this.getOneBy({ id });
  }
}
