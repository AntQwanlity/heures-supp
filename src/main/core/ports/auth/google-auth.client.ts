export abstract class GoogleAuthClient {
  abstract getToken(url: string): Promise<string>;
}
