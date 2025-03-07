import { DateTime } from "DateTime";
import { Duration } from "Duration";

export class WorkedDay {
  constructor(
    private readonly id: string,
    private readonly legalCaseId: string,
    private morningStartsAt: DateTime,
    private morningEndsAt: DateTime,
    private afternoonStartsAt: DateTime,
    private afternoonEndsAt: DateTime,
  ) {}

  get totalWorkedHours(): Duration {
    return this.morningEndsAt
      .getDiff(this.morningStartsAt)
      .plus(this.afternoonEndsAt.getDiff(this.afternoonStartsAt));
  }

  update(newWorkedDay: WorkedDay) {
    if (
      newWorkedDay["morningStartsAt"].isAfter(newWorkedDay["morningEndsAt"]) ||
      newWorkedDay["afternoonStartsAt"].isAfter(newWorkedDay["afternoonEndsAt"]) ||
      newWorkedDay["morningStartsAt"].isAfter(newWorkedDay["afternoonStartsAt"])
    )
      throw new Error("Invalid worked day");

    this.morningStartsAt = newWorkedDay["morningStartsAt"];
    this.morningEndsAt = newWorkedDay["morningEndsAt"];
    this.afternoonStartsAt = newWorkedDay["afternoonStartsAt"];
    this.afternoonEndsAt = newWorkedDay["afternoonEndsAt"];
  }
}
