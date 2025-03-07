import { Salary } from "core/components/legal-case/domain/salary";

export type SalaryView = {
  id: string;
  date: string;
  amount: number;
};

export const createSalaryView = (salary: Salary): SalaryView => ({
  id: salary["id"],
  date: salary["date"].format("Iso8601"),
  amount: salary["amount"],
});
