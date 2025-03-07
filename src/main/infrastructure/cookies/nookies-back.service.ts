import { Injectable } from "@nestjs/common";
import { Cookie } from "core/ports/cookies/cookie";
import { CookiesService } from "core/ports/cookies/cookies.service";
import { Request } from "core/ports/http/request";
import { destroyCookie, parseCookies, setCookie } from "nookies";

@Injectable()
export class NookiesBackService implements CookiesService {
  constructor() {}

  get(name: string, request: Request<any, any, any>): string | undefined {
    const cookies = parseCookies(request.context);
    return cookies[name];
  }

  set(cookie: Cookie, request: Request<any, any, any>) {
    setCookie(request.context, cookie.name, cookie.value, cookie.options);
  }

  destroy(cookie: Cookie, request: Request<any, any, any>) {
    destroyCookie(request.context, cookie.name, cookie.options);
  }
}
