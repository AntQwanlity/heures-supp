import { DateTime } from "DateTime";
import { Duration } from "Duration";
import { WorkedDay } from "core/components/legal-case/domain/worked-day";
import sumBy from "lodash/sumBy";

export class WorkedWeek {
  private static readonly WorkingDaysPerWeek = 5;
  private static readonly Overtime25Threshold = 8;

  constructor(
    private readonly workedDays: WorkedDay[],
    private readonly weeklyHours: number,
    private _startsAt?: DateTime,
    private _endsAt?: DateTime,
    private _totalWorkedHours?: Duration,
    private _totalOvertimeHours?: Duration,
  ) {}

  get startsAt(): DateTime {
    if (!this._startsAt) this._startsAt = this.workedDays[0]["morningStartsAt"].atStartOfWeek();
    return this._startsAt;
  }

  get endsAt(): DateTime {
    if (!this._endsAt)
      this._endsAt = this.workedDays[this.workedDays.length - 1]["morningStartsAt"].atEndOfWeek();
    return this._endsAt;
  }

  getWorkedDaysIn(minDate: DateTime, maxDate: DateTime): number {
    return this.workedDays.filter((wd) => wd["morningStartsAt"].isBetween(minDate, maxDate)).length;
  }

  get workingDays(): Duration {
    return Duration.fromDays(this.workedDays.length);
  }

  get workingHours(): Duration {
    return Duration.fromHours(
      (this.workingDays.days * this.weeklyHours) / WorkedWeek.WorkingDaysPerWeek,
    );
  }

  get totalWorkedHours(): Duration {
    if (!this._totalWorkedHours)
      this._totalWorkedHours = Duration.fromHours(
        sumBy(this.workedDays, (wd) => wd.totalWorkedHours.hours),
      );
    return this._totalWorkedHours;
  }

  get totalOvertimeHours(): Duration {
    if (!this._totalOvertimeHours)
      this._totalOvertimeHours = Duration.fromHours(
        Math.max(this.totalWorkedHours.minus(this.workingHours).hours, 0),
      );
    return this._totalOvertimeHours;
  }

  get overtimeHours25(): number {
    return Math.min(this.totalOvertimeHours.hours, WorkedWeek.Overtime25Threshold);
  }

  get overtimeHours50(): number {
    return Math.max(this.totalOvertimeHours.hours - WorkedWeek.Overtime25Threshold, 0);
  }
}
