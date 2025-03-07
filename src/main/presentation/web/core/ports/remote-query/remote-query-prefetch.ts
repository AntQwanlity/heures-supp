import { User } from "core/components/auth/domain/user";
import { Request } from "core/ports/http/request";
import { RemoteQueryTemplate } from "presentation/web/core/ports/remote-query/remote-query";
import { ServerModule } from "presentation/web/core/ports/server-module";

export type RemoteQueryPrefetch<TSerializedData, TPathArgs> = {
  template: RemoteQueryTemplate<TSerializedData, any, TPathArgs>;
  getPathArgs: (req: Request<any, any, any>) => TPathArgs;
  getData: (
    user: User,
    serverModule: ServerModule,
    req: Request<any, any, any>,
  ) => Promise<TSerializedData>;
};
