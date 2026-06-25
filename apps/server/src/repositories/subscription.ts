import { SubscriptionStatus } from "generated/prisma/enums";
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
  static async create(data: {
    userId: string;
    stripeCustomerId: string;
    stripeSubscriptionId: string;
    status: SubscriptionStatus;
    currentPeriodEnd: Date;
  }) {
    const subscription = await prisma.subscription.create({
      data,
    });
    return subscription;
  }
  static async update(
    userId: string,
    data: {
      stripeCustomerId?: string;
      stripeSubscriptionId?: string;
      status?: SubscriptionStatus;
      currentPeriodEnd?: Date;
    },
  ) {
    const subscription = prisma.subscription.update({
      where: { userId },
      data,
    });
    return subscription;
  }
  static async findByStripeSubscriptionId(stripeSubscriptionId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { stripeSubscriptionId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            plan: true,
            generationsUsed: true,
          },
        },
      },
    });
    return subscription;
  }
}
