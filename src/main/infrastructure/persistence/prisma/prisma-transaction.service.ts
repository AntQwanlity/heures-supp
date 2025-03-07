import { Injectable, Logger } from "@nestjs/common";
import { PrismaClient } from "@prisma/client";
import { TransactionService } from "core/ports/persistence/transaction.service";
import { TransactionContext } from "infrastructure/persistence/prisma/transaction.context";

@Injectable()
export class PrismaTransactionService implements TransactionService {
  private static readonly MaxTries = 3;

  // see https://www.prisma.io/docs/concepts/components/prisma-client/transactions#transaction-timing-issues
  private static readonly ErrorCodeWriteConflictOrDeadlock = "P2034";

  // We use the most restrictive isolation level to avoid any concurrency issues
  // Downside is that it can slow down transactions execution because they run in serial order.
  // If this becomes a problem, we could allow to customize isolation level for each transaction.
  private static readonly IsolationLevel = "Serializable";

  // TODO : this is probably too much.
  private static readonly TimeoutSeconds = 10;

  constructor(
    private readonly prismaClient: PrismaClient,
    private readonly transactionCtx: TransactionContext,
  ) {}

  async run<T>(fn: () => Promise<T>): Promise<T> {
    const transactionWasAlreadyOpened = this.transactionCtx.getStore() !== undefined;

    if (transactionWasAlreadyOpened)
      throw new Error("A transaction was already opened ! Only start transactions in AppServices.");

    return this.tryToRun(fn, 1);
  }

  private tryToRun<T>(fn: () => Promise<T>, numTries: number): Promise<T> {
    try {
      return this.prismaClient.$transaction(async (tx) => this.transactionCtx.run(tx, fn), {
        isolationLevel: PrismaTransactionService.IsolationLevel,
        timeout: PrismaTransactionService.TimeoutSeconds * 1000,
      });
    } catch (error: any) {
      if (error.code === PrismaTransactionService.ErrorCodeWriteConflictOrDeadlock) {
        if (numTries === PrismaTransactionService.MaxTries) throw error;

        Logger.warn(
          `Write conflict or deadlock during transaction, retrying (num tries : ${numTries})...`,
        );

        return this.tryToRun(fn, numTries + 1);
      }

      throw error;
    }
  }
}
