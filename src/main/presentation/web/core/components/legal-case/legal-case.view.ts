import { DateTime } from "DateTime";
import { Money } from "Money";
import { User } from "core/components/auth/domain/user";
import { Lawyer } from "core/components/lawyer/domain/lawyer";
import { LegalCase } from "core/components/legal-case/domain/legal-case";
import { ClientView } from "presentation/web/core/components/legal-case/client.view";
import { LawyerView } from "presentation/web/core/components/legal-case/lawyer.view";

export class LegalCaseView {
  constructor(
    readonly id: string,
    readonly lawyer: LawyerView,
    readonly client: ClientView | undefined,
    readonly weeklyHours: number,
    readonly startsAt: string,
    readonly endsAt: string,
    readonly baseMonthlySalary: number,
    readonly magicLinkToken: string,
    readonly createdAt: string,
    readonly updatedAt: string,
  ) {}

  static fromDomain(legalCase: LegalCase): LegalCaseView {
    return new LegalCaseView(
      legalCase["id"],
      { userId: legalCase["lawyer"]["user"]["id"] },
      legalCase["client"] ? ClientView.fromDomain(legalCase["client"]) : undefined,
      legalCase["weeklyHours"],
      legalCase["startsAt"].format("Iso8601"),
      legalCase["endsAt"].format("Iso8601"),
      legalCase["baseMonthlySalary"].cents,
      legalCase["magicLinkToken"],
      legalCase["createdAt"].format("Iso8601"),
      legalCase["updatedAt"].format("Iso8601"),
    );
  }

  static toDomain(v: LegalCaseView): LegalCase {
    return new LegalCase(
      v.id,
      new Lawyer(new User(v.lawyer.userId, "", "lawyer")),
      v.client ? ClientView.toDomain(v.client) : undefined,
      v.weeklyHours,
      DateTime.fromIsoFormattedString(v.startsAt),
      DateTime.fromIsoFormattedString(v.endsAt),
      Money.fromCents(v.baseMonthlySalary),
      v.magicLinkToken,
      [],
      [],
      DateTime.fromIsoFormattedString(v.createdAt),
      DateTime.fromIsoFormattedString(v.updatedAt),
    );
  }
}
