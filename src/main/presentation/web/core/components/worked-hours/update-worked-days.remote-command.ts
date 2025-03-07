import { UpdateWorkedDaysDto } from "presentation/web/core/components/legal-case/legal-case.controller";
import { DailyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/daily-worked-hours.remote-query";
import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";

export const useUpdateWorkedDaysRemoteCommand = (legalCaseId: string, magicLinkToken?: string) => {
  return useRemoteCommand<UpdateWorkedDaysDto, void, void>({
    template: {
      path: () => `legal-case/${legalCaseId}/worked-days/update?token=${magicLinkToken}`,
    },
    pathArgs: undefined,
    queriesToInvalidateOnSuccess: [
      { template: DailyWorkedHoursRemoteQuery, pathArgs: { legalCaseId, magicLinkToken } },
    ],
  });
};
