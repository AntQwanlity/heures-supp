import { Injectable } from "@nestjs/common";
import { Lawyer as DbLawyer, Prisma, User as DbUser } from "@prisma/client";
import { User } from "core/components/auth/domain/user";
import { LawyerRepository } from "core/components/lawyer/application/lawyer.repository";
import { Lawyer } from "core/components/lawyer/domain/lawyer";
import { PrismaDelegate } from "infrastructure/persistence/prisma/prisma.delegate";

@Injectable()
export class PrismaLawyerRepository implements LawyerRepository {
  constructor(private readonly lawyerDelegate: PrismaDelegate<"lawyer">) {}

  private toDomainModel(prismaModel: DbLawyer & { user: DbUser }) {
    return new Lawyer(
      new User(prismaModel.user.id, prismaModel.user.email, prismaModel.user.user_type),
    );
  }

  private toDbModel(domainModel: Lawyer): Prisma.LawyerCreateInput {
    return {
      user: {
        create: { email: domainModel["user"]["email"], user_type: domainModel["user"]["userType"] },
      },
    };
  }

  async create(lawyer: Lawyer): Promise<Lawyer> {
    return this.toDomainModel(
      await this.lawyerDelegate.delegate.create({
        data: this.toDbModel(lawyer),
        include: { user: true },
      }),
    );
  }

  async getByUser(user: User): Promise<Lawyer> {
    return this.toDomainModel(
      await this.lawyerDelegate.delegate.findUniqueOrThrow({
        where: { user_id: user["id"] },
        include: { user: true },
      }),
    );
  }
}
