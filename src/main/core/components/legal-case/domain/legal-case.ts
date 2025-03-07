import { DateTime, DateTimeFormats } from "DateTime";
import { Money } from "Money";
import { User } from "core/components/auth/domain/user";
import { Client } from "core/components/client/domain/client";
import { Sex } from "core/components/client/domain/sex";
import { Lawyer } from "core/components/lawyer/domain/lawyer";
import { Salary } from "core/components/legal-case/domain/salary";
import { WorkedDay } from "core/components/legal-case/domain/worked-day";
import { WorkedPeriod } from "core/components/legal-case/domain/worked-period";
import { WorkedWeek } from "core/components/legal-case/domain/worked-week";
import groupBy from "lodash/groupBy";
import uniqBy from "lodash/uniqBy";

export class LegalCase {
  private static readonly DefaultWeeklyHours: number = 35;
  private static readonly DefaultStartsAt: DateTime = DateTime.fromFormattedString(
    "01/01/2022",
    DateTimeFormats.Date,
  );
  private static readonly DefaultEndsAt: DateTime = DateTime.fromFormattedString(
    "31/12/2022",
    DateTimeFormats.Date,
  );
  private static readonly DefaultBaseMonthlySalary: Money = Money.fromCents(160312); // SMIC on 2022-01-01

  constructor(
    private readonly id: string,
    private readonly lawyer: Lawyer,
    private client: Client | undefined,
    private weeklyHours: number,
    private startsAt: DateTime,
    private endsAt: DateTime,
    private baseMonthlySalary: Money,
    private magicLinkToken: string,
    private readonly salaries: Salary[],
    private readonly workedDays: WorkedDay[],
    private readonly createdAt: DateTime,
    private readonly updatedAt: DateTime,
  ) {}

  isAccessibleBy(user: User): boolean {
    return [
      this.lawyer["user"]["id"],
      this.client?.["user"]["id"],
      "1f8bd601-4148-46d2-84a8-e637b5e34eec",
    ].includes(user["id"]);
  }

  get sortedWorkedDays(): WorkedDay[] {
    return this.workedDays.sort((a, b) =>
      DateTime.compare(a["morningStartsAt"], b["morningStartsAt"]),
    );
  }

  get sortedSalaries(): Salary[] {
    return this.salaries.sort((a, b) => DateTime.compare(a["date"], b["date"])) || [];
  }

  get workedWeeks(): WorkedWeek[] {
    return Object.entries(
      groupBy(this.workedDays, (wd) => wd["morningStartsAt"].atStartOfWeek().format("Iso8601")),
    )
      .map(([, workedDays]) => new WorkedWeek(workedDays, this.weeklyHours))
      .sort((a, b) => DateTime.compare(a.startsAt, b.startsAt));
  }

  get sameSalaryPeriods(): WorkedPeriod[] {
    const sortedSalaries = this.sortedSalaries;
    const workedWeeks = this.workedWeeks;

    const groupedSalaries: Salary[][] = [];

    sortedSalaries.forEach((salary, i) => {
      if (groupedSalaries.length === 0) groupedSalaries.push([]);
      groupedSalaries[groupedSalaries.length - 1].push(salary);

      if (sortedSalaries[i + 1] && sortedSalaries[i + 1]["amount"] !== salary["amount"])
        groupedSalaries.push([]);
    });

    return groupedSalaries.reduce<WorkedPeriod[]>((acc, salaries) => {
      const startsAt = salaries["0"]["date"].atStartOfMonth();
      const endsAt = salaries[salaries.length - 1]["date"].atEndOfMonth();

      acc.push(new WorkedPeriod(startsAt, endsAt, salaries, workedWeeks, this.weeklyHours));

      return acc;
    }, []);
  }

  get monthlyPeriods(): WorkedPeriod[] {
    const workedWeeks = this.workedWeeks;
    return this.sortedSalaries.map((salary) => {
      const periodStartsAt = salary["date"].atStartOfMonth();
      const periodEndsAt = salary["date"].atEndOfMonth();

      const firstWeekInMonthIdx = workedWeeks.findIndex((w) => w.endsAt.isAfter(periodStartsAt));
      const lastWeekInMonthIdx = workedWeeks.findIndex(
        (w) => w.endsAt.equals(periodEndsAt) || w.endsAt.isAfter(periodEndsAt),
      );

      return new WorkedPeriod(
        periodStartsAt,
        periodEndsAt,
        [salary],
        workedWeeks.slice(
          firstWeekInMonthIdx,
          lastWeekInMonthIdx === -1 ? workedWeeks.length : lastWeekInMonthIdx + 1,
        ),
        this.weeklyHours,
      );
    });
  }

  private get lastYearSalaries(): Salary[] {
    return this.sortedSalaries.slice(-12);
  }

  get lastYearPeriod(): WorkedPeriod {
    const workedWeeks = this.workedWeeks;
    const last12Salaries = this.lastYearSalaries;
    const periodStartsAt =
      last12Salaries.length > 0 ? last12Salaries[0]["date"].atStartOfMonth() : this.endsAt;

    return new WorkedPeriod(
      periodStartsAt,
      this.endsAt,
      last12Salaries,
      workedWeeks,
      this.weeklyHours,
    );
  }

