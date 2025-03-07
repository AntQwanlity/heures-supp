import { YearlyWorkedHoursView } from "presentation/web/core/components/worked-hours/yearly-worked-hours.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const YearlyWorkedHoursRemoteQuery: RemoteQueryTemplate<
  YearlyWorkedHoursView,
  YearlyWorkedHoursView,
  string
> = {
  id: "legal-case-yearly-worked-hours",
  path: (legalCaseId) => `legal-case/${legalCaseId}/yearly-worked-hours`,
  unserialize: (v) => v,
};
