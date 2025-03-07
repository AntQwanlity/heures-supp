import { LegalCase } from "core/components/legal-case/domain/legal-case";

export abstract class LegalCaseRepository {
  abstract create(legalCase: LegalCase): Promise<LegalCase>;
  abstract getAllByUser(userId: string): Promise<LegalCase[]>;
  abstract getByPk(id: string, withWorkedDays?: boolean): Promise<LegalCase>;
  abstract update(legalCase: LegalCase): Promise<LegalCase>;
}
