import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";

export const useCreateLegalCaseRemoteCommand = () => {
  return useRemoteCommand<void, void, string>({
    template: { path: () => `legal-case/create`, method: "POST" },
    pathArgs: undefined,
  });
};
