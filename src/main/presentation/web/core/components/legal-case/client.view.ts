import { Client } from "core/components/client/domain/client";
import { Sex } from "core/components/client/domain/sex";
import { UserView } from "presentation/web/core/components/auth/user.view";

export class ClientView {
  constructor(
    readonly user: UserView,
    readonly firstName: string,
    readonly lastName: string,
    readonly sex: Sex | undefined,
  ) {}

  static fromDomain(client: Client) {
    return new ClientView(
      UserView.fromDomain(client["user"]),
      client["firstName"],
      client["lastName"],
      client["sex"],
    );
  }

  static toDomain(v: ClientView): Client {
    return new Client(UserView.toDomain(v.user), v.firstName, v.lastName, v.sex);
  }
}
