import { User } from "core/components/auth/domain/user";
import { Cookie } from "core/ports/cookies/cookie";
import { Request } from "core/ports/http/request";

export type LoginResult = { externalId: string; cookie: Cookie };

export abstract class ExternalAuthService {
  // Pass request (with cookies) directly here instead of using CookiesService because we don't want it to be request-scoped.
  // We don't want to recreate the entire object graph each request.
  abstract authenticate(
    request: Request<any, any, any>,
    throwOnFailure: boolean,
  ): Promise<{ user: User; externalId: string } | undefined>;

  abstract login(idToken: string): Promise<LoginResult>;

  abstract linkUser(userId: string, externalId: string): Promise<void>;

  abstract logout(userId: string): Promise<void>;
}
