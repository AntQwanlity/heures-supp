import { Body, Controller, Post } from "@nestjs/common";
import { AuthAppService } from "core/components/auth/application/auth.app-service";
import { User } from "core/components/auth/domain/user";
import type { Request } from "core/ports/http/request";
import { Public } from "presentation/web/infrastructure/nest/auth-api.guard";
import { CurrentRequest } from "presentation/web/infrastructure/nest/current-request.decorator";
import { CurrentUser } from "presentation/web/infrastructure/nest/current-user.decorator";

export class LoginDto {
  idToken!: string;
  csrfToken!: string;
}

@Controller("auth")
export class AuthController {
  constructor(private readonly authAppService: AuthAppService) {}

  @Public()
  @Post("login")
  async login(
    @CurrentRequest() req: Request<any, any, any>,
    @Body() input: LoginDto,
  ): Promise<void> {
    return this.authAppService.login(req, input.idToken, input.csrfToken);
  }

  @Post("logout")
  async logout(
    @CurrentRequest() req: Request<any, any, any>,
    @CurrentUser() user: User,
  ): Promise<void> {
    return this.authAppService.logout(req, user["id"]);
  }
}
