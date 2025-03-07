import { LegalCase } from "core/components/legal-case/domain/legal-case";

export class YearlyWorkedHoursView {
  constructor(
    public workedYearsPeriods: {
      startsAt: string;
      totalOvertimeHours: string;
    }[],
  ) {}

  static create(legalCase: LegalCase): YearlyWorkedHoursView {
    const workedYearsPeriods = legalCase.workedYearsPeriods.map((wyp) => ({
      startsAt: wyp["startsAt"].format("Iso8601"),
      totalOvertimeHours: wyp.totalOvertimeHours.formatHoursMinutes(),
    }));

    return new YearlyWorkedHoursView(workedYearsPeriods);
  }
}
