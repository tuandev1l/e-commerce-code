import { ArgumentMetadata, PipeTransform } from '@nestjs/common';

export class ValidationPipe implements PipeTransform {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  transform(value: any, metadata: ArgumentMetadata): any {
    return value;
  }
}
