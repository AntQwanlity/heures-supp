import { LegalCase } from "core/components/legal-case/domain/legal-case";
import sumBy from "lodash/sumBy";
import { WorkedPeriodView } from "presentation/web/core/components/legal-case/worked-period.view";

export class LegalCaseConcealedWorkView {
  constructor(
    public lastYearMonthlyPeriods: WorkedPeriodView[],
    public avgRate: number,
    public numMonths: number,
    public totalCompensation: number,
  ) {}

  static create(legalCase: LegalCase): LegalCaseConcealedWorkView {
    const monthlyPeriods = legalCase.monthlyPeriods;
    const lastYearMonthlyPeriods = legalCase.lastYearMonthlyPeriods.map((p) =>
      WorkedPeriodView.create(p),
    );

    const totalPeriodsCompensation = sumBy(
      monthlyPeriods.map((p) => p.compensation25 + p.compensation50),
    );

    const avgRate =
      sumBy(
        lastYearMonthlyPeriods.map(
          (p) => p.compensation25 + p.compensation50 + p.totalSalariesAmount,
        ),
      ) / lastYearMonthlyPeriods.length;

    const months = totalPeriodsCompensation === 0 ? 0 : 6;
    const totalCompensation = avgRate * months;

    return new LegalCaseConcealedWorkView(
      lastYearMonthlyPeriods,
      avgRate,
      months,
      totalCompensation,
    );
  }
}
