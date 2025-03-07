import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";

export const useSendMagicLinkRemoteCommand = (legalCaseId: string) => {
  return useRemoteCommand<void, void, void>({
    template: { path: () => `legal-case/${legalCaseId}/send-magic-link` },
    pathArgs: undefined,
  });
};
