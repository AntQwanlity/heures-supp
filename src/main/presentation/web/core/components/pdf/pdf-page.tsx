import { User } from "core/components/auth/domain/user";
import { ConcealedWork } from "presentation/web/core/components/compensation/concealed-work";
import { HoursRecall } from "presentation/web/core/components/compensation/hours-recall";
import { MandatoryResting } from "presentation/web/core/components/compensation/mandatory-resting";
import { DailyWorkedHours } from "presentation/web/core/components/worked-hours/daily-worked-hours";
import { useDailyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/daily-worked-hours-remote-query.hook";
import { WeeklyWorkedHours } from "presentation/web/core/components/worked-hours/weekly-worked-hours";
import { YearlyWorkedHours } from "presentation/web/core/components/worked-hours/yearly-worked-hours";
import { useRouter } from "presentation/web/core/ports/router/use-router.hook";
import { FinishContractAlert } from "presentation/web/core/shared/alert/finish-contract.alert";
import { Tabs } from "presentation/web/core/shared/tabs";
import React from "react";

export type PdfPageProps = {
  legalCaseId: string;
  user: User;
};

export const PdfPage: React.FC<PdfPageProps> = ({ user, legalCaseId }) => {
  return (
    <main className="p-6">
      <a href="app/legal-case/a484dfac-feac-4a0f-9a9a-5eeec794fad2/pdf" download="test.pdf">
        Test
      </a>
      <h1>Titre</h1>
      <div className="flex gap-5 flex-col">
        <h2>Rappel des heures</h2>
        <HoursRecall legalCaseId={legalCaseId} />
        <h2>Contrepartie obligatoire au repos</h2>
        <MandatoryResting legalCaseId={legalCaseId} />
        <h2>Travail dissimulé</h2>
        <ConcealedWork legalCaseId={legalCaseId} />
        <h2>Annuel</h2>
        <YearlyWorkedHours legalCaseId={legalCaseId} />
        <h2>Hebdomadaire</h2>
        <WeeklyWorkedHours legalCaseId={legalCaseId} />
        <h2>Journalier</h2>
        <DailyWorkedHours legalCaseId={legalCaseId} editable={false} />
      </div>
    </main>
  );
};
