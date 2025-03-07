import { RemoteQuery } from "presentation/web/core/ports/remote-query/remote-query";
import { RemoteQueryOptions } from "presentation/web/core/ports/remote-query/use-remote-query.hook";
import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";

export const useRemoteQuery = <TSerializedData, TUnserializedData, TPathArgs>(
  options: RemoteQueryOptions<TSerializedData, TUnserializedData, TPathArgs>,
): RemoteQuery<TSerializedData, TUnserializedData, TPathArgs> => {
  const { useRemoteQuery } = useDepsContainer();
  return useRemoteQuery(options);
};
