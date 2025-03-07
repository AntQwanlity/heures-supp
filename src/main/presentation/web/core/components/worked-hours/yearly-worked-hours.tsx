import { DateTime } from "DateTime";
import { CardTable } from "presentation/web/core/card-table";
import { useYearlyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/yearly-worked-hours-remote-query.hook";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import React from "react";

type Props = {
  legalCaseId: string;
};

export const YearlyWorkedHours: React.FC<Props> = ({ legalCaseId }) => {
  const workedYearsPeriodsQuery = useYearlyWorkedHoursRemoteQuery(legalCaseId);
  const workedYearsPeriods = workedYearsPeriodsQuery.data?.workedYearsPeriods;

  return workedYearsPeriods ? (
    <CardTable
      Columns={["Année", "Heures supplémentaires"]}
      lines={workedYearsPeriods.map((wyp) => ({
        Label: `${DateTime.fromIsoFormattedString(wyp.startsAt).getYear()}`,
        Data: [<>{wyp.totalOvertimeHours}</>],
      }))}
    />
  ) : (
    <div className="text-center">
      <Icon Component={SpinnerIcon} />
    </div>
  );
};
