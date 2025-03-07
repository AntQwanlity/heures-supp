import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";

export const useRemoteQueryService = () => {
  const { remoteQueryService } = useDepsContainer();
  return remoteQueryService;
};
