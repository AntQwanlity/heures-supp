import { CMSService } from "core/ports/cms/cms.service";
import { getNestApp } from "infrastructure/nest-app";
import { GetStaticProps, GetStaticPropsContext } from "next";
import { ServerModule } from "presentation/web/core/ports/server-module";
import {
  SSGPageProps,
  SSGRequest,
} from "presentation/web/infrastructure/next/server/request/ssg-request";
import { ParsedUrlQuery } from "querystring";

export const createGetStaticProps =
  <TProps>(
    title: string,
    fetch: (
      cmsService: CMSService,
      serverModule: ServerModule,
      params?: ParsedUrlQuery,
    ) => Promise<TProps | undefined>,
  ): GetStaticProps<SSGPageProps<TProps>> =>
  async (nextContext: GetStaticPropsContext) => {
    const request = new SSGRequest<TProps>(nextContext, title);
    const app = await getNestApp();

    const cmsService = app.get(CMSService);
    const serverModule = app.get(ServerModule);
    const data = await fetch(cmsService, serverModule, request.context.params);

    if (!data) return request.notFound();

    return request.success(data);
  };
