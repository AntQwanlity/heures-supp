import { SignUpInputDto } from "presentation/web/core/components/lawyer/lawyer.controller";
import { RemoteCommandTemplate } from "presentation/web/core/ports/remote-command/remote-command";

export const SignUpRemoteCommand: RemoteCommandTemplate<SignUpInputDto> = {
  path: () => "lawyer/signup",
};
