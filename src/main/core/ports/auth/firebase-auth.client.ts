export abstract class FirebaseAuthClient {
  abstract verifySessionCookie(sessionCookie: string): Promise<string>;

  abstract loginAttempt(
    idToken: string,
    expiresIn: number,
  ): Promise<{ uid: string; cookieValue: string }>;

  abstract logout(externalId: string): Promise<void>;
}
