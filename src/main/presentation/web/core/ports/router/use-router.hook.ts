import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";

export const useRouter = () => {
  const { router } = useDepsContainer();
  return router;
};
