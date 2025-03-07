export type UserType = "lawyer" | "employee";

export class User {
  constructor(private readonly id: string, private email: string, private userType: UserType) {}

  updateEmail(email: string): void {
    this.email = email;
  }
}
