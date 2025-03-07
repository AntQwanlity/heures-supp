import { useAuthService } from "presentation/web/core/components/auth/use-auth-service.hook";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { ButtonLink } from "presentation/web/core/shared/buttons/button-link";
import { SubmitPrimaryButton } from "presentation/web/core/shared/buttons/submit-primary-button";
import { Form } from "presentation/web/core/shared/forms/form";
import { FormResetButton } from "presentation/web/core/shared/forms/reset-button";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import { Image } from "presentation/web/core/shared/image";
import { Link } from "presentation/web/core/shared/links/link";
import { PrimaryLink } from "presentation/web/core/shared/links/primary-link";
import React, { useState } from "react";

export type ResetPasswordPageProps = {};

type ResetPasswordForm = {
  email: string;
};

export const ResetPasswordPage: React.FC<ResetPasswordPageProps> = () => {
  const authService = useAuthService();

  const [showSpinner, setShowSpinner] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSuccess = () => {
    setShowSpinner(false);
    setShowConfirm(true);
  };

  const onError = () => {
    setShowSpinner(false);
    setShowConfirm(true);
  };

  const onResetPassword = async (data: ResetPasswordForm) => {
    setShowSpinner(true);
    try {
      await authService.resetPassword(data.email);
      onSuccess();
    } catch (e: any) {
      onError();
    }
  };

  return (
    <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link href="/">
          <Image src="/hs.png" width={205} height={50} alt="Logo" topQuality className="mx-auto" />
        </Link>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          {showConfirm ? <>Merci !</> : <>Mot de passe oublié</>}
        </h2>
      </div>

      <Form<ResetPasswordForm> onSubmit={onResetPassword}>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
            <div className="space-y-6">
              <span className="bg-white text-gray-500">
                {showConfirm ? (
                  <>
                    Si l'email que vous avez entré correspond à un compte chez nous, nous vous avons
                    envoyé un email contenant des instructions pour réinitialiser votre mot de
                    passe.
                    <br />
                    Si vous n'avez pas reçu d'email dans les 5 minutes, vérifiez votre spam,{" "}
                    <ButtonLink onClick={() => setShowConfirm(false)}>réessayez</ButtonLink>, ou{" "}
                    <FormResetButton onClick={() => setShowConfirm(false)}>
                      essayez avec un autre email
                    </FormResetButton>
                    .
                  </>
                ) : (
                  <>
                    Entrez l'email associé à votre compte et nous vous enverrons un lien pour
                    réinitialiser.
                  </>
                )}
              </span>
              {showConfirm ? null : (
                <>
                  <TextInput
                    name="email"
                    type="email"
                    label="Adresse e-mail"
                    autoComplete="email"
                    required
                  />
                  <div>
                    <SubmitPrimaryButton label="Continuer" showSpinner={showSpinner} />
                  </div>
                </>
              )}
            </div>

            <div className="mt-6">
              <div className="relative flex justify-center text-sm">
                <PrimaryLink href="/app/login">Retour à la connexion</PrimaryLink>
              </div>
            </div>
          </div>
        </div>
      </Form>
    </div>
  );
};
