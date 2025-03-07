import { WorkedDay } from "core/components/legal-case/domain/worked-day";

export class DailyWorkedHoursView {
  constructor(
    public sortedWorkedDays: {
      id: string;
      morningStartsAt: string;
      morningEndsAt: string;
      afternoonStartsAt: string;
      afternoonEndsAt: string;
      totalWorkedHours: string;
    }[],
  ) {}

  static create(sortedWorkedDays: WorkedDay[]): DailyWorkedHoursView {
    const dailyWorkedHours = sortedWorkedDays.map((wd) => ({
      id: wd["id"],
      morningStartsAt: wd["morningStartsAt"].format("Iso8601"),
      morningEndsAt: wd["morningEndsAt"].format("Iso8601"),
      afternoonStartsAt: wd["afternoonStartsAt"].format("Iso8601"),
      afternoonEndsAt: wd["afternoonEndsAt"].format("Iso8601"),
      totalWorkedHours: wd.totalWorkedHours.formatHoursMinutes(),
    }));

    return new DailyWorkedHoursView(dailyWorkedHours);
  }
}
