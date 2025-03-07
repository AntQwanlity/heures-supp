import { Request } from "core/ports/http/request";
import { GetStaticPropsContext, GetStaticPropsResult } from "next";

export type SSGPageProps<P> = P & { [key: string]: string };

export class SSGRequest<TProps>
  implements Request<GetStaticPropsResult<TProps>, GetStaticPropsContext, TProps>
{
  constructor(
    private readonly nextContext: GetStaticPropsContext,
    private readonly pageTitle: string,
  ) {}

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

  get context(): GetStaticPropsContext {
    return this.nextContext;
  }

  unauthorized(): GetStaticPropsResult<SSGPageProps<TProps>> {
    throw new Error("Cannot unauthorize an SSG request.");
  }

  // SSG request can return not found for example when a CMS blog post is deleted.
  notFound(): GetStaticPropsResult<SSGPageProps<TProps>> {
    return { notFound: true };
  }

  success(props: TProps): GetStaticPropsResult<SSGPageProps<TProps>> {
    return JSON.parse(
      JSON.stringify({
        props: { title: this.pageTitle, ...props },
      }),
    );
  }
}
