import { User } from "core/components/auth/domain/user";
import { Request } from "core/ports/http/request";
import { LegalCaseSalariesPeriodsRemoteQueryTemplate } from "presentation/web/core/components/legal-case/legal-case-salaries-periods.remote-query";
import { LegalCaseSalariesPeriodsView } from "presentation/web/core/components/legal-case/legal-case-salaries-periods.view";
import { LegalCaseController } from "presentation/web/core/components/legal-case/legal-case.controller";
import { RemoteQueryPrefetch } from "presentation/web/core/ports/remote-query/remote-query-prefetch";
import { ServerModule } from "presentation/web/core/ports/server-module";

export const LegalCaseSalariesPeriodsRemoteQueryPrefetch: RemoteQueryPrefetch<
  LegalCaseSalariesPeriodsView,
  string
> = {
  template: LegalCaseSalariesPeriodsRemoteQueryTemplate,
  getPathArgs: (req: Request<any, any, any>) => req.getParam("legalCaseId"),
  getData: async (user: User, serverModule: ServerModule, req) => {
    const controller = await serverModule.get(LegalCaseController);
    return controller.getLegalCaseSalariesPeriods(user, req.getParam("legalCaseId"));
  },
};
