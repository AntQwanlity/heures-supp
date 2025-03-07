import { DateTime } from "DateTime";
import { Money } from "Money";
import capitalize from "lodash/capitalize";
import { CardTable } from "presentation/web/core/card-table";
import { useLegalCaseHoursRecallRemoteQuery } from "presentation/web/core/components/compensation/legal-case-hours-recall-remote-query.hook";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import React from "react";

type Props = {
  legalCaseId: string;
};

export const HoursRecall: React.FC<Props> = ({ legalCaseId }) => {
  const hoursRecallQuery = useLegalCaseHoursRecallRemoteQuery(legalCaseId);
  const hoursRecall = hoursRecallQuery.data;

  return hoursRecall ? (
    <>
      <div className="flex gap-6">
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Au titre du rappel des heures supplémentaires
          <div className="font-bold text-2xl">
            {Money.fromUnit(hoursRecall.hoursRecallComp.total).format()}
          </div>
        </div>
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Congés afférents
          <div className="font-bold text-2xl">
            {Money.fromUnit(hoursRecall.vacationComp).format()}
          </div>
        </div>
        <div className="overflow-hidden bg-white text-sm p-6 shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
          Indemnité totale
          <div className="font-bold text-2xl">{Money.fromUnit(hoursRecall.totalComp).format()}</div>
        </div>
      </div>
      <CardTable
        Columns={[
          "Période",
          "Heures supplémentaires totales",
          "Heures supplémentaires à 25%",
          "Indemnités à 25%",
          "Heures supplémentaires à 50%",
          "Indemnités à 50%",
          "Indemnités totales",
        ]}
        lines={hoursRecall.lines
          .map((view) => ({
            Label: capitalize(DateTime.fromIsoFormattedString(view.startsAt).format("MonthYear")),
            Data: [
              <>{view.totalOvertimeHours}</>,
              <>{view.overtimeHours25}</>,
              Money.fromUnit(view.compensation25).format(),
              <>{view.overtimeHours50}</>,
              Money.fromUnit(view.compensation50).format(),
              Money.fromUnit(view.totalCompensation).format(),
            ],
          }))
          .concat([
            {
              Label: "Total",
              Data: [
                <></>,
                <></>,
                <span key="compensation-25-total" className="font-bold">
                  {Money.fromUnit(hoursRecall.hoursRecallComp.total25).format()}
                </span>,
                <></>,
                <span key="compensation-50-total" className="font-bold">
                  {Money.fromUnit(hoursRecall.hoursRecallComp.total50).format()}
                </span>,
                <span key="total-compensation" className="font-bold">
                  {Money.fromUnit(hoursRecall.hoursRecallComp.total).format()}
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
