import { Readable } from "stream";

export abstract class HttpClient {
  abstract getStream(url: string, authBearerToken?: string): Promise<Readable>;

  abstract get<T>(url: string, authBearerToken?: string): Promise<T>;

  abstract post<TBody, TResult>(url: string, body: TBody): Promise<TResult>;

  abstract delete<TBody, TResult>(url: string, body: TBody): Promise<TResult>;
}
