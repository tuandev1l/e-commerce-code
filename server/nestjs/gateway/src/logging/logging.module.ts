import { Global, Module } from '@nestjs/common';
import { LoggingService } from './logging.service';
import { log4jsConfig } from '@logging/log4js';
import * as log4js from 'log4js';

log4js.configure(log4jsConfig);

@Global()
@Module({
  providers: [LoggingService],
  exports: [LoggingService],
})
export class LoggingModule {}
