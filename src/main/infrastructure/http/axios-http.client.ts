import axios from "axios";
import { HttpClient } from "core/ports/http/http-client";
import { IncomingMessage } from "http";
import { Readable } from "stream";

export class AxiosHttpClient implements HttpClient {
  async getStream<T>(url: string, authBearerToken?: string): Promise<Readable> {
    const response = await axios.get(url, {
      headers: authBearerToken ? { Authorization: authBearerToken } : {},
      responseType: "stream",
    });
    return response.data;
  }

  async get<T>(url: string, authBearerToken?: string): Promise<T> {
    const response = await axios.get(
      url,
      authBearerToken ? { headers: { Authorization: `bearer ${authBearerToken}` } } : undefined,
    );
    return response.data;
  }

  async post<TBody, TResult>(url: string, body: TBody): Promise<TResult> {
    const response = await axios.post(url, body);
    return response.data;
  }

  async delete<TBody, TResult>(url: string, body: TBody): Promise<TResult> {
    const response = await axios.delete(url, { data: body });
    return response.data;
  }
}
