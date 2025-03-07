import { ArrowDownTrayIcon } from "@heroicons/react/20/solid";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { DateTime } from "DateTime";
import capitalize from "lodash/capitalize";
import { CardTable } from "presentation/web/core/card-table";
import { useLegalCaseRemoteQuery } from "presentation/web/core/components/legal-case/legal-case-remote-query.hook";
import { useDailyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/daily-worked-hours-remote-query.hook";
import { SendMagicLinkModal } from "presentation/web/core/components/worked-hours/send-magic-link-modal";
import { useUpdateWorkedDaysRemoteCommand } from "presentation/web/core/components/worked-hours/update-worked-days.remote-command";
import { useNotificationContext } from "presentation/web/core/ports/notifications/use-notification-context.hook";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { SecondaryButton } from "presentation/web/core/shared/buttons/secondary-button";
import { SubmitPrimaryButton } from "presentation/web/core/shared/buttons/submit-primary-button";
import { Form } from "presentation/web/core/shared/forms/form";
import { TextInput } from "presentation/web/core/shared/forms/text-input";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import { Link } from "presentation/web/core/shared/links/link";
import React, { useState } from "react";

type Props = {
  legalCaseId: string;
  editable?: boolean;
};

export const TimeFields = [
  "morningStartsAt",
  "morningEndsAt",
  "afternoonStartsAt",
  "afternoonEndsAt",
] as const;

export const DailyWorkedHours: React.FC<Props> = ({ legalCaseId, editable = true }) => {
  const router = useRouter();
  const { setNotification } = useNotificationContext();

  const [showSendMagicLinkModal, setShowMagicLinkModal] = useState(false);

  const onSendMagicLink = async () => {
    setShowMagicLinkModal(true);
  };

  const updateWorkedDaysCommand = useUpdateWorkedDaysRemoteCommand(
    legalCaseId,
    router.findParam("token"),
  );
  const sortedWorkedDaysQuery = useDailyWorkedHoursRemoteQuery(
    legalCaseId,
    router.findParam("token"),
  );

  const sortedWorkedDays = sortedWorkedDaysQuery.data?.sortedWorkedDays;

  const legalCaseQuery = useLegalCaseRemoteQuery(legalCaseId, true);
  const legalCase = legalCaseQuery.data;

  return sortedWorkedDays ? (
    <>
      {legalCase && (
        <SendMagicLinkModal
          legalCase={legalCase}
          opened={showSendMagicLinkModal}
          close={() => setShowMagicLinkModal(false)}
        />
      )}
      <Form
        onSubmit={(data, dirtyValues, reset) => {
          updateWorkedDaysCommand.send(
            {
              workedDays: Object.entries(dirtyValues).map(([id, value]) => {
                const workedDay = sortedWorkedDays.find((wd) => wd["id"] === id);

                if (!workedDay) throw new Error("Worked day not found");

                const getSplittedField = (field: string): [number, number] => {
                  return (value[field] || data[id][field]).split(":").map((s: string) => +s);
                };
                const afternoonStartsAt = getSplittedField("afternoonEndsAt");

                return {
                  id,
                  morningStartsAt: DateTime.fromIsoFormattedString(workedDay["morningStartsAt"])
                    .atHourMinutes(...getSplittedField("morningStartsAt"))
                    .format("Iso8601"),
                  morningEndsAt: DateTime.fromIsoFormattedString(workedDay["morningStartsAt"])
                    .atHourMinutes(...getSplittedField("morningEndsAt"))
                    .format("Iso8601"),
                  afternoonStartsAt: DateTime.fromIsoFormattedString(workedDay["morningStartsAt"])
                    .atHourMinutes(...getSplittedField("afternoonStartsAt"))
                    .format("Iso8601"),
                  afternoonEndsAt: DateTime.fromIsoFormattedString(workedDay["morningStartsAt"])
                    .atHourMinutes(...afternoonStartsAt)
                    .plusDays(afternoonStartsAt[0] < 10 ? 1 : 0)
                    .format("Iso8601"),
                };
              }),
            },
            () => {
              setNotification({ type: "success", text: "Les heures ont bien été enregistrées." });
              reset();
            },
          );
        }}
      >
        <CardTable
          Columns={[
            "Date",
            "Début de la matinée",
            "Fin de la matinée",
            "Début de l'après-midi",
            "Fin de l'après-midi",
            "Total",
          ]}
          lines={sortedWorkedDays.map((wd) => ({
            Label: capitalize(
              DateTime.fromIsoFormattedString(wd["morningStartsAt"]).formatTemplate(
                "dddd DD MMMM YYYY",
              ),
            ),
            Data: TimeFields.map((field) => {
              const textValue = DateTime.fromIsoFormattedString(wd[field]).format("Time");
              return editable ? (
                <TextInput
                  key={`${wd["id"]}.${field}`}
                  name={`${wd["id"]}.${field}`}
                  className={"w-20"}
                  defaultValue={textValue}
                  validate={(value: string) =>
                    value.match(/^[0-9]{2}:[0-9]{2}$/) ? undefined : "Format invalide"
                  }
                />
              ) : (
                textValue
              );
            }).concat([<>{wd.totalWorkedHours}</>]),
          }))}
        />
        {editable && (
          <>
            <div className="h-20"></div>
            <div className="fixed w-screen left-0 bottom-0 z-10 bg-white shadow-top">
              <div className="flex gap-3 justify-end mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <Link href={`/api/legal-case/${legalCaseId}/download-statement`} download>
                  <SecondaryButton
                    label="Télécharger le PDF (bientôt)"
                    LeadingIcon={ArrowDownTrayIcon}
                    disabled
                  />
                </Link>
                <SecondaryButton
                  label="Faire remplir par le client"
                  LeadingIcon={PaperAirplaneIcon}
                  onClick={onSendMagicLink}
                />
                <SubmitPrimaryButton
                  label="Sauvegarder"
                  showSpinner={updateWorkedDaysCommand.isLoading}
                  width="fit"
                  enableDirtyOnly
                />
              </div>
            </div>
          </>
        )}
      </Form>
    </>
  ) : (
    <div className="text-center">
      <Icon Component={SpinnerIcon} />
    </div>
  );
};
