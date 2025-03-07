import { DateTime } from "DateTime";
import { Duration } from "Duration";
import { Salary } from "core/components/legal-case/domain/salary";
import { WorkedWeek } from "core/components/legal-case/domain/worked-week";
import sumBy from "lodash/sumBy";

export class WorkedPeriod {
  public static readonly YearlyOvertimeQuotaHours = 220;

  constructor(
    private readonly startsAt: DateTime,
    private readonly endsAt: DateTime,
    private readonly salaries: Salary[],
    private readonly workedWeeks: WorkedWeek[],
    private readonly weeklyHours: number,
    private _totalOvertimeHours?: Duration,
    private _overtimeHours25?: Duration,
    private _overtimeHours50?: Duration,
  ) {}

  get totalSalariesAmount(): number {
    return sumBy(this.salaries, "amount") / 100;
  }

  get yearlyRate(): number {
    return (this.totalSalariesAmount / this.salaries.length) * 12;
  }

  get monthlyRate(): number {
    return this.totalSalariesAmount / this.salaries.length;
  }

  get weeklyRate(): number {
    return this.yearlyRate / 52;
  }

  get hourlyRate(): number {
    return this.weeklyRate / this.weeklyHours;
  }

  get hourly25Rate(): number {
    return this.hourlyRate * 1.25;
  }

  get hourly50Rate(): number {
    return this.hourlyRate * 1.5;
  }

  get totalOvertimeHours(): Duration {
    if (!this._totalOvertimeHours)
      this._totalOvertimeHours = Duration.fromHours(
        sumBy(
          this.workedWeeks,
          (ww) =>
            (ww.totalOvertimeHours.hours / ww.workingDays.days) *
            ww.getWorkedDaysIn(this.startsAt, this.endsAt),
        ),
      );
    return this._totalOvertimeHours;
  }

  get totalOvertimeHoursAboveYearlyQuota(): Duration {
    return Duration.fromHours(
      Math.max(0, this.totalOvertimeHours.hours - WorkedPeriod.YearlyOvertimeQuotaHours),
    );
  }

  get compensationYearlyQuota(): number {
    return this.totalOvertimeHoursAboveYearlyQuota.hours * this.hourlyRate;
  }

  get overtimeHours25(): Duration {
    if (!this._overtimeHours25)
      this._overtimeHours25 = Duration.fromHours(
        sumBy(
          this.workedWeeks,
          (ww) =>
            (ww.overtimeHours25 / ww.workingDays.days) *
            ww.getWorkedDaysIn(this.startsAt, this.endsAt),
        ),
      );
    return this._overtimeHours25;
  }

  get compensation25(): number {
    return this.overtimeHours25.hours * this.hourly25Rate;
  }

  get overtimeHours50(): Duration {
    if (!this._overtimeHours50)
      this._overtimeHours50 = Duration.fromHours(
        sumBy(
          this.workedWeeks,
          (ww) =>
            (ww.overtimeHours50 / ww.workingDays.days) *
            ww.getWorkedDaysIn(this.startsAt, this.endsAt),
        ),
      );

    return this._overtimeHours50;
  }

  get compensation50(): number {
    return this.overtimeHours50.hours * this.hourly50Rate;
  }
}
