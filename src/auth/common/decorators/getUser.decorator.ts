import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { UserDocument } from 'src/user/schemas/user.schema';
import { AccountStatus } from '../enums/accountStatus.enum';

export const GetUser = createParamDecorator(
  (data, ctx: ExecutionContext): UserDocument => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as UserDocument;

    if (user.status === AccountStatus.BANNED) {
      throw new ForbiddenException('Account banned');
    }
    return request.user;
  },
);
