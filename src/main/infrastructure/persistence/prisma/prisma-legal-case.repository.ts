import { Injectable } from "@nestjs/common";
import {
  Client as DbClient,
  Lawyer as DbLawyer,
  LegalCase as DbLegalCase,
  Prisma,
  Salary as DbSalary,
  User as DbUser,
  WorkedDay as DbWorkedDay,
} from "@prisma/client";
import { DateTime } from "DateTime";
import { Money } from "Money";
import { User } from "core/components/auth/domain/user";
import { Client } from "core/components/client/domain/client";
import { Lawyer } from "core/components/lawyer/domain/lawyer";
import { LegalCaseRepository } from "core/components/legal-case/application/legal-case.repository";
import { LegalCase } from "core/components/legal-case/domain/legal-case";
import { Salary } from "core/components/legal-case/domain/salary";
import { WorkedDay } from "core/components/legal-case/domain/worked-day";
import { PrismaDelegate } from "infrastructure/persistence/prisma/prisma.delegate";

const IncludeUsers = { lawyer: { include: { user: true } }, client: { include: { user: true } } };

const IncludeAll = {
  worked_days: true,
  salaries: true,
  ...IncludeUsers,
};

@Injectable()
export class PrismaLegalCaseRepository implements LegalCaseRepository {
  constructor(private readonly legalCaseDelegate: PrismaDelegate<"legalCase">) {}

  private toDomainModel(
    prismaModel: DbLegalCase & {
      worked_days?: DbWorkedDay[];
      salaries?: DbSalary[];
      lawyer: DbLawyer & { user: DbUser };
      client: (DbClient & { user: DbUser }) | null;
    },
  ) {
    return new LegalCase(
      prismaModel.id,
      new Lawyer(
        new User(
          prismaModel.lawyer.user.id,
          prismaModel.lawyer.user.email,
          prismaModel.lawyer.user.user_type,
        ),
      ),
      prismaModel.client
        ? new Client(
            new User(
              prismaModel.client.user.id,
              prismaModel.client.user.email,
              prismaModel.client.user.user_type,
            ),
            prismaModel.client.first_name,
            prismaModel.client.last_name,
            prismaModel.client.sex || undefined,
          )
        : undefined,
      prismaModel.weekly_hours,
      DateTime.fromDate(prismaModel.starts_at),
      DateTime.fromDate(prismaModel.ends_at),
      Money.fromCents(prismaModel.base_monthly_salary),
      prismaModel.magic_link_token,
      (prismaModel.salaries || []).map(
        (salary) =>
          new Salary(
            salary.id,
            salary.legal_case_id,
            DateTime.fromDate(salary.date),
            salary.amount,
          ),
      ),
      (prismaModel.worked_days || []).map(
        (workedDays) =>
          new WorkedDay(
            workedDays.id,
            workedDays.legal_case_id,
            DateTime.fromDate(workedDays.morning_starts_at),
            DateTime.fromDate(workedDays.morning_ends_at),
            DateTime.fromDate(workedDays.afternoon_starts_at),
            DateTime.fromDate(workedDays.afternoon_ends_at),
          ),
      ),
      DateTime.fromDate(prismaModel.created_at),
      DateTime.fromDate(prismaModel.updated_at),
    );
  }

  private workedDaysToDbModel(wd: WorkedDay): Prisma.WorkedDayCreateWithoutLegal_caseInput {
    return {
      morning_starts_at: wd["morningStartsAt"].getNativeDate(),
      morning_ends_at: wd["morningEndsAt"].getNativeDate(),
      afternoon_starts_at: wd["afternoonStartsAt"].getNativeDate(),
      afternoon_ends_at: wd["afternoonEndsAt"].getNativeDate(),
    };
  }

  private salaryToDbModel(salary: Salary): Prisma.SalaryCreateWithoutLegal_caseInput {
    return {
      date: salary["date"].getNativeDate(),
      amount: salary["amount"],
    };
  }

