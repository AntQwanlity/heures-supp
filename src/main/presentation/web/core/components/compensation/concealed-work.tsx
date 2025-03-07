import { DateTime } from "DateTime";
import { Money } from "Money";
import capitalize from "lodash/capitalize";
import { CardTable } from "presentation/web/core/card-table";
import { useLegalCaseConcealedWorkRemoteQuery } from "presentation/web/core/components/compensation/legal-case-concealed-work-remote-query.hook";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import React from "react";

type Props = {
  legalCaseId: string;
};

export const ConcealedWork: React.FC<Props> = ({ legalCaseId }) => {
  const concealedWorkQuery = useLegalCaseConcealedWorkRemoteQuery(legalCaseId);
  const concealedWork = concealedWorkQuery.data;

  return concealedWork ? (
    <>
      <div className="flex gap-6">
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Taux mensuel moyen des 12 derniers mois
          <div className="font-bold text-2xl">{Money.fromUnit(concealedWork.avgRate).format()}</div>
        </div>
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Nombre de mois
          <div className="font-bold text-2xl">{concealedWork.numMonths}</div>
        </div>
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Indemnité totale
          <div className="font-bold text-2xl">
            {Money.fromUnit(concealedWork.totalCompensation).format()}
          </div>
        </div>
      </div>
      <CardTable
        Columns={["Mois", "Salaire perçu", "Rappel des heures", "Salaire qui aurait dû être perçu"]}
        lines={concealedWork.lastYearMonthlyPeriods
          .map((period) => ({
            Label: capitalize(
              DateTime.fromIsoFormattedString(period["startsAt"]).format("MonthYear"),
            ),
            Data: [
              <>{Money.fromUnit(period.totalSalariesAmount).format()}</>,
              Money.fromUnit(period.compensation25 + period.compensation50).format(),
              Money.fromUnit(
                period.compensation25 + period.compensation50 + period.totalSalariesAmount,
              ).format(),
            ],
          }))
          .concat([
            {
              Label: "Moyenne",
              Data: [
                <></>,
                <></>,
                <span key="avg-rate" className="font-bold">
                  {Money.fromUnit(concealedWork.avgRate).format()}
                </span>,
              ],
            },
          ])}
      />
    </>
  ) : (
    <div className="text-center">
      <Icon Component={SpinnerIcon} />
    </div>
  );
};
