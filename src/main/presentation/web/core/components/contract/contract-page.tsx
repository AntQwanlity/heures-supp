import { DateTime, DateTimeFormats } from "DateTime";
import { Money } from "Money";
import { useUpdateLegalCaseRemoteCommand } from "presentation/web/core/components/contract/update-legal-case.remote-command";
import { useLegalCaseRemoteQuery } from "presentation/web/core/components/legal-case/legal-case-remote-query.hook";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { SubmitPrimaryButton } from "presentation/web/core/shared/buttons/submit-primary-button";
import { DatePicker } from "presentation/web/core/shared/forms/date-picker";
import { Form } from "presentation/web/core/shared/forms/form";
import { RadioGroup } from "presentation/web/core/shared/forms/radio-group";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import { PrimaryLink } from "presentation/web/core/shared/links/primary-link";
import { ConfirmationModal } from "presentation/web/core/shared/modals/confirmation-modal";
import React, { useState } from "react";

export type ContractPageProps = {
  legalCaseId: string;
};

type UpdateLegalCaseForm = {
  sex: string;
  firstName: string;
  lastName: string;
  email: string;
  startsAt: string;
  endsAt: string;
  weeklyHours: string;
  baseMonthlySalary: string;
};

export const ContractPage: React.FC<ContractPageProps> = ({ legalCaseId }) => {
  const router = useRouter();
  const updateLegalCaseCommand = useUpdateLegalCaseRemoteCommand(legalCaseId);

  const legalCaseQuery = useLegalCaseRemoteQuery(legalCaseId, true);
  const legalCase = legalCaseQuery.data;

  const [confirmationModalData, setConfirmationModalData] = useState<
    UpdateLegalCaseForm | undefined
  >(undefined);

  const sendUpdateCommand = (data: UpdateLegalCaseForm) => {
    updateLegalCaseCommand.send(
      {
        id: legalCaseId,
        sex: data.sex,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        baseMonthlySalary: Money.fromInputString(data.baseMonthlySalary).cents,
        weeklyHours: +data.weeklyHours,
        startsAt: DateTime.fromFormattedString(data.startsAt, DateTimeFormats.Date).format(
          "Iso8601",
        ),
        endsAt: DateTime.fromFormattedString(data.endsAt, DateTimeFormats.Date).format("Iso8601"),
      },
      async () => {
        router.redirect(`/app/legal-case/${legalCaseId}/salaries`);
      },
    );
  };

  const contractDatesHaveChanged = (data: UpdateLegalCaseForm) => {
    if (!legalCase) return false;

    return (
      !DateTime.fromFormattedString(data.startsAt, DateTimeFormats.Date).equals(
        legalCase["startsAt"],
      ) ||
      !DateTime.fromFormattedString(data.endsAt, DateTimeFormats.Date).equals(legalCase["endsAt"])
    );
  };

  const onSubmit = (data: UpdateLegalCaseForm) => {
    if (!legalCase) return;

    const isFirstUpdate = legalCase["createdAt"].equals(legalCase["updatedAt"]);

    if (
      !isFirstUpdate &&
      (contractDatesHaveChanged(data) ||
        !Money.fromInputString(data.baseMonthlySalary).equals(legalCase["baseMonthlySalary"]))
    ) {
      setConfirmationModalData(data);
      return;
    }

    sendUpdateCommand(data);
  };

  return (
    <Form<UpdateLegalCaseForm> onSubmit={onSubmit}>
      {confirmationModalData && (
        <ConfirmationModal
          opened={!!confirmationModalData}
          close={() => setConfirmationModalData(undefined)}
          onConfirm={() => sendUpdateCommand(confirmationModalData)}
          showSpinner={updateLegalCaseCommand.isLoading}
          title={
            contractDatesHaveChanged(confirmationModalData)
              ? "Dates du contrat modifiées"
              : "Salaire brut modifié"
          }
          content={
            contractDatesHaveChanged(confirmationModalData) ? (
              <p>
                Vous vous apprêtez à modifier les dates du contrat, ce qui aura pour effet de{" "}
                <strong>remplacer tous les salaires perçus par le salaire de base en entrée</strong>
                , et de <strong>supprimer toutes les heures travaillées</strong>
                .
                <br />
                Si vous confirmez, vous devrez les renseigner à nouveau.
                <br />
                <br />
                En cas de doute, envoyez-nous un e-mail à{" "}
                <PrimaryLink href="mailto:contact@heures-supp.fr">
                  contact@heures-supp.fr
                </PrimaryLink>
                .
              </p>
            ) : (
              <p>
                Vous vous apprêtez à modifier le salaire de base en entrée, ce qui aura pour effet
                de <strong>remplacer tous les salaires perçus</strong>.
                <br />
                Si vous confirmez, vous devrez les vérifier à nouveau et les corriger si nécessaire.
                <br />
                <br />
                En cas de doute, envoyez-nous un e-mail à{" "}
                <PrimaryLink href="mailto:contact@heures-supp.fr">
                  contact@heures-supp.fr
                </PrimaryLink>
                .
              </p>
            )
          }
          isWarning
        />
      )}
      <div className="p-6 rounded-lg bg-white shadow">
        <div className="space-y-12">
          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Salarié</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Saisissez les informations concernant le salarié.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="col-span2 md:col-span-6 mt-1">
                <RadioGroup
                  name="sex"
                  options={[
                    { label: "Madame", name: "female" },
                    { label: "Monsieur", name: "male" },
                  ]}
                  defaultValue={legalCase?.["client"]?.["sex"]}
                />
              </div>
              <div className="sm:col-span-2">
                <TextInput
                  name="firstName"
                  label="Prénom"
                  subLabel="Facultatif"
                  defaultValue={legalCase?.["client"]?.["firstName"]}
                />
              </div>

              <div className="sm:col-span-2">
                <TextInput
                  name="lastName"
                  label="Nom"
                  subLabel="Facultatif"
                  defaultValue={legalCase?.["client"]?.["lastName"]}
                />
              </div>

              <div className="sm:col-span-3">
                <TextInput
                  name="email"
                  label="Adresse e-mail"
                  subLabel="Facultatif"
                  defaultValue={legalCase?.["client"]?.["user"]["email"]}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">Période d'emploi</h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Il s'agit de la période réellement travaillée qui correspond aux salaires perçus.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-3">
                <label
                  htmlFor="startsAt"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date d'entrée effective
                </label>
                <div className="mt-2">
                  <DatePicker name="startsAt" defaultValue={legalCase?.["startsAt"]} />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label
                  htmlFor="endsAt"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date de fin effective
                </label>
                <div className="mt-2">
                  <DatePicker
                    name="endsAt"
                    validate={(value: string, formValues: UpdateLegalCaseForm) => {
                      return formValues.startsAt?.length > 0 &&
                        formValues.endsAt?.length > 0 &&
                        DateTime.fromFormattedString(
                          formValues.startsAt,
                          DateTimeFormats.Date,
                        ).isAfter(
                          DateTime.fromFormattedString(formValues.endsAt, DateTimeFormats.Date),
                        )
                        ? "La date de fin est antérieure à la date d'entrée."
                        : undefined;
                    }}
                    defaultValue={legalCase?.["endsAt"]}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Salaire de base en entrée
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Il sera utilisé comme valeur par défaut pour les salaires perçus.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-2">
                <TextInput
                  name="baseMonthlySalary"
                  label="Brut mensuel"
                  trailingIcon="€"
                  required
                  validate="number"
                  defaultValue={legalCase?.["baseMonthlySalary"].format("Input")}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-x-8 gap-y-10 border-b border-gray-900/10 pb-12 md:grid-cols-3">
            <div>
              <h2 className="text-base font-semibold leading-7 text-gray-900">
                Temps de travail prévu
              </h2>
              <p className="mt-1 text-sm leading-6 text-gray-600">
                Nous calculerons les heures supplémentaires en fonction du travail réellement
                effectué.
              </p>
            </div>

            <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6 md:col-span-2">
              <div className="sm:col-span-2">
                <TextInput
                  name="weeklyHours"
                  label="Heures hebdomadaires"
                  trailingIcon="h"
                  defaultValue={legalCase?.["weeklyHours"].toString()}
                  required
                  validate="int"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-x-6">
          <SubmitPrimaryButton
            label="Enregistrer"
            showSpinner={updateLegalCaseCommand.isLoading}
            width="fit"
          />
        </div>
      </div>
    </Form>
  );
};
