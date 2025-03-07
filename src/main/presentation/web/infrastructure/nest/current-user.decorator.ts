import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { User } from "core/components/auth/domain/user";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";

export const CurrentUser = createParamDecorator<unknown, ExecutionContext, User | undefined>(
  (data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.user) return undefined;

    return request.user;
  },
);
