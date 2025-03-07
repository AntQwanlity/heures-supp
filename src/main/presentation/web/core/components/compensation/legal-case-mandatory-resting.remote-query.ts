import { LegalCaseMandatoryRestingView } from "presentation/web/core/components/compensation/legal-case-mandatory-resting.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const LegalCaseMandatoryRestingRemoteQuery: RemoteQueryTemplate<
  LegalCaseMandatoryRestingView,
  LegalCaseMandatoryRestingView,
  string
> = {
  id: "legal-case-mandatory-resting",
  path: (legalCaseId) => `legal-case/${legalCaseId}/mandatory-resting`,
  unserialize: (v) => v,
};
