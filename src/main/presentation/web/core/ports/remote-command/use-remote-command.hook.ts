import {
  RemoteCommand,
  RemoteCommandTemplate,
} from "presentation/web/core/ports/remote-command/remote-command";
import { RemoteQueryOptions } from "presentation/web/core/ports/remote-query/use-remote-query.hook";

export type RemoteCommandOptions<TArgs, TPathArgs, TResult> = {
  template: RemoteCommandTemplate<TArgs, TPathArgs, TResult>;
  queriesToInvalidateOnSuccess?: RemoteQueryOptions<any, any, any>[];
  queriesToUpdateOnSuccess?: RemoteQueryOptions<any, any, any>[];
  pathArgs: TPathArgs;
};

export type useRemoteCommandHook = <TArgs, TPathArgs, TResult>(
  options: RemoteCommandOptions<TArgs, TPathArgs, TResult>,
) => RemoteCommand<TArgs, TPathArgs, TResult>;
