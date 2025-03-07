import { WeeklyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/weekly-worked-hours.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useWeeklyWorkedHoursRemoteQuery = (legalCaseId: string) => {
  return useRemoteQuery({
    template: WeeklyWorkedHoursRemoteQuery,
    pathArgs: legalCaseId,
  });
};
