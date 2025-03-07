import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";

export const useAuthService = () => {
  const { authService } = useDepsContainer();
  return authService;
};
