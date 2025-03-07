import { DateTime } from "DateTime";
import { Money } from "Money";
import { WorkedPeriodView } from "presentation/web/core/components/legal-case/worked-period.view";
import { SalariesTable } from "presentation/web/core/components/salaries/salaries-table";
import React from "react";

type Props = {
  period: WorkedPeriodView;
  customTitle?: string;
  subTitle?: string;
};

export const PeriodRates: React.FC<Props> = ({ period, customTitle, subTitle }) => {
  if (period.numSalaries === 0) return <></>;

  const title =
    customTitle ??
    (period.numSalaries === 1
      ? DateTime.fromIsoFormattedString(period.startsAt).format("MonthYear")
      : `Entre ${DateTime.fromIsoFormattedString(period.startsAt).format(
          "MonthYear",
        )} et ${DateTime.fromIsoFormattedString(period.endsAt).format("MonthYear")}`);

  return (
    <SalariesTable
      title={title}
      subTitle={subTitle}
      Columns={[]}
      linesGroups={[
        {
          category: "",
          lines: [
            {
              Label: "Total sur la période",
              Data: Money.fromUnit(period.totalSalariesAmount).format(),
            },
            {
              Label: "Taux annuel de base",
              Data: Money.fromUnit(period.yearlyRate).format(),
            },
            {
              Label: "Taux mensuel de base",
              Data: Money.fromUnit(period.monthlyRate).format(),
            },
            {
              Label: " Taux hebdomadaire de base",
              Data: Money.fromUnit(period.weeklyRate).format(),
            },
            {
              Label: "Taux horaire de base",
              Data: Money.fromUnit(period.hourlyRate).format(),
            },
            {
              Label: "Taux horaire majoré de 25%",
              Data: Money.fromUnit(period.hourly25Rate).format(),
            },
            {
              Label: " Taux horaire majoré de 50%",
              Data: Money.fromUnit(period.hourly50Rate).format(),
            },
          ],
        },
      ]}
    />
  );
};
