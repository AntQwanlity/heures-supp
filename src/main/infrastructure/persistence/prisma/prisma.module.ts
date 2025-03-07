import { Module } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { TransactionService } from "core/ports/persistence/transaction.service";
import { SecretRepository } from "core/ports/secret/secret.repository";
import { PrismaProdClientOptions } from "infrastructure/persistence/prisma/prisma-prod-client.options";
import { PrismaStagingClientOptions } from "infrastructure/persistence/prisma/prisma-staging-client.options";
import { PrismaTransactionService } from "infrastructure/persistence/prisma/prisma-transaction.service";
import { PrismaService } from "infrastructure/persistence/prisma/prisma.service";
import { TransactionContext } from "infrastructure/persistence/prisma/transaction.context";

@Module({
  providers: [
    {
      provide: PrismaClient,
      inject: [SecretRepository],
      useFactory: async (secretRepository: SecretRepository) => {
        const [host, dbName, username, password] = await Promise.all([
          secretRepository.get("db_host"),
          secretRepository.get("db_name"),
          secretRepository.get("db_username"),
          secretRepository.get("db_password"),
        ]);

        const options =
          process.env.NODE_ENV === "production"
            ? PrismaProdClientOptions
            : PrismaStagingClientOptions;

        return new PrismaClient({
          ...options,
          datasources: {
            db: {
              url: `postgresql://${username}:${password}@cloudbuild:5432/${dbName}?host=${host}`,
            },
          },
        });
      },
    },
    TransactionContext,
    { provide: TransactionService, useClass: PrismaTransactionService },
    PrismaService,
  ],
  exports: [PrismaService, TransactionService],
})
export class PrismaModule {}
