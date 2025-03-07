import { DateTime } from "DateTime";
import { Money } from "Money";
import capitalize from "lodash/capitalize";
import groupBy from "lodash/groupBy";
import map from "lodash/map";
import { CardTableLineForm } from "presentation/web/core/components/legal-case/card-table-line";
import { LegalCaseSalariesPeriodsView } from "presentation/web/core/components/legal-case/legal-case-salaries-periods.view";
import { PeriodRates } from "presentation/web/core/components/salaries/period-rates";
import { SalariesTable } from "presentation/web/core/components/salaries/salaries-table";
import { useUpdateSalaryRemoteCommand } from "presentation/web/core/components/salaries/update-salary.remote-command";
import React, { useMemo } from "react";

type Props = {
  legalCaseId: string;
  salariesPeriods: LegalCaseSalariesPeriodsView;
};
export const MonthlySalaries: React.FC<Props> = ({ legalCaseId, salariesPeriods }) => {
  const updateSalaryRemoteCommand = useUpdateSalaryRemoteCommand(legalCaseId);
  const linesGroups = useMemo(
    () =>
      map(
        groupBy(
          salariesPeriods?.sortedSalaries.map((salary) => {
            const date = DateTime.fromIsoFormattedString(salary["date"]);
            return {
              year: date.getYear(),
              Label: capitalize(date.format("MonthYear")),
              Data: Money.fromCents(salary["amount"]).format(),
              action: {
                defaultValue: Money.fromCents(salary["amount"]).format("Input"),
                id: salary["id"],
                trailingIcon: "€",
              },
            };
          }) || [],
          (i) => i.year,
        ),
        (items, year) => ({ category: year, lines: items }),
      ),
    [salariesPeriods],
  );

  const onSubmit = (data: CardTableLineForm, onSuccess?: () => void) => {
    updateSalaryRemoteCommand.send(
      { id: data.id, amount: Money.fromInputString(data.value).cents },
      onSuccess,
    );
  };

  return (
    <div className="flex gap-5 flex-col md:flex-row">
      <div className="basis-1/2">
        <SalariesTable
          title={"Salaires de base"}
          subTitle="Veuillez indiquer les salaires bruts tels qu’ils apparaissent sur les fiches de paie."
          Columns={[]}
          linesGroups={linesGroups}
          showLoader={updateSalaryRemoteCommand.isLoading}
          onSubmit={onSubmit}
        />
      </div>
      <div className="basis-1/2 flex flex-col gap-5">
        {salariesPeriods?.lastYearPeriod && (
          <>
            <PeriodRates
              period={salariesPeriods.lastYearPeriod}
              customTitle="Moyenne des 12 derniers mois"
              subTitle="Ces valeurs sont automatiquement recalculées lorsque vous modifiez les salaires ci-contre. Elle prennent aussi en compte le temps de travail (défini dans le contrat de travail)."
            />
            <SalariesTable
              title={"Taux horaire de base, par année"}
              subTitle="Ces valeurs sont automatiquement recalculées lorsque vous modifiez les salaires ci-contre. Elle prennent aussi en compte le temps de travail (défini dans le contrat de travail)."
              Columns={[]}
              linesGroups={map(
                groupBy(
                  salariesPeriods.workedYearsPeriods.map((period) => ({
                    Label: DateTime.fromIsoFormattedString(period.startsAt).getYear(),
                    Data: Money.fromUnit(period.hourlyRate).format(),
                  })) || [],

                  () => "",
                ),
                (items, year) => ({ category: year, lines: items }),
              )}
            />
          </>
        )}
      </div>
    </div>
  );
};
