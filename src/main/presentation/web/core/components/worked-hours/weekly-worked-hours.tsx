import { DateTime } from "DateTime";
import { CardTable } from "presentation/web/core/card-table";
import { useWeeklyWorkedHoursRemoteQuery } from "presentation/web/core/components/worked-hours/weekly-worked-hours-remote-query.hook";
import { Icon } from "presentation/web/core/shared/icons/icon";
import { SpinnerIcon } from "presentation/web/core/shared/icons/spinner-icon";
import React from "react";

type Props = {
  legalCaseId: string;
};

export const WeeklyWorkedHours: React.FC<Props> = ({ legalCaseId }) => {
  const workedWeeksQuery = useWeeklyWorkedHoursRemoteQuery(legalCaseId);
  const workedWeeks = workedWeeksQuery.data?.workedWeeks;
  return workedWeeks ? (
    <CardTable
      Columns={[
        "Semaine",
        "Jours ouvrés du salarié",
        "Heures ouvrées du salarié",
        "Heures travaillées",
        "Heures supplémentaires",
      ]}
      lines={workedWeeks.map((ww) => ({
        Label: `Du ${DateTime.fromIsoFormattedString(ww.startsAt).format(
          "Date",
        )} au ${DateTime.fromIsoFormattedString(ww.endsAt).format("Date")}`,
        Data: [
          <>{ww.workingDays}</>,
          <>{ww.workingHours}</>,
          <>{ww.totalWorkedHours}</>,
          <>{ww.totalOvertimeHours}</>,
        ],
      }))}
    />
  ) : (
    <div className="text-center">
      <Icon Component={SpinnerIcon} />
    </div>
  );
};
