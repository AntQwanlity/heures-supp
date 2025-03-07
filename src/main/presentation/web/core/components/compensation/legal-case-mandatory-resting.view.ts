import { LegalCase } from "core/components/legal-case/domain/legal-case";
import sumBy from "lodash/sumBy";
import { WorkedPeriodView } from "presentation/web/core/components/legal-case/worked-period.view";

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

export class LegalCaseMandatoryRestingView {
  constructor(
    public mandatoryRestingCompensation: number,
    public vacationCompensation: number,
    public totalCompensation: number,
    public yearlyPeriods: WorkedPeriodView[],
  ) {}

  static create(legalCase: LegalCase): LegalCaseMandatoryRestingView {
    const yearlyPeriods = legalCase.workedYearsPeriods.map((period) =>
      WorkedPeriodView.create(period),
    );

    const mandatoryRestingCompensation = sumBy(yearlyPeriods, (yp) => yp.compensationYearlyQuota);
    const vacationCompensation = mandatoryRestingCompensation * 0.1;
    const totalCompensation = mandatoryRestingCompensation + vacationCompensation;

    return new LegalCaseMandatoryRestingView(
      mandatoryRestingCompensation,
      vacationCompensation,
      totalCompensation,
      yearlyPeriods,
    );
  }
}
