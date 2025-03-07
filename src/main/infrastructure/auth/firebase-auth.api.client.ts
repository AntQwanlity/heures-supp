import { Injectable, Logger } from "@nestjs/common";
import { FirebaseAuthClient } from "core/ports/auth/firebase-auth.client";
import { NowService } from "core/ports/date-time/now.service";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";
import { apps } from "firebase-admin";
import { initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

if (apps.length === 0) {
  // Local : uses env var FIREBASE_AUTH_EMULATOR_HOST
  initializeApp(
    process.env.NODE_ENV === "development" ? { projectId: "demo-heures-supp-prod" } : undefined,
  );
}

@Injectable()
export class FirebaseAuthAPIClient implements FirebaseAuthClient {
  private static LoginCheckDelayMinutes = 5;

  constructor(private readonly nowService: NowService) {}

  async verifySessionCookie(sessionCookie: string) {
    const result = await getAuth().verifySessionCookie(sessionCookie, true);
    return result.uid;
  }

  async loginAttempt(idToken: string, expiresIn: number) {
    const decodedClaims = await getAuth().verifyIdToken(idToken);

    const loginAttemptIsRecentEnough =
      this.nowService.get().getNativeDate().getTime() / 1000 - decodedClaims.auth_time <
      FirebaseAuthAPIClient.LoginCheckDelayMinutes * 60;

    if (!loginAttemptIsRecentEnough) throw new UnauthorizedError("Login attempt is too old");

    const cookieValue = await getAuth().createSessionCookie(idToken, { expiresIn });

    return { cookieValue, uid: decodedClaims.uid };
  }

  logout(externalId: string): Promise<void> {
    Logger.log(`Revoking refresh tokens for ${externalId}`);
    return getAuth().revokeRefreshTokens(externalId);
  }
}
