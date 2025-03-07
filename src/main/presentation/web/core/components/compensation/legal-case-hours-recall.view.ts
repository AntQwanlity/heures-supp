import { LegalCase } from "core/components/legal-case/domain/legal-case";
import sumBy from "lodash/sumBy";

export type HoursRecallLineView = {
  id: string;
  startsAt: string;
  endsAt: string;
  totalOvertimeHours: string;
  overtimeHours25: string;
  compensation25: number;
  overtimeHours50: string;
  compensation50: number;
  totalCompensation: number;
};

export class LegalCaseHoursRecallView {
  constructor(
    public hoursRecallComp: { total25: number; total50: number; total: number },
    public vacationComp: number,
    public totalComp: number,
    public lines: HoursRecallLineView[],
  ) {}

  static create(legalCase: LegalCase): LegalCaseHoursRecallView {
    const monthlyPeriods = legalCase.monthlyPeriods;

    const lines: HoursRecallLineView[] = monthlyPeriods.map((period) => {
      const compensation25 = period.compensation25;
      const compensation50 = period.compensation50;
      const totalCompensation = compensation25 + compensation50;

      return {
        id: period["startsAt"].format("Iso8601"),
        startsAt: period["startsAt"].format("Iso8601"),
        endsAt: period["endsAt"].format("Iso8601"),
        totalOvertimeHours: period.totalOvertimeHours.formatHoursMinutes(),
        overtimeHours25: period.overtimeHours25.formatHoursMinutes(),
        compensation25,
        overtimeHours50: period.overtimeHours50.formatHoursMinutes(),
        compensation50,
        totalCompensation,
      };
    });

    const hoursRecallTotal25 = sumBy(lines, (l) => l.compensation25);
    const hoursRecallTotal50 = sumBy(lines, (l) => l.compensation50);
    const hoursRecallTotalComp = hoursRecallTotal25 + hoursRecallTotal50;

    const vacationComp = hoursRecallTotalComp * 0.1;
    const totalComp = hoursRecallTotalComp + vacationComp;

    return new LegalCaseHoursRecallView(
      { total25: hoursRecallTotal25, total50: hoursRecallTotal50, total: hoursRecallTotalComp },
      vacationComp,
      totalComp,
      lines,
    );
  }
}
