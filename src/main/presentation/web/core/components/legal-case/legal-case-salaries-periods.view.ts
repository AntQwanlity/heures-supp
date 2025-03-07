import { LegalCase } from "core/components/legal-case/domain/legal-case";
import { WorkedPeriodView } from "presentation/web/core/components/legal-case/worked-period.view";
import {
  createSalaryView,
  SalaryView,
} from "presentation/web/core/components/salaries/salary.view";

export class LegalCaseSalariesPeriodsView {
  constructor(
    public sameSalaryPeriods: WorkedPeriodView[],
    public workedYearsPeriods: WorkedPeriodView[],
    public lastYearPeriod: WorkedPeriodView,
    public sortedSalaries: SalaryView[],
  ) {}

  static create(legalCase: LegalCase) {
    return new LegalCaseSalariesPeriodsView(
      legalCase.sameSalaryPeriods.map((period) => WorkedPeriodView.create(period)),
      legalCase.workedYearsPeriods.map((period) => WorkedPeriodView.create(period)),
      WorkedPeriodView.create(legalCase.lastYearPeriod),
      legalCase.sortedSalaries.map((salary) => createSalaryView(salary)),
    );
  }
}
