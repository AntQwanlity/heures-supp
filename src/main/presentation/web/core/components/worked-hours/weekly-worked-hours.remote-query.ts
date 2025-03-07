import { WeeklyWorkedHoursView } from "presentation/web/core/components/worked-hours/weekly-worked-hours.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const WeeklyWorkedHoursRemoteQuery: RemoteQueryTemplate<
  WeeklyWorkedHoursView,
  WeeklyWorkedHoursView,
  string
> = {
  id: "legal-case-weekly-worked-hours",
  path: (legalCaseId) => `legal-case/${legalCaseId}/weekly-worked-hours`,
  unserialize: (v) => v,
};
