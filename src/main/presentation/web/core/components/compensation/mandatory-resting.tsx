import { DateTime } from "DateTime";
import { Money } from "Money";
import { WorkedPeriod } from "core/components/legal-case/domain/worked-period";
import { CardTable } from "presentation/web/core/card-table";
import { useLegalCaseMandatoryRestingRemoteQuery } from "presentation/web/core/components/compensation/legal-case-mandatory-resting-remote-query.hook";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import React from "react";

type Props = {
  legalCaseId: string;
};

export const MandatoryResting: React.FC<Props> = ({ legalCaseId }) => {
  const mandatoryRestingQuery = useLegalCaseMandatoryRestingRemoteQuery(legalCaseId);
  const mandatoryResting = mandatoryRestingQuery.data;

  return mandatoryResting ? (
    <>
      <div className="flex gap-6">
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Contingent annuel
          <div className="font-bold text-2xl">{WorkedPeriod.YearlyOvertimeQuotaHours} heures</div>
        </div>
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Au titre de la contrepartie au repos
          <div className="font-bold text-2xl">
            {Money.fromUnit(mandatoryResting.mandatoryRestingCompensation).format()}
          </div>
        </div>
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Congés afférents
          <div className="font-bold text-2xl">
            {Money.fromUnit(mandatoryResting.vacationCompensation).format()}
          </div>
        </div>
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Indemnité totale
          <div className="font-bold text-2xl">
            {Money.fromUnit(mandatoryResting.totalCompensation).format()}
          </div>
        </div>
      </div>
      <CardTable
        Columns={[
          "Année de travail",
          "Heures supplémentaires totales",
          "Au delà du contingent",
          "Taux horaire",
          "Indemnité",
        ]}
        lines={mandatoryResting.yearlyPeriods
          .map((period, idx) => ({
            Label: DateTime.fromIsoFormattedString(period["startsAt"]).getYear().toString(),
            Data: [
              <>{period.totalOvertimeHours}</>,
              <>{period.totalOvertimeHoursAboveYearlyQuota}</>,
              Money.fromUnit(period.hourlyRate).format(),
              Money.fromUnit(period.compensationYearlyQuota).format(),
            ],
          }))
          .concat([
            {
              Label: "Total",
              Data: [
                <></>,
                <></>,
                <></>,
                <span key="total" className="font-bold">
                  {Money.fromUnit(mandatoryResting.mandatoryRestingCompensation).format()}
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
