import { Injectable } from '@nestjs/common';
import * as redisStore from 'cache-manager-redis-store';
import { ConfigService } from '@nestjs/config';
import { instanceToPlain } from 'class-transformer';

@Injectable()
export class CacheService {
  private readonly store: ReturnType<typeof redisStore.create>;

  constructor(private readonly configService: ConfigService) {
    this.store = redisStore.create({
      host: this.configService.get('REDIS_HOST'),
      port: this.configService.get('REDIS_PORT'),
      password: this.configService.get('REDIS_PASSWORD'),
    });
  }

  async getKey(prefix: string) {
    return this.store.get(prefix);
  }

  async setKey<E>(prefix: string, data: E | string) {
    if (typeof data === 'string') {
      return this.store.set(prefix, data);
    }
    return this.store.set(prefix, JSON.stringify(instanceToPlain<E>(data)));
  }

  async delKey(prefix: string) {
    return this.store.del(prefix);
  }
}
