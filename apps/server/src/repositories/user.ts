import { Plan } from "generated/prisma/enums";
import { prisma } from "../lib/prisma";

export abstract class UserRepository {
  constructor() {}
  static async findByEmail(email: string) {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    return user;
  }
  static async createUser(email: string, password: string) {
    const user = await prisma.user.create({
      data: { email, password },
    });
    return {
      id: user.id,
      email: user.email,
    };
  }
  static async findById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, plan: true, generationsUsed: true },
    });
    return user;
  }
  static async incrementGenerationCount(userId: string) {
    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        generationsUsed: {
          increment: 1,
        },
      },
    });
    return {
      id: user.id,
      email: user.email,
      plan: user.plan,
      generationsUsed: user.generationsUsed,
    };
  }
  static async updatePlan(userId: string, plan: Plan) {
    const updatedPlan = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        plan,
      },
    });
    return updatedPlan;
  }
}
