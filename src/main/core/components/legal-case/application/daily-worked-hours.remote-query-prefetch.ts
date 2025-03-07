import { User } from "core/components/auth/domain/user";
import { LegalCaseAppService } from "core/components/legal-case/application/legal-case-app.service";
import { Request } from "core/ports/http/request";
import { DailyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/daily-worked-hours.remote-query";
import { DailyWorkedHoursView } from "presentation/web/core/components/worked-hours/daily-worked-hours.view";
import { RemoteQueryPrefetch } from "presentation/web/core/ports/remote-query/remote-query-prefetch";
import { ServerModule } from "presentation/web/core/ports/server-module";

export const DailyWorkedHoursRemoteQueryPrefetch: RemoteQueryPrefetch<
  DailyWorkedHoursView,
  { legalCaseId: string; magicLinkToken: string | undefined }
> = {
  template: DailyWorkedHoursRemoteQuery,
  getPathArgs: (req: Request<any, any, any>) => ({
    legalCaseId: req.getParam("legalCaseId"),
    magicLinkToken: req.findQueryParam("token"),
  }),
  getData: async (user: User, serverModule: ServerModule, req) => {
    const appService = await serverModule.get(LegalCaseAppService);
    return DailyWorkedHoursView.create(
      await appService.getDailyWorkedHours(
        user,
        req.getParam("legalCaseId"),
        req.findQueryParam("token"),
      ),
    );
  },
};
