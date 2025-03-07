import {
  RemoteQuery,
  RemoteQueryTemplate,
} from "presentation/web/core/ports/remote-query/remote-query";

export type RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs> = {
  template: RemoteQueryTemplate<TSerializedData, TUnserializedData, TPathArgs>;
  enabled?: boolean;
  refetchInterval?: number;
  pathArgs: TPathArgs;
  onSuccess?: (data: TSerializedData) => void;
};

export type useRemoteQueryHook = <TSerializedData, TUnserializedData, TPathArgs>(
  options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
) => RemoteQuery<TSerializedData, TUnserializedData, TPathArgs>;
