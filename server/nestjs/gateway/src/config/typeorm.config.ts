import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm/dist/interfaces/typeorm-options.interface';

export const config: TypeOrmModuleAsyncOptions = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (config: ConfigService) => ({
    type: 'postgres',
    host: config.get('POSTGRES_HOST'),
    port: config.get('POSTGRES_PORT'),
    username: config.get('POSTGRES_USER'),
    password: config.get('POSTGRES_PASSWORD'),
    synchronize: config.get('POSTGRES_SYNCHRONIZE'),
    autoLoadEntities: true,
    entities: ['src/**/entities/*.entity.js', 'dist/**/entities/*.entity.js'],
  }),
};
