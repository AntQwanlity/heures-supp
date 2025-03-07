import { DateTime } from "DateTime";

export class Salary {
  constructor(
    private readonly id: string,
    private readonly legalCaseId: string,
    private readonly date: DateTime,
    private amount: number,
  ) {}

  updateAmount(amount: number) {
    if (amount < 0) throw new Error("Amount cannot be negative");

    this.amount = amount;
  }
}
