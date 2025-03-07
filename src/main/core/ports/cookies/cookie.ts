export type CookieOptions = {
  httpOnly?: boolean;
  maxAge?: number;
  path?: string;
  secure?: boolean;
};

export type Cookie = {
  name: string;
  value: string;
  options?: CookieOptions;
};
