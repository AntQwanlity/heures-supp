import { LoginRemoteCommandTemplate } from "presentation/web/core/components/auth/login.remote-command";
import { useAuthService } from "presentation/web/core/components/auth/use-auth-service.hook";
import { LegalCaseView } from "presentation/web/core/components/legal-case/legal-case.view";
import { useLegalCasesRemoteQuery } from "presentation/web/core/components/legal-case/legal-cases.remote-query";
import { useNotificationContext } from "presentation/web/core/ports/notifications/use-notification-context.hook";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { SubmitPrimaryButton } from "presentation/web/core/shared/buttons/submit-primary-button";
import { Checkbox } from "presentation/web/core/shared/forms/checkbox";
import { Form } from "presentation/web/core/shared/forms/form";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import { GoogleIcon } from "presentation/web/core/shared/icons/google-icon";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { Image } from "presentation/web/core/shared/image";
import { Link } from "presentation/web/core/shared/links/link";
import { PrimaryLink } from "presentation/web/core/shared/links/primary-link";
import { useCookiesService } from "presentation/web/core/shared/use-cookies-service.hook";
import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";
import React, { useState } from "react";

export type LoginPageProps = {};

type LoginForm = {
  email: string;
  password: string;
};

export const LoginPage: React.FC<LoginPageProps> = () => {
  const router = useRouter();
  const authService = useAuthService();
  const cookiesService = useCookiesService();
  const { setNotification } = useNotificationContext();

  const loginCommand = useRemoteCommand({
    template: LoginRemoteCommandTemplate,
    pathArgs: undefined,
  });

  const onLegalCasesLoaded = (data: LegalCaseView[]) => {
    if (data.length == 0) {
      onError("Une erreur est survenue.");
      return;
    }

    router.redirect(`/app/legal-case/${data[0].id}/contract`);
  };

  const [enableLegalCasesQuery, setEnableLegalCasesQuery] = useState(false);
  useLegalCasesRemoteQuery(enableLegalCasesQuery, onLegalCasesLoaded);

  const [showSpinner, setShowSpinner] = useState(false);

  const onError = (message: string) => {
    setNotification({ type: "error", text: message });
    setShowSpinner(false);
  };

  const onEmailPasswordLogin = async (data: LoginForm) => {
    setShowSpinner(true);
    try {
      const idToken = await authService.login(data.email, data.password);
      const csrfToken = cookiesService.get("csrfToken");

      if (!csrfToken) throw new Error("No CSRF token found in cookies.");

      loginCommand.send(
        {
          idToken,
          csrfToken,
        },
        () => {
          setEnableLegalCasesQuery(true);
        },
        () => {
          onError("Impossible de vous connecter avec ces identifiants.");
        },
      );
    } catch (e: any) {
      onError(e.message);
    }
  };

  const onGoogleLogin = async () => {
    setShowSpinner(true);
    try {
      const result = await authService.googleLogin();
      const csrfToken = cookiesService.get("csrfToken");

      if (!csrfToken) return;

      loginCommand.send(
        {
          idToken: result.token,
          csrfToken,
        },
        () => {
          setEnableLegalCasesQuery(true);
        },
        () => {
          onError("Impossible de vous connecter avec ces identifiants.");
        },
      );
    } catch (e: any) {
      onError(e.message);
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <Image src="/hs.png" width={205} height={50} alt="Logo" topQuality className="mx-auto" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-extrabold tracking-tight text-gray-900">
          Connexion
        </h2>
      </div>

      <Form<LoginForm> onSubmit={onEmailPasswordLogin}>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <TextInput
                name="email"
                type="email"
                label="Adresse e-mail"
                required
                autoComplete="email"
              />
              <TextInput
                name="password"
                type="password"
                label="Mot de passe"
                required
                autoComplete="current-password"
              />
              <div className="flex items-center justify-between">
                <Checkbox name="remember-me" label="Se souvenir de moi" />

                <div className="text-sm">
                  <PrimaryLink href="/app/reset-password">Mot de passe oublié ?</PrimaryLink>
                </div>
              </div>

              <div>
                <SubmitPrimaryButton label="Connexion" showSpinner={showSpinner} />
              </div>
            </div>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Ou continuer avec</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3">
                <div>
                  <button
                    onClick={onGoogleLogin}
                    disabled={showSpinner}
                    className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                  >
                    <span className="sr-only">Google</span>
                    <Icon Component={GoogleIcon} />
                  </button>
                </div>
              </div>
              <div className="mt-6 text-center text-sm">
                <span className="p-2 bg-white text-gray-500">
                  Pas encore inscrit ?{" "}
                  <PrimaryLink href="/app/signup">Créez votre compte</PrimaryLink>
                </span>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
