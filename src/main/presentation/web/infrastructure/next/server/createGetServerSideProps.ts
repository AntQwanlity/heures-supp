import { Logger } from "@nestjs/common";
import { User } from "core/components/auth/domain/user";
import { ExternalAuthService } from "core/ports/auth/external-auth.service";
import { HydrationService } from "core/ports/hydration/hydration.service";
import { UnauthorizedError } from "core/shared-kernel/unauthorized.error";
import { getNestApp } from "infrastructure/nest-app";
import { GetServerSideProps } from "next";
import { GetServerSidePropsContext } from "next/types";
import { RemoteQueryPrefetch } from "presentation/web/core/ports/remote-query/remote-query-prefetch";
import { ServerModule } from "presentation/web/core/ports/server-module";
import {
  SSRPageProps,
  SSRRequest,
} from "presentation/web/infrastructure/next/server/request/ssr-request";
import { ParsedUrlQuery } from "querystring";

export const createGetServerSideProps =
  <TProps, TParams extends ParsedUrlQuery>(
    pageTitle: string,
    prefetches: RemoteQueryPrefetch<any, any>[],
    requireAuth = true,
  ): GetServerSideProps<SSRPageProps<TProps>, TParams> =>
  async (nextContext: GetServerSidePropsContext<TParams, any>) => {
    const request = new SSRRequest<TProps, TParams>(nextContext, pageTitle);
    const app = await getNestApp();

    const serverModule = app.get(ServerModule);

    const hydrationService = await app.resolve(HydrationService);
    const authService = app.get(ExternalAuthService);

    try {
      const authResult = await authService.authenticate(request, requireAuth);

      await Promise.all(
        prefetches.map(async (prefetch) => {
          const pathArgs = prefetch.getPathArgs(request);
          await hydrationService.hydrateQuery(
            { template: prefetch.template, pathArgs },
            await prefetch.getData(authResult?.user as User, serverModule, request),
          );
        }),
      );

      const prefetchedData = await hydrationService.getHydratedData();
      await hydrationService.clear();

      return request.success({ ...prefetchedData, ...nextContext.params, user: authResult?.user });
    } catch (error: any) {
      if (error instanceof UnauthorizedError) {
        Logger.warn(`Unauthorized request : ${error.message}`);
        return request.unauthorized();
      }
      throw error;
    }
  };
