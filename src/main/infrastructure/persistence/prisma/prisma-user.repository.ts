import { Injectable } from "@nestjs/common";
import { Prisma, User as DbUser } from "@prisma/client";
import { UserRepository } from "core/components/auth/application/user.repository";
import { User } from "core/components/auth/domain/user";
import { PrismaDelegate } from "infrastructure/persistence/prisma/prisma.delegate";

@Injectable()
export class PrismaUserRepository implements UserRepository {
  constructor(private readonly userDelegate: PrismaDelegate<"user">) {}

  private toDomainModel(prismaModel: DbUser) {
    return new User(prismaModel.id, prismaModel.email, prismaModel.user_type);
  }

  private toDbModel(domainModel: User): Prisma.UserCreateInput {
    return {
      id: domainModel["id"].length === 0 ? undefined : domainModel["id"],
      email: domainModel["email"],
      user_type: domainModel["userType"],
    };
  }

  async create(user: User): Promise<User> {
    return this.userDelegate.delegate
      .create({ data: this.toDbModel(user) })
      .then(this.toDomainModel);
  }

  getById(id: string): Promise<User> {
    return this.userDelegate.getByPk(id).then(this.toDomainModel);
  }
}
