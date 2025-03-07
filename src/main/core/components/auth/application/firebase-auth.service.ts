import { Injectable } from "@nestjs/common";
import { FirebaseUserRepository } from "core/components/auth/application/firebase-user.repository";
import { UserRepository } from "core/components/auth/application/user.repository";
import { FirebaseUser } from "core/components/auth/domain/firebase-user";
import { User } from "core/components/auth/domain/user";
import { ExternalAuthService, LoginResult } from "core/ports/auth/external-auth.service";
import { FirebaseAuthClient } from "core/ports/auth/firebase-auth.client";
import { CookiesService } from "core/ports/cookies/cookies.service";
import { Request } from "core/ports/http/request";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";

@Injectable()
export class FirebaseAuthService implements ExternalAuthService {
  private static SessionCookieDurationDays = 5;

  constructor(
    private readonly firebaseAuthClient: FirebaseAuthClient,
    private readonly firebaseUserRepository: FirebaseUserRepository,
    private readonly userRepository: UserRepository,
    private readonly cookiesService: CookiesService,
  ) {}

  async authenticate(
    request: Request<any, any, any>,
    throwOnFailure: boolean,
  ): Promise<{ user: User; externalId: string } | undefined> {
    const sessionCookie = this.cookiesService.get("session", request) || "";
    try {
      const firebaseId = await this.firebaseAuthClient.verifySessionCookie(sessionCookie);
      const firebaseUser = await this.firebaseUserRepository.getByFirebaseId(firebaseId);
      const user = await this.userRepository.getById(firebaseUser["userId"]);
      return { user, externalId: firebaseId };
    } catch (e: any) {
      if (throwOnFailure) throw new UnauthorizedError(e.message);

      return undefined;
    }
  }

  async login(idToken: string): Promise<LoginResult> {
    const expiresIn = FirebaseAuthService.SessionCookieDurationDays * 60 * 60 * 24 * 1000;
    const loginResult = await this.firebaseAuthClient.loginAttempt(idToken, expiresIn);

    return {
      externalId: loginResult.uid,
      cookie: {
        name: "session",
        value: loginResult.cookieValue,
        options: {
          maxAge: expiresIn,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          path: "/",
        },
      },
    };
  }

  async linkUser(userId: string, externalId: string): Promise<void> {
    return this.firebaseUserRepository.create(new FirebaseUser(userId, externalId));
  }

  async logout(userId: string) {
    const firebaseUser = await this.firebaseUserRepository.getByUserId(userId);
    return this.firebaseAuthClient.logout(firebaseUser["firebaseId"]);
  }
}
