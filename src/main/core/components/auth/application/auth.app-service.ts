import { Injectable } from "@nestjs/common";
import { FirebaseUserRepository } from "core/components/auth/application/firebase-user.repository";
import { ExternalAuthService } from "core/ports/auth/external-auth.service";
import { CookiesService } from "core/ports/cookies/cookies.service";
import { Request } from "core/ports/http/request";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";

@Injectable()
export class AuthAppService {
  constructor(
    private readonly cookiesService: CookiesService,
    private readonly externalAuthService: ExternalAuthService,
    private readonly firebaseUserRepository: FirebaseUserRepository,
  ) {}

  async login(request: Request<any, any, any>, idToken: string, csrfToken: string): Promise<void> {
    const cookieCsrfToken = this.cookiesService.get("csrfToken", request);
    if (!cookieCsrfToken || csrfToken !== cookieCsrfToken)
      throw new UnauthorizedError("CSRF token validation failure.");

    const loginResult = await this.externalAuthService.login(idToken);

    // Error if for some reason the user doesn't exist in our DB
    await this.firebaseUserRepository.getByFirebaseId(loginResult.externalId);

    this.cookiesService.set(loginResult.cookie, request);
  }

  async logout(request: Request<any, any, any>, userId: string) {
    this.cookiesService.destroy({ name: "session", value: "", options: { path: "/" } }, request);
    await this.externalAuthService.logout(userId);
  }
}
