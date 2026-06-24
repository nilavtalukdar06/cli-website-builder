import { Plan } from "generated/prisma/enums";

export abstract class UsageService {
  static canGenerate(user: { plan: Plan; generationsUsed: number }) {
    if (user.plan === "PRO") {
      return true;
    } else {
      return user.generationsUsed < 2;
    }
  }
}
