import { RemoteCommandOptions } from "presentation/web/core/ports/remote-command/use-remote-command.hook";
import { useDepsContainer } from "presentation/web/core/shared/use-deps-container.hook";

export const useRemoteCommand = <TArgs, TPathArgs, TResult>(
  options: RemoteCommandOptions<TArgs, TPathArgs, TResult>,
) => {
  const { useRemoteCommand } = useDepsContainer();
  return useRemoteCommand(options);
};
