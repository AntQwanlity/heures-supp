import { WorkedPeriod } from "core/components/legal-case/domain/worked-period";

export class WorkedPeriodView {
  constructor(
    public numSalaries: number,
    public startsAt: string,
    public endsAt: string,
    public totalSalariesAmount: number,
    public yearlyRate: number,
    public monthlyRate: number,
    public weeklyRate: number,
    public hourlyRate: number,
    public hourly25Rate: number,
    public hourly50Rate: number,
    public totalOvertimeHours: string,
    public totalOvertimeHoursAboveYearlyQuota: string,
    public compensationYearlyQuota: number,
    public overtimeHours25: number,
    public compensation25: number,
    public overtimeHours50: number,
    public compensation50: number,
  ) {}

  static create(workedPeriod: WorkedPeriod): WorkedPeriodView {
    return new WorkedPeriodView(
      workedPeriod["salaries"].length,
      workedPeriod["startsAt"].format("Iso8601"),
      workedPeriod["endsAt"].format("Iso8601"),
      workedPeriod.totalSalariesAmount,
      workedPeriod.yearlyRate,
      workedPeriod.monthlyRate,
      workedPeriod.weeklyRate,
      workedPeriod.hourlyRate,
      workedPeriod.hourly25Rate,
      workedPeriod.hourly50Rate,
      workedPeriod.totalOvertimeHours.formatHoursMinutes(),
      workedPeriod.totalOvertimeHoursAboveYearlyQuota.formatHoursMinutes(),
      workedPeriod.compensationYearlyQuota,
      workedPeriod.overtimeHours25.hours,
      workedPeriod.compensation25,
      workedPeriod.overtimeHours50.hours,
      workedPeriod.compensation50,
    );
  }
}
