import { Injectable } from "@nestjs/common";
import { UserRepository } from "core/components/auth/application/user.repository";
import { User, UserType } from "core/components/auth/domain/user";
import { LawyerRepository } from "core/components/lawyer/application/lawyer.repository";
import { Lawyer } from "core/components/lawyer/domain/lawyer";
import { LegalCaseAppService } from "core/components/legal-case/application/legal-case-app.service";
import { ExternalAuthService, LoginResult } from "core/ports/auth/external-auth.service";
import { CookiesService } from "core/ports/cookies/cookies.service";
import { NowService } from "core/ports/date-time/now.service";
import { Request } from "core/ports/http/request";
import { TransactionService } from "core/ports/persistence/transaction.service";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";

@Injectable()
export class LawyerAppService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly lawyerRepository: LawyerRepository,
    private readonly authService: ExternalAuthService,
    private readonly cookiesService: CookiesService,
    private readonly nowService: NowService,
    private readonly transactionService: TransactionService,
    private readonly legalCaseService: LegalCaseAppService,
  ) {}

  async signUp(
    request: Request<any, any, any>,
    email: string,
    userType: UserType,
    idToken: string,
    csrfToken: string,
  ): Promise<void> {
    const loginResult = await this.validate3rdPartyLogin(request, idToken, csrfToken);

    await this.transactionService.run(async () => {
      const lawyer = await this.lawyerRepository.create(new Lawyer(new User("", email, userType)));
      await this.authService.linkUser(lawyer["user"]["id"], loginResult.externalId);
      await this.legalCaseService.createLegalCase(lawyer["user"]);
    });

    this.cookiesService.set(loginResult.cookie, request);
  }

  private async validate3rdPartyLogin(
    request: Request<any, any, any>,
    idToken: string,
    csrfToken: string,
  ): Promise<LoginResult> {
    const cookieCsrfToken = this.cookiesService.get("csrfToken", request);
    if (!cookieCsrfToken || csrfToken !== cookieCsrfToken)
      throw new UnauthorizedError(
        `CSRF token validation failure. : ${cookieCsrfToken} vs ${csrfToken}`,
      );

    return this.authService.login(idToken);
  }
}
