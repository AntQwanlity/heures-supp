import { LegalCaseSalariesPeriodsRemoteQueryTemplate } from "presentation/web/core/components/legal-case/legal-case-salaries-periods.remote-query";
import { UpdateSalaryDto } from "presentation/web/core/components/legal-case/legal-case.controller";
import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";

export const useUpdateSalaryRemoteCommand = (legalCaseId: string) => {
  return useRemoteCommand<UpdateSalaryDto, void, void>({
    template: { path: () => `legal-case/${legalCaseId}/salaries/update` },
    pathArgs: undefined,
    queriesToUpdateOnSuccess: [
      {
        template: LegalCaseSalariesPeriodsRemoteQueryTemplate,
        pathArgs: legalCaseId,
      },
    ],
  });
};
