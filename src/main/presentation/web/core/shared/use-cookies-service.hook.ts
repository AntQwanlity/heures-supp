import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";

export const useCookiesService = () => {
  const { cookiesService } = useDepsContainer();
  return cookiesService;
};
