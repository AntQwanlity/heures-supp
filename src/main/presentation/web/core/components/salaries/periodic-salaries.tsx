import { WorkedPeriodView } from "presentation/web/core/components/legal-case/worked-period.view";
import { PeriodRates } from "presentation/web/core/components/salaries/period-rates";
import React from "react";

type Props = {
  legalCaseId: string;
  sameSalaryPeriods: WorkedPeriodView[];
};

export const PeriodicSalaries: React.FC<Props> = ({ sameSalaryPeriods }) => {
  return (
    <div className="flex-col gap-5 md:grid md:grid-cols-3">
      {sameSalaryPeriods.map((period, i) => (
        <PeriodRates key={`period-rates-${i}`} period={period} />
      ))}
    </div>
  );
};
