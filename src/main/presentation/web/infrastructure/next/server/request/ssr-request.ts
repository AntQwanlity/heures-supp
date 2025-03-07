import { User } from "core/components/auth/domain/user";
import { Request } from "core/ports/http/request";
import { GetServerSidePropsContext, GetServerSidePropsResult } from "next";
import { ParsedUrlQuery } from "querystring";

export type SSRPageProps<P> = P & { title: string; user?: User };

export class SSRRequest<TProps, TContext extends ParsedUrlQuery>
  implements
    Request<
      GetServerSidePropsResult<SSRPageProps<TProps>>,
      GetServerSidePropsContext<TContext>,
      SSRPageProps<TProps>
    >
{
  constructor(
    private readonly nextContext: GetServerSidePropsContext<TContext>,
    private readonly pageTitle: string,
  ) {}

  get context(): GetServerSidePropsContext<TContext> {
    return this.nextContext;
  }

  findQueryParam(name: string): string | undefined {
    return this.nextContext.query[name] as string;
  }

  getQueryParam(name: string): string {
    if (this.nextContext.query[name] === undefined)
      throw new Error(`Query param ${name} is undefined`);
    return this.nextContext.query[name] as string;
  }

  findParam(name: string): string | undefined {
    return this.nextContext.params?.[name] as string;
  }

  getParam(name: string) {
    if (this.nextContext.params?.[name] === undefined)
      throw new Error(`Param ${name} is undefined`);

    return this.nextContext.params[name] as string;
  }

  unauthorized(): GetServerSidePropsResult<SSRPageProps<TProps>> {
    return { redirect: { destination: "/", permanent: false } };
  }

  notFound(): GetServerSidePropsResult<SSRPageProps<TProps>> {
    return { notFound: true };
  }

  success(props: TProps): GetServerSidePropsResult<SSRPageProps<TProps>> {
    return JSON.parse(
      JSON.stringify({
        props: { title: this.pageTitle, ...props },
      }),
    );
  }
}
