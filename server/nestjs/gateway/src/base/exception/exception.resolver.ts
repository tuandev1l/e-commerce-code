import { HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

export class RpcBaseException extends RpcException {
  constructor(
    defaultMessage: string,
    private readonly statusCode: number,
  ) {
    super(defaultMessage);
  }

  getStatusCode() {
    return this.statusCode;
  }
}

export class RpcBusinessException extends RpcBaseException {
  constructor(
    message: string,
    statusCode: number = HttpStatus.INTERNAL_SERVER_ERROR,
  ) {
    super(message, statusCode);
  }
}

export class RpcBadRequest extends RpcBusinessException {
  constructor(message: string) {
    super(message, HttpStatus.BAD_REQUEST);
  }
}

export class RpcUnauthorized extends RpcBusinessException {
  constructor(message: string) {
    super(message, HttpStatus.UNAUTHORIZED);
  }
}

export class RpcForbidden extends RpcBusinessException {
  constructor(message: string) {
    super(message, HttpStatus.FORBIDDEN);
  }
}

export class RpcNotFound extends RpcBusinessException {
  constructor(message: string) {
    super(message, HttpStatus.NOT_FOUND);
  }
}
