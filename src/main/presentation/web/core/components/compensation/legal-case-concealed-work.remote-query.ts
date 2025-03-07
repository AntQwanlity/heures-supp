import { LegalCaseConcealedWorkView } from "presentation/web/core/components/compensation/legal-case-concealed-work.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const LegalCaseConcealedWorkRemoteQuery: RemoteQueryTemplate<
  LegalCaseConcealedWorkView,
  LegalCaseConcealedWorkView,
  string
> = {
  id: "legal-case-concealed-work",
  path: (legalCaseId) => `legal-case/${legalCaseId}/concealed-work`,
  unserialize: (v) => v,
};