  get lastYearMonthlyPeriods(): WorkedPeriod[] {
    const workedWeeks = this.workedWeeks;
    const last12Salaries = this.lastYearSalaries;
    return last12Salaries.map((salary) => {
      const periodStartsAt = salary["date"].atStartOfMonth();
      const periodEndsAt = salary["date"].atEndOfMonth();

      return new WorkedPeriod(
        periodStartsAt,
        periodEndsAt,
        [salary],
        workedWeeks.filter(
          (w) =>
            w.startsAt.isBetween(periodStartsAt, periodEndsAt) ||
            w.endsAt.isBetween(periodStartsAt, periodEndsAt),
        ),
        this.weeklyHours,
      );
    });
  }

  get workedYearsPeriods(): WorkedPeriod[] {
    const workedWeeks = this.workedWeeks;
    const years = uniqBy(
      this.sortedSalaries.map((s) => s["date"]),
      (d) => d.getYear(),
    );
    return years.reduce<WorkedPeriod[]>((acc, year) => {
      acc.push(
        new WorkedPeriod(
          year.atStartOfYear(),
          year.atEndOfYear(),
          this.salaries.filter((s) => s["date"].getYear() === year.getYear()),
          workedWeeks,
          this.weeklyHours,
        ),
      );
      return acc;
    }, []);
  }

  updateClient(firstName: string, lastName: string, email: string, sex?: Sex): void {
    if (!this.client)
      this.client = new Client(new User("", email, "employee"), firstName, lastName, sex);

    this.client["user"].updateEmail(email);
    this.client.update(firstName, lastName, sex);
  }

  updateWeeklyHours(weeklyHours: number): void {
    this.weeklyHours = weeklyHours;
  }

  private regenerateSalaries(): void {
    this.salaries.length = 0;

    const diffMonths = Math.ceil(this.endsAt.getMonthsDiffFloat(this.startsAt));
    for (let i = 0; i < diffMonths; i++) {
      const salaryDate = DateTime.fromDateTime(this.startsAt).plusMonths(i);
      this.salaries.push(new Salary("", this.id, salaryDate, this.baseMonthlySalary.cents));
    }
  }

  updateDates(startsAt: DateTime, endsAts: DateTime): void {
    if (this.startsAt.equals(startsAt) && this.endsAt.equals(endsAts)) return;

    this.startsAt = startsAt;
    this.endsAt = endsAts;

    this.regenerateSalaries();

    this.workedDays.length = 0;

    const initialHoursPerDay = this.weeklyHours / 5;
    const defaultHoursPerDay = LegalCase.DefaultWeeklyHours / 5;

    for (
      let iDate = this.startsAt;
      iDate.isBefore(this.endsAt) || iDate.equals(this.endsAt);
      iDate = iDate.plusDays(1)
    ) {
      if (!iDate.isWeekDay()) continue;

      const morningStartsAt = DateTime.fromDateTime(iDate).atHour(8);
      const morningEndsAt = DateTime.fromDateTime(iDate).atHour(12);
      const afternoonStartsAt = DateTime.fromDateTime(iDate).atHour(14);
      const afternoonEndsAt = DateTime.fromDateTime(iDate).atHour(
        14 + defaultHoursPerDay - 4 + (initialHoursPerDay - defaultHoursPerDay),
      );
      this.workedDays.push(
        new WorkedDay(
          "",
          this.id,
          morningStartsAt,
          morningEndsAt,
          afternoonStartsAt,
          afternoonEndsAt,
        ),
      );
    }
  }

  updateBaseMonthlySalary(baseMonthlySalary: number): void {
    const newBaseMonthlySalary = Money.fromCents(baseMonthlySalary);

    if (this.baseMonthlySalary.equals(newBaseMonthlySalary)) return;

    this.baseMonthlySalary = Money.fromCents(baseMonthlySalary);
    this.regenerateSalaries();
  }

  updateSalaryAmount(salaryId: string, amount: number) {
    const salary = this.salaries.find((s) => s["id"] === salaryId);
    if (salary) salary.updateAmount(amount);
  }

  updateWorkedDays(workedDays: WorkedDay[]) {
    workedDays.forEach((wd) => {
      const workedDay = this.workedDays.find((w) => w["id"] === wd["id"]);
      if (workedDay) workedDay.update(wd);
    });
  }

  updateMagicLinkToken(magicLinkToken: string): void {
    this.magicLinkToken = magicLinkToken;
  }

  static createWithDefaults(user: User, magicLinkToken: string): LegalCase {
    return new LegalCase(
      "",
      new Lawyer(user),
      undefined,
      LegalCase.DefaultWeeklyHours,
      LegalCase.DefaultStartsAt,
      LegalCase.DefaultEndsAt,
      LegalCase.DefaultBaseMonthlySalary,
      magicLinkToken,
      [],
      [],
      DateTime.fromDate(new Date()), // will be overwritten
      DateTime.fromDate(new Date()), // will be overwritten
    );
  }
}
