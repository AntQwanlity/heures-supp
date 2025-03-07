import { LegalCaseSalariesPeriodsView } from "presentation/web/core/components/legal-case/legal-case-salaries-periods.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const LegalCaseSalariesPeriodsRemoteQueryTemplate: RemoteQueryTemplate<
  LegalCaseSalariesPeriodsView,
  LegalCaseSalariesPeriodsView,
  string
> = {
  id: "legal-case-salaries-periods",
  path: (legalCaseId) => `legal-case/${legalCaseId}/salaries-periods`,
  unserialize: (v) => v,
};
