import { Injectable } from "@nestjs/common";
import { GoogleAuthClient } from "core/ports/auth/google-auth.client";
import { GoogleAuth } from "google-auth-library";

@Injectable()
export class GoogleAuthApiClient implements GoogleAuthClient {
  constructor(private readonly googleAuth: GoogleAuth) {}
  async getToken(url: string): Promise<string> {
    const client = await this.googleAuth.getIdTokenClient(url);
    return (await client.getRequestHeaders()).Authorization;
  }
}
