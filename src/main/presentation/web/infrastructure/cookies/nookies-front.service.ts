import { Cookie } from "core/ports/cookies/cookie";
import { CookiesService } from "core/ports/cookies/cookies.service";
import { destroyCookie, parseCookies, setCookie } from "nookies";

export class NookiesFrontService implements CookiesService {
  constructor() {}

  get(name: string): string | undefined {
    const cookies = parseCookies();
    return cookies[name];
  }

  set(cookie: Cookie) {
    setCookie(undefined, cookie.name, cookie.value, cookie.options);
  }

  destroy(cookie: Cookie) {
    destroyCookie(undefined, cookie.name, cookie.options);
  }
}
