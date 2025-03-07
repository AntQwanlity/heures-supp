import { Injectable } from "@nestjs/common";
import { FirebaseUser as DbFirebaseUser, Prisma } from "@prisma/client";
import { FirebaseUserRepository } from "core/components/auth/application/firebase-user.repository";
import { FirebaseUser } from "core/components/auth/domain/firebase-user";
import { PrismaDelegate } from "infrastructure/persistence/prisma/prisma.delegate";

@Injectable()
export class PrismaFirebaseUserRepository implements FirebaseUserRepository {
  constructor(private readonly firebaseUserDelegate: PrismaDelegate<"firebaseUser">) {}

  private toDomainModel(prismaModel: DbFirebaseUser) {
    return new FirebaseUser(prismaModel.user_id, prismaModel.firebase_id);
  }

  private toDbModel(domainModel: FirebaseUser): Prisma.FirebaseUserCreateInput {
    return {
      user: { connect: { id: domainModel["userId"] } },
      firebase_id: domainModel["firebaseId"],
    };
  }

  async create(firebaseUser: FirebaseUser): Promise<void> {
    await this.firebaseUserDelegate.delegate.create({ data: this.toDbModel(firebaseUser) });
  }

  getByUserId(userId: string): Promise<FirebaseUser> {
    return this.firebaseUserDelegate.delegate
      .findUniqueOrThrow({ where: { user_id: userId } })
      .then(this.toDomainModel);
  }
  getByFirebaseId(firebaseId: string): Promise<FirebaseUser> {
    return this.firebaseUserDelegate.delegate
      .findUniqueOrThrow({ where: { firebase_id: firebaseId } })
      .then(this.toDomainModel);
  }
}
