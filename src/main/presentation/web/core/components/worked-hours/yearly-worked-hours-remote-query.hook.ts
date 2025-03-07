import { YearlyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/yearly-worked-hours.remote-query";
import { useRemoteQuery } from "presentation/web/core/shared/use-remote-query.hook";

export const useYearlyWorkedHoursRemoteQuery = (legalCaseId: string) => {
  return useRemoteQuery({
    template: YearlyWorkedHoursRemoteQuery,
    pathArgs: legalCaseId,
  });
};
