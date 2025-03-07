import { LegalCase } from "core/components/legal-case/domain/legal-case";
import { LegalCaseView } from "presentation/web/core/components/legal-case/legal-case.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const LegalCaseRemoteQueryTemplate: RemoteQueryTemplate<LegalCaseView, LegalCase, string> = {
  id: "legal-case",
  path: (legalCaseId) => `legal-case/${legalCaseId}`,
  unserialize: (legalCaseView) => LegalCaseView.toDomain(legalCaseView),
};
