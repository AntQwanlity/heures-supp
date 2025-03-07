import { Prisma } from "@prisma/client";
import { AsyncLocalStorage } from "node:async_hooks";

export class TransactionContext extends AsyncLocalStorage<Prisma.TransactionClient> {}
