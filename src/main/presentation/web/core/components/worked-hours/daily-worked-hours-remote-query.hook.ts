import { DailyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/daily-worked-hours.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useDailyWorkedHoursRemoteQuery = (
  legalCaseId: string,
  magicLinkToken: string | undefined,
) => {
  return useRemoteQuery({
    template: DailyWorkedHoursRemoteQuery,
    refetchInterval: 0,
    pathArgs: { legalCaseId, magicLinkToken },
  });
};
