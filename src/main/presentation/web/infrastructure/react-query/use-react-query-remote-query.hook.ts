import { useQuery } from "@tanstack/react-query";
import compact from "lodash/compact";
import {
  RemoteQuery,
  RemoteQueryTemplate,
} from "presentation/web/core/ports/remote-query/remote-query";
import {
  RemoteQueryOptions,
  useRemoteQueryHook,
} from "presentation/web/core/ports/remote-query/use-remote-query.hook";
import { useHttpClient } from "presentation/web/core/shared/use-http-client.hook";

class ReactQueryRemoteQuery<TSerializedData, TUnserializedData, TPathArgs> extends RemoteQuery<
  TSerializedData,
  TUnserializedData,
  TPathArgs
> {
  constructor(
    readonly template: RemoteQueryTemplate<TSerializedData, TUnserializedData, TPathArgs>,
    private readonly refetchFn: () => Promise<any>,
    readonly serializedData?: TSerializedData,
  ) {
    super(template, serializedData);
  }

  async refetch(): Promise<void> {
    return this.refetchFn();
  }
}

export const useReactQueryRemoteQuery: useRemoteQueryHook = <
  TSerializedData,
  TUnserializedData,
  TPathArgs,
>(
  options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
): RemoteQuery<TSerializedData, TUnserializedData, TPathArgs> => {
  const httpClient = useHttpClient();

  const key = compact([options.template.id, options.pathArgs]);
  const path = options.template.path(options.pathArgs);

  const { data, refetch } = useQuery<TSerializedData>(
    key,
    () => httpClient.get<TSerializedData>(`/api/${path}`),
    {
      enabled: options.enabled ?? true,
      staleTime: 10000,
      refetchInterval: options.refetchInterval ?? 20000,
      onSuccess: options.onSuccess,
    },
  );

  return new ReactQueryRemoteQuery<TSerializedData, TUnserializedData, TPathArgs>(
    options.template as any,
    refetch,
    data,
  );
};
