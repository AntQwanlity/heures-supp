import { Cookie } from "core/ports/cookies/cookie";
import { Request } from "core/ports/http/request";

export abstract class CookiesService {
  abstract get(name: string, request?: Request<any, any, any>): string | undefined;

  abstract set(cookie: Cookie, request?: Request<any, any, any>): void;

  abstract destroy(cookie: Cookie, request?: Request<any, any, any>): void;
}
