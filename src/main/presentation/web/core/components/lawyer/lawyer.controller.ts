import { Body, Controller, Post } from "@nestjs/common";
import { UserType } from "core/components/auth/domain/user";
import { LawyerAppService } from "core/components/lawyer/application/lawyer-app.service";
import type { Request } from "core/ports/http/request";
import { Public } from "presentation/web/infrastructure/nest/auth-api.guard";
import { CurrentRequest } from "presentation/web/infrastructure/nest/current-request.decorator";

export class SignUpInputDto {
  email!: string;
  userType!: UserType;
  idToken!: string;
  csrfToken!: string;
}

@Controller("lawyer")
export class LawyerController {
  constructor(private readonly lawyerAppService: LawyerAppService) {}

  @Public()
  @Post("signup")
  async signup(
    @CurrentRequest() req: Request<any, any, any>,
    @Body() input: SignUpInputDto,
  ): Promise<void> {
    return this.lawyerAppService.signUp(
      req,
      input.email,
      input.userType,
      input.idToken,
      input.csrfToken,
    );
  }
}
