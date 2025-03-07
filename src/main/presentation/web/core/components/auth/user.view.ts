import { User, UserType } from "core/components/auth/domain/user";

export class UserView {
  constructor(readonly id: string, readonly email: string, readonly userType: UserType) {}

  static fromDomain(user: User) {
    return new UserView(user["id"], user["email"], user["userType"]);
  }

  static toDomain(v: UserView): User {
    return new User(v.id, v.email, v.userType);
  }
}
