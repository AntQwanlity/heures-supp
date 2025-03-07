import { CanActivate, ExecutionContext, Injectable, Logger, SetMetadata } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ExternalAuthService } from "core/ports/auth/external-auth.service";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";
import { APIRequest } from "presentation/web/infrastructure/next/server/request/api-request";

export const IS_PUBLIC_KEY = "isPublic";
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);

@Injectable()
export class AuthAPIGuard implements CanActivate {
  constructor(
    private readonly authService: ExternalAuthService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const nextReq = context.switchToHttp().getRequest();
    const nextRes = context.switchToHttp().getResponse();

    const request = new APIRequest(nextReq, nextRes);
    nextReq.request = request;

    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    try {
      const result = await this.authService.authenticate(request, true);
      nextReq.user = result?.user;

      return true;
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        if (isPublic) return true;
        Logger.warn(`Unauthorized request : ${error.message}`);
        request.unauthorized();
      }
      throw error;
    }
  }
}
