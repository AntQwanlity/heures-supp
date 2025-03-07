import { Injectable } from "@nestjs/common";
import { dehydrate, QueryClient } from "@tanstack/query-core";
import { HydrationService } from "core/ports/hydration/hydration.service";
import compact from "lodash/compact";
import { RemoteQueryOptions } from "presentation/web/core/ports/remote-query/use-remote-query.hook";

@Injectable()
export class ReactQueryHydrationService implements HydrationService {
  constructor(private readonly queryClient: QueryClient) {}

  hydrateQuery<TSerializedData, TUnserializedData, TPathArgs>(
    options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
    value: TSerializedData,
  ) {
    return this.queryClient.prefetchQuery(
      compact([options.template.id, options.pathArgs]),
      () => value,
    );
  }

  getHydratedData() {
    return Promise.resolve({ dehydratedState: dehydrate(this.queryClient) });
  }

  clear(): Promise<void> {
    this.queryClient.clear();
    return Promise.resolve();
  }
}
