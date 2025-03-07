import { LegalCase } from "core/components/legal-case/domain/legal-case";

export class WeeklyWorkedHoursView {
  constructor(
    public workedWeeks: {
      startsAt: string;
      endsAt: string;
      workingDays: string;
      workingHours: string;
      totalWorkedHours: string;
      totalOvertimeHours: string;
    }[],
  ) {}

  static create(legalCase: LegalCase): WeeklyWorkedHoursView {
    const weeklyWorkedHours = legalCase.workedWeeks.map((ww) => ({
      startsAt: ww.startsAt.format("Iso8601"),
      endsAt: ww.endsAt.format("Iso8601"),
      workingDays: ww.workingDays.formatDays(),
      workingHours: ww.workingHours.formatHoursMinutes(),
      totalWorkedHours: ww.totalWorkedHours.formatHoursMinutes(),
      totalOvertimeHours: ww.totalOvertimeHours.formatHoursMinutes(),
    }));

    return new WeeklyWorkedHoursView(weeklyWorkedHours);
  }
}
