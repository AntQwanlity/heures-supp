export abstract class TransactionService {
  abstract run<T>(fn: () => Promise<T>): Promise<T>;
}
