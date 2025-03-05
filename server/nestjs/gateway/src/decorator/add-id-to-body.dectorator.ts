import { Request } from 'express';
import * as _ from 'lodash';
import { IAddParamsToBodyArgs } from '@decorator/add-user-to-body.dectorator';
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

function modifyRequest(req: Request, args: IAddParamsToBodyArgs) {
  const user = req.user;
  const { paramSource, paramDest, injectDataTo = 'body' } = args;

  const setValue = paramSource ? paramSource : req.params.id;
  const setKey = paramDest ? paramDest : 'id';

  _.set(req[injectDataTo], setKey, setValue);
  return req[injectDataTo];
}

export const AddIdParamToBody = createParamDecorator(
  (args: IAddParamsToBodyArgs, ctx: ExecutionContext) => {
    const req = ctx.switchToHttp().getRequest();
    if (!args) {
      args = {};
    }
    return modifyRequest(req, args);
  },
);
