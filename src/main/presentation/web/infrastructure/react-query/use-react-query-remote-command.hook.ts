import { useMutation } from "@tanstack/react-query";
import { useNotificationContext } from "presentation/web/core/ports/notifications/use-notification-context.hook";
import { RemoteCommand } from "presentation/web/core/ports/remote-command/remote-command";
import {
  RemoteCommandOptions,
  useRemoteCommandHook,
} from "presentation/web/core/ports/remote-command/use-remote-command.hook";
import { useRemoteQueryService } from "presentation/web/core/ports/remote-query/use-remote-query-service.hook";
import { useHttpClient } from "presentation/web/core/shared/use-http-client.hook";

export const useReactQueryRemoteCommand: useRemoteCommandHook = <TArgs, TPathArgs, TResult>(
  options: RemoteCommandOptions<TArgs, TPathArgs, TResult>,
): RemoteCommand<TArgs, TPathArgs, TResult> => {
  const path = options.template.path(options.pathArgs);
  const httpClient = useHttpClient();
  const { setNotification } = useNotificationContext();
  const remoteQueryService = useRemoteQueryService();

  const mutation = useMutation((args: TArgs) => {
    if (!options.template.method || options.template.method === "POST")
      return httpClient.post<TArgs, TResult>(`/api/${path}`, args);
    else if (options.template.method === "DELETE")
      return httpClient.delete<TArgs, TResult>(`/api/${path}`, args);
    else if (options.template.method === "GET") return httpClient.get<TResult>(`/api/${path}`);
    `/api/${path}`;

    throw new Error(`Unknown command HTTP method : ${options.template.method}`);
  });

  const sendCommand = (
    args: TArgs,
    onSuccess?: (result: TResult) => void,
    onError?: (error: any) => void,
  ) => {
    mutation.mutate(args, {
      onSuccess: (result) => {
        if (onSuccess) onSuccess(result);
        if (options.queriesToInvalidateOnSuccess)
          options.queriesToInvalidateOnSuccess.forEach((options) =>
            remoteQueryService.invalidateQuery(options),
          );
        if (options.queriesToUpdateOnSuccess)
          options.queriesToUpdateOnSuccess.forEach((options) =>
            remoteQueryService.updateQuery(options, result),
          );
      },
      onError: (error: any) => {
        onError
          ? onError(error)
          : setNotification({
              type: "error",
              text: "Une erreur est survenue. Veuillez réessayer.",
              subText:
                process.env.NODE_ENV === "development"
                  ? `${error.message} : ${error.response?.data?.message}`
                  : undefined,
            });
      },
    });
  };

  return new RemoteCommand(sendCommand, mutation.isLoading);
};