  private toDbModelCreate(domainModel: LegalCase): Prisma.LegalCaseCreateInput {
    return {
      lawyer: { connect: { user_id: domainModel["lawyer"]["user"]["id"] } },
      client: domainModel["client"]
        ? { connect: { user_id: domainModel["client"]["user"]["id"] } }
        : undefined,
      weekly_hours: domainModel["weeklyHours"],
      starts_at: domainModel["startsAt"].getNativeDate(),
      ends_at: domainModel["endsAt"].getNativeDate(),
      base_monthly_salary: domainModel["baseMonthlySalary"].cents,
      magic_link_token: domainModel["magicLinkToken"],
      salaries: {
        create: domainModel["salaries"].map((salary) => this.salaryToDbModel(salary)),
      },
      worked_days: {
        create: domainModel["workedDays"].map((workedDays) => this.workedDaysToDbModel(workedDays)),
      },
    };
  }

  private toDbModel(domainModel: LegalCase): Prisma.LegalCaseUpdateInput {
    return {
      lawyer: { connect: { user_id: domainModel["lawyer"]["user"]["id"] } },
      client: domainModel["client"]
        ? {
            upsert: {
              update: {
                sex: domainModel["client"]["sex"],
                first_name: domainModel["client"]["firstName"],
                last_name: domainModel["client"]["lastName"],
                user: {
                  update: {
                    email: domainModel["client"]["user"]["email"],
                  },
                },
              },
              create: {
                sex: domainModel["client"]["sex"],
                first_name: domainModel["client"]["firstName"],
                last_name: domainModel["client"]["lastName"],
                user: {
                  create: {
                    email: domainModel["client"]["user"]["email"],
                    user_type: domainModel["client"]["user"]["userType"],
                  },
                },
              },
            },
          }
        : undefined,
      weekly_hours: domainModel["weeklyHours"],
      starts_at: domainModel["startsAt"].getNativeDate(),
      ends_at: domainModel["endsAt"].getNativeDate(),
      base_monthly_salary: domainModel["baseMonthlySalary"].cents,
      magic_link_token: domainModel["magicLinkToken"],
      salaries: {
        deleteMany: {},
        createMany: {
          data: domainModel["salaries"].map((salary) => this.salaryToDbModel(salary)),
        },
      },
      worked_days: {
        deleteMany: {},
        createMany: {
          data: domainModel["workedDays"].map((w) => this.workedDaysToDbModel(w)),
        },
      },
    };
  }

  async create(legalCase: LegalCase): Promise<LegalCase> {
    const dbLegalCase = await this.legalCaseDelegate.delegate.create({
      data: { ...this.toDbModelCreate(legalCase), id: undefined },
      include: IncludeAll,
    });

    return this.toDomainModel(dbLegalCase);
  }

  async getAllByUser(userId: string): Promise<LegalCase[]> {
    const dbLegalCases = await this.legalCaseDelegate.delegate.findMany({
      where: { lawyer_id: userId },
      include: IncludeUsers,
      orderBy: { created_at: "asc" },
    });
    return dbLegalCases.map((dbLegalCase) => this.toDomainModel(dbLegalCase));
  }

  async getByPk(id: string, withWorkedDays?: boolean): Promise<LegalCase> {
    return this.legalCaseDelegate.delegate
      .findUniqueOrThrow({
        where: { id },
        include: {
          ...IncludeAll,
          worked_days: withWorkedDays !== undefined ? withWorkedDays : IncludeAll.worked_days,
        },
      })
      .then(this.toDomainModel);
  }

  async update(legalCase: LegalCase): Promise<LegalCase> {
    const updatedLc = await this.legalCaseDelegate.delegate.update({
      where: { id: legalCase["id"] },
      data: this.toDbModel(legalCase),
      include: IncludeAll,
    });

    return this.toDomainModel(updatedLc);
  }
}
