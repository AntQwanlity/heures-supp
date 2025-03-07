import { RemoteQueryOptions } from "presentation/web/core/ports/remote-query/use-remote-query.hook";

export abstract class RemoteQueryService {
  abstract invalidateQuery<TSerializedData, TUnserializedData, TPathArgs>(
    options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
  ): Promise<void>;

  abstract updateQuery<TSerializedData, TUnserializedData, TPathArgs>(
    options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
    data: TSerializedData,
  ): void;
}
