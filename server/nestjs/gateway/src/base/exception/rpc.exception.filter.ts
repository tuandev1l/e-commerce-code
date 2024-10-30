import { ArgumentsHost, Catch, RpcExceptionFilter } from '@nestjs/common';
import { throwError } from 'rxjs';
import { RpcException } from '@nestjs/microservices';
import { RpcBaseException } from '@base/exception/exception.resolver';

@Catch(RpcException)
export class ExceptionFilter implements RpcExceptionFilter<RpcBaseException> {
  catch(exception: RpcBaseException, host: ArgumentsHost): any {
    return throwError(() => ({
      statusCode: exception.getStatusCode(),
      message: exception.getError(),
    }));
  }
}
