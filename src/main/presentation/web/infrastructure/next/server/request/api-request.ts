import { Request } from "core/ports/http/request";
import { NextApiRequest, NextApiResponse } from "next";

export type ApiRequestContext = {
  req: NextApiRequest;
  res: NextApiResponse;
};

export class APIRequest<TProps> implements Request<void, ApiRequestContext, TProps> {
  constructor(
    private readonly req: NextApiRequest,
    private readonly res: NextApiResponse<TProps | undefined>,
  ) {}

  get context(): ApiRequestContext {
    return { req: this.req, res: this.res };
  }

  findParam(name: string): string | undefined {
    throw new Error("Noop");
  }

  getParam(name: string): string {
    throw new Error("Noop");
  }

  findQueryParam(name: string): string | undefined {
    throw new Error("Noop");
  }

  getQueryParam(name: string): string {
    throw new Error("Noop");
  }

  unauthorized(): void {
    if (this.res.finished) return;
    this.notFound(); // Obfuscation
  }

  notFound(): void {
    if (this.res.finished) return;
    this.res.status(404).send(undefined);
  }

  success(props: TProps) {
    if (this.res.finished) return;
    this.res.status(200).json(props);
  }
}
