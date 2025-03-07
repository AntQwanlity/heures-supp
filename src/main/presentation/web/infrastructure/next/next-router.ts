import { NextRouter as NextNativeRouter } from "next/router";
import { Router } from "presentation/web/core/ports/router/router";

export class NextRouter implements Router {
  constructor(private readonly nextNativeRouter: NextNativeRouter) {}

  async redirect(url: string): Promise<void> {
    await this.nextNativeRouter.push(url);
  }

  reload(): void {
    this.nextNativeRouter.reload();
  }

  pathContains(str: string): boolean {
    return this.nextNativeRouter.asPath.includes(str);
  }

  pathStartsWith(str: string): boolean {
    return this.nextNativeRouter.asPath.startsWith(str);
  }

  matchesExactPath(path: string): boolean {
    return this.nextNativeRouter.asPath === path;
  }

  findParam(name: string): string | undefined {
    return this.nextNativeRouter.query[name] as string;
  }

  getParam(name: string): string {
    const param = this.findParam(name);

    if (!param) throw new Error(`Param ${param} not found`);

    return param;
  }

  setParam(name: string, value: string): void {
    this.nextNativeRouter.push(
      {
        query: { ...this.nextNativeRouter.query, [name]: value },
      },
      undefined,
      { shallow: true },
    );
  }
}
