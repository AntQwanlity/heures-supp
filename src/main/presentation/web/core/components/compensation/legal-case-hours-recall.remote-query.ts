import { LegalCaseHoursRecallView } from "presentation/web/core/components/compensation/legal-case-hours-recall.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const LegalCaseHoursRecallRemoteQueryTemplate: RemoteQueryTemplate<
  LegalCaseHoursRecallView,
  LegalCaseHoursRecallView,
  string
> = {
  id: "legal-case-hours-recall",
  path: (legalCaseId) => `legal-case/${legalCaseId}/hours-recall`,
  unserialize: (v) => v,
};
