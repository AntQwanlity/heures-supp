import { User } from "core/components/auth/domain/user";
import { Request } from "core/ports/http/request";
import { LegalCaseController } from "presentation/web/core/components/legal-case/legal-case.controller";
import { LegalCaseView } from "presentation/web/core/components/legal-case/legal-case.view";
import { LegalCasesRemoteQueryTemplate } from "presentation/web/core/components/legal-case/legal-cases.remote-query";
import { RemoteQueryPrefetch } from "presentation/web/core/ports/remote-query/remote-query-prefetch";
import { ServerModule } from "presentation/web/core/ports/server-module";

export const LegalCasesRemoteQueryPrefetch: RemoteQueryPrefetch<LegalCaseView[], undefined> = {
  template: LegalCasesRemoteQueryTemplate,
  getPathArgs: (req: Request<any, any, any>) => undefined,
  getData: async (user: User, serverModule: ServerModule, req) => {
    const controller = await serverModule.get(LegalCaseController);
    return controller.getLegalCases(user);
  },
};
