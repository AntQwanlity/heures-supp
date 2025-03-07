import { LegalCaseRemoteQueryTemplate } from "presentation/web/core/components/legal-case/legal-case.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useLegalCaseRemoteQuery = (legalCaseId: string, enabled: boolean) => {
  return useRemoteQuery({
    template: LegalCaseRemoteQueryTemplate,
    pathArgs: legalCaseId,
    enabled,
  });
};
