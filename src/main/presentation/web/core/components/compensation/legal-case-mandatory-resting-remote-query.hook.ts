import { LegalCaseMandatoryRestingRemoteQuery } from "presentation/web/core/components/compensation/legal-case-mandatory-resting.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useLegalCaseMandatoryRestingRemoteQuery = (legalCaseId: string) => {
  return useRemoteQuery({
    template: LegalCaseMandatoryRestingRemoteQuery,
    pathArgs: legalCaseId,
  });
};
