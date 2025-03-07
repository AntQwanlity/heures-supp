import { User } from "core/components/auth/domain/user";
import { Request } from "core/ports/http/request";
import { LegalCaseHoursRecallRemoteQueryTemplate } from "presentation/web/core/components/compensation/legal-case-hours-recall.remote-query";
import { LegalCaseHoursRecallView } from "presentation/web/core/components/compensation/legal-case-hours-recall.view";
import { LegalCaseController } from "presentation/web/core/components/legal-case/legal-case.controller";
import { RemoteQueryPrefetch } from "presentation/web/core/ports/remote-query/remote-query-prefetch";
import { ServerModule } from "presentation/web/core/ports/server-module";

export const LegalCaseHoursRecallRemoteQueryPrefetch: RemoteQueryPrefetch<
  LegalCaseHoursRecallView,
  string
> = {
  template: LegalCaseHoursRecallRemoteQueryTemplate,
  getPathArgs: (req: Request<any, any, any>) => req.getParam("legalCaseId"),
  getData: async (user: User, serverModule: ServerModule, req) => {
    const controller = await serverModule.get(LegalCaseController);
    return controller.getLegalCaseHoursRecall(user, req.getParam("legalCaseId"));
  },
};
