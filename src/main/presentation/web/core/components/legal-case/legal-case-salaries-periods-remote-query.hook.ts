import { LegalCaseSalariesPeriodsRemoteQueryTemplate } from "presentation/web/core/components/legal-case/legal-case-salaries-periods.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useLegalCaseSalariesPeriodsRemoteQuery = (legalCaseId: string) => {
  return useRemoteQuery({
    template: LegalCaseSalariesPeriodsRemoteQueryTemplate,
    pathArgs: legalCaseId,
  });
};
