import { Injectable } from '@nestjs/common';
import * as log4js from 'log4js';

@Injectable()
export class LoggingService {
  getLogger(category: string) {
    return log4js.getLogger(category);
  }
}
