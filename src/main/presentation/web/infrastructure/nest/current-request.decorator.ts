import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";

export const CurrentRequest = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  if (!request.request) throw new UnauthorizedError("Request not found in request context.");

  return request.request;
});
