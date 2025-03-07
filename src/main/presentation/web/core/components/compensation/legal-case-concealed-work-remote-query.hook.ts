import { LegalCaseConcealedWorkRemoteQuery } from "presentation/web/core/components/compensation/legal-case-concealed-work.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useLegalCaseConcealedWorkRemoteQuery = (legalCaseId: string) => {
  return useRemoteQuery({
    template: LegalCaseConcealedWorkRemoteQuery,
    pathArgs: legalCaseId,
  });
};
