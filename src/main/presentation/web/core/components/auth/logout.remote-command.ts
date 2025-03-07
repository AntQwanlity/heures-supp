import { RemoteCommandTemplate } from "presentation/web/core/ports/remote-command/remote-command";

export const LogoutRemoteCommandTemplate: RemoteCommandTemplate = {
  path: () => "auth/logout",
};
