import { LegalCaseHoursRecallRemoteQueryTemplate } from "presentation/web/core/components/compensation/legal-case-hours-recall.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useLegalCaseHoursRecallRemoteQuery = (legalCaseId: string) => {
  return useRemoteQuery({
    template: LegalCaseHoursRecallRemoteQueryTemplate,
    pathArgs: legalCaseId,
  });
};
