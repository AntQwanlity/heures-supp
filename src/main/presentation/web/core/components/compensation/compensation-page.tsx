import { ConcealedWork } from "presentation/web/core/components/compensation/concealed-work";
import { HoursRecall } from "presentation/web/core/components/compensation/hours-recall";
import { useLegalCaseHoursRecallRemoteQuery } from "presentation/web/core/components/compensation/legal-case-hours-recall-remote-query.hook";
import { MandatoryResting } from "presentation/web/core/components/compensation/mandatory-resting";
import { FinishContractAlert } from "presentation/web/core/shared/alert/finish-contract.alert";
import { Tabs } from "presentation/web/core/shared/tabs";
import React from "react";

export type CompensationPageProps = {
  legalCaseId: string;
};

export const CompensationPage: React.FC<CompensationPageProps> = ({ legalCaseId }) => {
  const hoursRecallQuery = useLegalCaseHoursRecallRemoteQuery(legalCaseId);
  const hoursRecall = hoursRecallQuery.data;

  return hoursRecall?.lines.length === 0 ? (
    <FinishContractAlert legalCaseId={legalCaseId} />
  ) : (
    <div className="flex gap-5 flex-col">
      <Tabs
        tabs={[
          {
            name: "Rappel des heures",
            Component: <HoursRecall legalCaseId={legalCaseId} />,
          },
          {
            name: "Contrepartie obligatoire au repos",
            Component: <MandatoryResting legalCaseId={legalCaseId} />,
          },
          {
            name: "Travail dissimulé",
            Component: <ConcealedWork legalCaseId={legalCaseId} />,
          },
        ]}
        className="top-16"
      />
    </div>
  );
};
