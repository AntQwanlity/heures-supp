import { User } from "core/components/auth/domain/user";
import { Request } from "core/ports/http/request";
import { LegalCaseController } from "presentation/web/core/components/legal-case/legal-case.controller";
import { LegalCaseRemoteQueryTemplate } from "presentation/web/core/components/legal-case/legal-case.remote-query";
import { LegalCaseView } from "presentation/web/core/components/legal-case/legal-case.view";
import { RemoteQueryPrefetch } from "presentation/web/core/ports/remote-query/remote-query-prefetch";
import { ServerModule } from "presentation/web/core/ports/server-module";

export const LegalCaseRemoteQueryPrefetch: RemoteQueryPrefetch<LegalCaseView, string> = {
  template: LegalCaseRemoteQueryTemplate,
  getPathArgs: (req: Request<any, any, any>) => req.getParam("legalCaseId"),
  getData: async (user: User, serverModule: ServerModule, req) => {
    const controller = await serverModule.get(LegalCaseController);
    return controller.getLegalCase(user, req.getParam("legalCaseId"));
  },
};
