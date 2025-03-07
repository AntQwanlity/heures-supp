import { DailyWorkedHoursView } from "presentation/web/core/components/worked-hours/daily-worked-hours.view";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";

export const DailyWorkedHoursRemoteQuery: RemoteQueryTemplate<
  DailyWorkedHoursView,
  DailyWorkedHoursView,
  { legalCaseId: string; magicLinkToken: string | undefined }
> = {
  id: "legal-case-daily-worked-hours",
  path: ({ legalCaseId, magicLinkToken }) =>
    `legal-case/${legalCaseId}/daily-worked-hours?token=${magicLinkToken}`,
  unserialize: (v) => v,
};
