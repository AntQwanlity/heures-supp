import { User } from "core/components/auth/domain/user";

export abstract class UserRepository {
  abstract getById(id: string): Promise<User>;
  abstract create(user: User): Promise<User>;
}
