import { User } from "core/components/auth/domain/user";
import { Sex } from "core/components/client/domain/sex";

export class Client {
  constructor(
    private readonly user: User,
    private firstName: string,
    private lastName: string,
    private sex?: Sex,
  ) {}

  update(firstName: string, lastName: string, sex?: Sex): void {
    this.sex = sex;
    this.firstName = firstName;
    this.lastName = lastName;
  }
}
