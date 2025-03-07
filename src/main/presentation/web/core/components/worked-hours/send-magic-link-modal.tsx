import { LegalCase } from "core/components/legal-case/domain/legal-case";
import { useSendMagicLinkRemoteCommand } from "presentation/web/core/components/legal-case/send-magic-link.remote-command";
import { useNotificationContext } from "presentation/web/core/ports/notifications/use-notification-context.hook";
import { CopyToClipboardButton } from "presentation/web/core/shared/buttons/copy-to-clipboard.button";
import { Form } from "presentation/web/core/shared/forms/form";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import { Textarea } from "presentation/web/core/shared/forms/textarea";
import { ConfirmationModal } from "presentation/web/core/shared/modals/confirmation-modal";
import React from "react";

type Props = {
  legalCase: LegalCase;
  opened: boolean;
  close: () => void;
};

export const SendMagicLinkModal: React.FC<Props> = ({ legalCase, opened, close }) => {
  const sendMagicLinkCommand = useSendMagicLinkRemoteCommand(legalCase["id"]);
  const { setNotification } = useNotificationContext();

  const onConfirm = () => {
    sendMagicLinkCommand.send(undefined, () => {
      setNotification({ type: "success", text: "Le lien a été envoyé avec succès." });
      close();
    });
  };

  return opened ? (
    <Form>
      <ConfirmationModal
        title="Envoi du lien de saisie des heures"
        opened={opened}
        close={close}
        onConfirm={onConfirm}
        content={
          <div>
            Vous pouvez communiquer vous-même l'URL ci-dessous à votre client ou le notifier
            immédiatement par e-mail en cliquant sur "Envoyer".
            <br />
            <br />
            <TextInput
              name="send-magic-link-value"
              defaultValue={`https://heures-supp.fr/app/legal-case/${legalCase["id"]}/worked-hours?token=${legalCase["magicLinkToken"]}`}
              disabled
            />
            <CopyToClipboardButton
              valueToCopy={`https://heures-supp.fr/app/legal-case/${legalCase["id"]}/worked-hours?token=${legalCase["magicLinkToken"]}`}
            />
          </div>
        }
        confirmBtnTxt={`Envoyer${
          (legalCase["client"]?.["user"]["email"].length || 0) > 0
            ? ` à ${legalCase["client"]?.["user"]["email"]}`
            : ""
        }`}
        enableConfirmBtn={(legalCase["client"]?.["user"]["email"].length || 0) > 0}
        showSpinner={sendMagicLinkCommand.isLoading}
      />
    </Form>
  ) : (
    <></>
  );
};
