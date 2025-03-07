import { CMSService } from "core/ports/cms/cms.service";
import { getNestApp } from "infrastructure/nest-app";
import { GetStaticPaths } from "next";
import { ServerModule } from "presentation/web/core/ports/server-module";
import { ParsedUrlQuery } from "querystring";

export const createGetStaticPaths =
  <TParams extends ParsedUrlQuery>(
    fetchPaths: (cmsService: CMSService, serverModule: ServerModule) => Promise<TParams[]>,
  ): GetStaticPaths<TParams> =>
  async () => {
    const app = await getNestApp();

    const cmsService = app.get(CMSService);
    const serverModule = app.get(ServerModule);
    const params = await fetchPaths(cmsService, serverModule);
    return {
      paths: params.map((p) => ({ params: p })),
      fallback: "blocking",
    };
  };
