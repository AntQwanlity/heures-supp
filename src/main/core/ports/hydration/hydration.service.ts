import { RemoteQueryOptions } from "presentation/web/core/ports/remote-query/use-remote-query.hook";

export abstract class HydrationService {
  abstract hydrateQuery<TSerializedData, TUnserializedData, TPathArgs>(
    options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
    value: TSerializedData,
  ): Promise<void>;

  abstract getHydratedData(): Promise<any>;

  abstract clear(): Promise<void>;
}
