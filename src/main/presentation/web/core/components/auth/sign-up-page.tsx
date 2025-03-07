import { SignUpRemoteCommand } from "presentation/web/core/components/auth/sign-up.remote-command";
import { useAuthService } from "presentation/web/core/components/auth/use-auth-service.hook";
import { LegalCaseView } from "presentation/web/core/components/legal-case/legal-case.view";
import { useLegalCasesRemoteQuery } from "presentation/web/core/components/legal-case/legal-cases.remote-query";
import { GoogleAuthResponse } from "presentation/web/core/ports/auth/auth-service";
import { useNotificationContext } from "presentation/web/core/ports/notifications/use-notification-context.hook";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { SubmitPrimaryButton } from "presentation/web/core/shared/buttons/submit-primary-button";
import { Form } from "presentation/web/core/shared/forms/form";
import { RadioGroup } from "presentation/web/core/shared/forms/radio-group";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import { GoogleIcon } from "presentation/web/core/shared/icons/google-icon";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { Image } from "presentation/web/core/shared/image";
import { Link } from "presentation/web/core/shared/links/link";
import { PrimaryLink } from "presentation/web/core/shared/links/primary-link";
import { useCookiesService } from "presentation/web/core/shared/use-cookies-service.hook";
import { useRemoteCommand } from "presentation/web/core/shared/use-remote-command.hook";
import React, { useState } from "react";

export type SignUpPageProps = {};

type SignUpForm = {
  email: string;
  password: string;
  userType: "lawyer" | "employee";
};

export const SignUpPage: React.FC<SignUpPageProps> = () => {
  const router = useRouter();
  const authService = useAuthService();
  const cookiesService = useCookiesService();
  const { setNotification } = useNotificationContext();

  const signUpCommand = useRemoteCommand({
    template: SignUpRemoteCommand,
    pathArgs: undefined,
  });

  const [showSpinner, setShowSpinner] = useState(false);

  const onError = (message: string) => {
    setNotification({ type: "error", text: message });
    setShowSpinner(false);
  };

  const onLegalCasesLoaded = (data: LegalCaseView[]) => {
    if (data.length == 0) {
      onError("Une erreur est survenue.");
      return;
    }

    router.redirect(`/app/legal-case/${data[0].id}/contract`);
  };

  const [enableLegalCasesQuery, setEnableLegalCasesQuery] = useState(false);
  useLegalCasesRemoteQuery(enableLegalCasesQuery, onLegalCasesLoaded);

  const onEmailPasswordSignup = async (data: SignUpForm) => {
    setShowSpinner(true);
    try {
      const idToken = await authService.signUp(data.email, data.password);
      const csrfToken = cookiesService.get("csrfToken");

      if (!csrfToken) throw new Error("No CSRF token found in cookies.");

      signUpCommand.send(
        {
          email: data.email,
          userType: data.userType,
          idToken,
          csrfToken,
        },
        () => {
          setEnableLegalCasesQuery(true);
        },
        async () => {
          await authService.deleteUser();
          onError("Une erreur est survenue. Veuillez réessayer.");
        },
      );
    } catch (e: any) {
      onError(e.message);
    }
  };

  const [googleSignUpResult, setGoogleSignUpResult] = useState<GoogleAuthResponse | undefined>(
    undefined,
  );
  const onGoogleSignUpInit = async () => {
    setShowSpinner(true);
    try {
      const result = await authService.googleSignUp();
      setShowSpinner(false);
      setGoogleSignUpResult(result);
    } catch (e: any) {
      onError(e.message);
    }
  };

  const onGoogleSignUp = async (data: SignUpForm) => {
    if (!googleSignUpResult) return;

    const csrfToken = cookiesService.get("csrfToken");

    if (!csrfToken) throw new Error("No CSRF token found in cookies.");

    setShowSpinner(true);

    signUpCommand.send(
      {
        email: googleSignUpResult.email,
        userType: data.userType,
        idToken: googleSignUpResult.token,
        csrfToken,
      },
      () => {
        setEnableLegalCasesQuery(true);
      },
      async () => {
        await authService.deleteUser();
        onError("Une erreur est survenue. Veuillez réessayer.");
      },
    );
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <Image src="/hs.png" width={205} height={50} alt="Logo" topQuality className="mx-auto" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Inscription
        </h2>
      </div>

      <Form<SignUpForm> onSubmit={googleSignUpResult ? onGoogleSignUp : onEmailPasswordSignup}>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <TextInput
                name="email"
                type="email"
                label="Adresse e-mail"
                autoComplete="email"
                required={!googleSignUpResult}
                placeholder={googleSignUpResult ? googleSignUpResult.email : undefined}
                disabled={!!googleSignUpResult}
              />
              {!googleSignUpResult && (
                <TextInput
                  name="password"
                  type="password"
                  label="Mot de passe"
                  required
                  minLength={6}
                  autoComplete="new-password"
                />
              )}
              <RadioGroup
                name="userType"
                label="Utilisation"
                options={[
                  { label: "Je suis avocat", name: "lawyer" },
                  { label: "Je suis salarié", name: "employee" },
                ]}
                required
              />
              <div>
                <SubmitPrimaryButton label="Créer mon compte" showSpinner={showSpinner} />
              </div>
            </div>

            {!googleSignUpResult && (
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="bg-white px-2 text-gray-500">ou continuer avec</span>
                  </div>
                </div>

                <div className="mt-6 grid grid-cols-1 gap-3">
                  <div>
                    <button
                      onClick={onGoogleSignUpInit}
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
                    Déjà inscrit ? <PrimaryLink href="/app/login">Connexion</PrimaryLink>
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </Form>
    </div>
  );
};
