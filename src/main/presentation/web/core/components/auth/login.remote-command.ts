import { LoginDto } from "presentation/web/core/components/auth/auth.controller";
import { RemoteCommandTemplate } from "presentation/web/core/ports/remote-command/remote-command";

export const LoginRemoteCommandTemplate: RemoteCommandTemplate<
  LoginDto,
  void,
  { redirectBoxUuid?: string }
> = {
  path: () => "auth/login",
};
