import { useLegalCaseSalariesPeriodsRemoteQuery } from "presentation/web/core/components/legal-case/legal-case-salaries-periods-remote-query.hook";
import { MonthlySalaries } from "presentation/web/core/components/salaries/monthly-salaries";
import { PeriodicSalaries } from "presentation/web/core/components/salaries/periodic-salaries";
import { FinishContractAlert } from "presentation/web/core/shared/alert/finish-contract.alert";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import { Tabs } from "presentation/web/core/shared/tabs";
import React from "react";

export type SalariesPageProps = {
  legalCaseId: string;
};

export const SalariesPage: React.FC<SalariesPageProps> = ({ legalCaseId }) => {
  const salariesPeriodsQuery = useLegalCaseSalariesPeriodsRemoteQuery(legalCaseId);
  const salariesPeriods = salariesPeriodsQuery.data;

  return salariesPeriods?.sortedSalaries.length === 0 ? (
    <FinishContractAlert legalCaseId={legalCaseId} />
  ) : (
    <div className="flex flex-col gap-5">
      <Tabs
        tabs={[
          {
            name: "Vue mensuelle",
            Component: salariesPeriods ? (
              <MonthlySalaries legalCaseId={legalCaseId} salariesPeriods={salariesPeriods} />
            ) : (
              <div className="text-center">
                <Icon Component={SpinnerIcon} />
              </div>
            ),
          },
          {
            name: "Vue périodique",
            Component: salariesPeriods ? (
              <PeriodicSalaries
                legalCaseId={legalCaseId}
                sameSalaryPeriods={salariesPeriods?.sameSalaryPeriods}
              />
            ) : (
              <div className="text-center">
                <Icon Component={SpinnerIcon} />
              </div>
            ),
          },
        ]}
      />
    </div>
  );
};
