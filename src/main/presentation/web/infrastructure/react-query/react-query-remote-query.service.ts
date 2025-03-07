import { QueryClient } from "@tanstack/query-core";
import compact from "lodash/compact";
import { RemoteQueryService } from "presentation/web/core/ports/remote-query/remote-query.service";
import { RemoteQueryOptions } from "presentation/web/core/ports/remote-query/use-remote-query.hook";

export class ReactQueryRemoteQueryService implements RemoteQueryService {
  constructor(private readonly queryClient: QueryClient) {}

  invalidateQuery<TSerializedData, TUnserializedData, TPathArgs>(
    options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
  ) {
    return this.queryClient.invalidateQueries(compact([options.template.id, options.pathArgs]));
  }

  updateQuery<TSerializedData, TUnserializedData, TPathArgs>(
    options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
    data: TSerializedData,
  ): void {
    this.queryClient.setQueryData(compact([options.template.id, options.pathArgs]), data);
  }
}
