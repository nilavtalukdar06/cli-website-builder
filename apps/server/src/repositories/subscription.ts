import { prisma } from "src/lib/prisma";

export abstract class SubscriptionRepository {
  constructor() {}
  static async findByUserId(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: {
        userId,
      },
    });
    return subscription;
  }
  static async create(userId: string) {
    const subscription = await prisma.subscription.create({
      data: {
        userId,
        status: "INCOMPLETE",
      },
    });
    return subscription;
  }
}
