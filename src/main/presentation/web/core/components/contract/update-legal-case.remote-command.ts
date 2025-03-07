import { UpdateLegalCaseDto } from "presentation/web/core/components/legal-case/legal-case.controller";
import { LegalCaseRemoteQueryTemplate } from "presentation/web/core/components/legal-case/legal-case.remote-query";
import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";

export const useUpdateLegalCaseRemoteCommand = (legalCaseId: string) => {
  return useRemoteCommand<UpdateLegalCaseDto, void, void>({
    template: { path: () => `legal-case/${legalCaseId}` },
    pathArgs: undefined,
    queriesToInvalidateOnSuccess: [
      {
        template: LegalCaseRemoteQueryTemplate,
        pathArgs: legalCaseId,
      },
    ],
  });
};
