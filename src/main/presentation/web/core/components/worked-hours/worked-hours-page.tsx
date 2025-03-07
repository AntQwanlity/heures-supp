import { User } from "core/components/auth/domain/user";
import { DailyWorkedHours } from "presentation/web/core/components/worked-hours/daily-worked-hours";
import { useDailyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/daily-worked-hours-remote-query.hook";
import { WeeklyWorkedHours } from "presentation/web/core/components/worked-hours/weekly-worked-hours";
import { YearlyWorkedHours } from "presentation/web/core/components/worked-hours/yearly-worked-hours";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { FinishContractAlert } from "presentation/web/core/shared/alert/finish-contract.alert";
import { Tabs } from "presentation/web/core/shared/tabs";
import React from "react";

export type WorkedHoursPageProps = {
  legalCaseId: string;
  user: User;
};

export const WorkedHoursPage: React.FC<WorkedHoursPageProps> = ({ user, legalCaseId }) => {
  //const [file, setFile] = React.useState<File | undefined>(undefined);
  const router = useRouter();
  const sortedWorkedDaysQuery = useDailyWorkedHoursRemoteQuery(
    legalCaseId,
    router.findParam("token"),
  );

  const sortedWorkedDays = sortedWorkedDaysQuery.data?.sortedWorkedDays;

  return sortedWorkedDays?.length === 0 ? (
    <FinishContractAlert legalCaseId={legalCaseId} />
  ) : (
    <>
      {user ? (
        <Tabs
          tabs={[
            {
              name: "Journalier",
              Component: <DailyWorkedHours legalCaseId={legalCaseId} />,
            },
            {
              name: "Hebdomadaire",
              Component: <WeeklyWorkedHours legalCaseId={legalCaseId} />,
            },
            {
              name: "Annuel",
              Component: <YearlyWorkedHours legalCaseId={legalCaseId} />,
            },
          ]}
        />
      ) : (
        <DailyWorkedHours legalCaseId={legalCaseId} />
      )}

      {/*
      <div className="flex gap-5 items-start">
        <CardTable
          Columns={["Complétion du décompte brut"]}
          lines={[
            {
              Label: "XLS à remplir par le client",
              Data: (
                <a href={`/api/legal-case/${legalCaseId}/pdf`} download>
                  <PrimaryButton label="Télécharger" LeadingIcon={ArrowDownTrayIcon} />
                </a>
              ),
            },
          ]}
        />
      </div>
      <div className="flex items-start">
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          <div className="bg-gray-50 uppercase py-3.5 pl-4 pr-3 sm:pl-6 text-left text-sm font-semibold text-gray-900">
            Import du décompte brut
          </div>
          <Form
            onSubmit={async (data) => {
              if (!file) return;
              const body = new FormData();
              body.append("file", file);
              uploadCommand.send(body, () => {});
            }}
            containsFileUpload
          >
            <div className="bg-white flex flex-col gap-3 px-3 py-4">
              <UploadInput
                name="file"
                extensionsAllowed={["XLS"]}
                maxFileSizeMb={10}
                onChange={(value) => setFile(value)}
              />
              <SubmitPrimaryButton
                label="Importer"
                LeadingIcon={ArrowUpTrayIcon}
                disabled={!file}
                showSpinner={uploadCommand.isLoading}
              />
            </div>
          </Form>
        </div>
      </div>*/}
    </>
  );
};
