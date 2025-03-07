import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";

export const useHttpClient = () => {
  const { httpClient } = useDepsContainer();
  return httpClient;
};
