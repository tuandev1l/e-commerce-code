import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { Role } from '@auth';
import { ApiForbiddenResponse } from '@nestjs/swagger';
import { RoleGuard } from '@guard/role.guard';

export function Auth(...roles: Role[]) {
  return applyDecorators(
    SetMetadata('roles', roles),
    UseGuards(RoleGuard),
    ApiForbiddenResponse({ description: 'Unauthorized' }),
  );
}
