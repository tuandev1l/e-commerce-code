import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import * as _ from 'lodash';
import { Request } from 'express';

export interface IAddParamsToBodyArgs {
  paramSource?: string;
  paramDest?: string;
  injectDataTo?: string;
}

function modifyRequest(req: Request, args: IAddParamsToBodyArgs) {
  const user = req.user;
  const { paramSource, paramDest, injectDataTo = 'body' } = args;

  const setValue = !paramSource ? user : _.get(user, paramSource, null);
  const setKey = paramDest ? paramDest : paramSource ? paramSource : 'user';

  _.set(req[injectDataTo], setKey, setValue);
  return req[injectDataTo];
}

export const AddUserToBody = createParamDecorator(
  (args: IAddParamsToBodyArgs, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!args) {
      args = {};
    }
    return modifyRequest(req, args);
  },
);
