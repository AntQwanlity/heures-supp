import { INestApplication, Injectable, OnModuleInit } from "@nestjs/common";
import { Prisma, PrismaClient } from "@prisma/client";
import { TransactionContext } from "infrastructure/persistence/prisma/transaction.context";

type PickByValueType<T, U> = {
  [K in keyof T as T[K] extends U ? K : never]: T[K];
};

/** Get only the entities and not the custom methods */
export type PrismaEntitiesKeys = keyof PickByValueType<PrismaClient, { create: any; update: any }>;

@Injectable()
export class PrismaService implements OnModuleInit {
  constructor(
    private readonly client: PrismaClient,
    private readonly transactionCtx: TransactionContext,
  ) {}

  async onModuleInit() {
    //await this.client.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    process.on("beforeExit", async () => {
      await app.close();
    });
  }

  getDelegateForModel<K extends PrismaEntitiesKeys>(model: K): Prisma.TransactionClient[K] {
    const transactionClient = this.transactionCtx.getStore();

    if (transactionClient) return transactionClient[model];

    return this.client[model];
  }
}
