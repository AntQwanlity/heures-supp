import { User } from "core/components/auth/domain/user";
import { Lawyer } from "core/components/lawyer/domain/lawyer";

export abstract class LawyerRepository {
  abstract create(user: Lawyer): Promise<Lawyer>;
  abstract getByUser(user: User): Promise<Lawyer>;
}
