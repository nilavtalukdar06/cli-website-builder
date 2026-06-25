import { Plan, SubscriptionStatus } from "generated/prisma/enums";
import { StatusCodes } from "http-status-codes";
import { stripe } from "src/lib/stripe";
import { SubscriptionRepository } from "src/repositories/subscription";
import { UserRepository } from "src/repositories/user";
import { ApiError } from "src/utils/error";
import Stripe from "stripe";

export abstract class WebhookService {
  constructor() {}
  static async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const userId = session.metadata?.userId;
    if (!userId) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "user id metadata is not present",
        {},
      );
    }
    const stripeCustomerId = session.customer as string;
    const stripeSubscriptionId = session.subscription as string;
    if (!stripeCustomerId || !stripeSubscriptionId) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "missing stripe identifiers",
        {},
      );
    }
    const subscription =
      await stripe.subscriptions.retrieve(stripeSubscriptionId);
    const currentPeriodEnd = new Date(
      subscription.items.data[0].current_period_end * 1000,
    );
    const existingSubscription =
      await SubscriptionRepository.findByUserId(userId);
    if (!existingSubscription) {
      await SubscriptionRepository.create({
        userId,
        stripeCustomerId,
        stripeSubscriptionId,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd,
      });
    } else {
      await SubscriptionRepository.update(userId, {
        stripeCustomerId,
        stripeSubscriptionId,
        status: SubscriptionStatus.ACTIVE,
        currentPeriodEnd,
      });
    }
    await UserRepository.updatePlan(userId, Plan.PRO);
  }

  static async handleSubscriptionUpdated(subscription: Stripe.Subscription) {
    const stripeSubscriptionId = subscription.id;
    const status = subscription.status;
    const currentPeriodEnd = new Date(
      new Date(subscription.items.data[0].current_period_end * 1000),
    );

    const existingSubscription =
      await SubscriptionRepository.findByStripeSubscriptionId(
        stripeSubscriptionId,
      );

    if (!existingSubscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "subscription not found in DB for the given Stripe subscription ID",
        {},
      );
    }

    const userId = existingSubscription.userId;

    let dbStatus: SubscriptionStatus;
    let userPlan: Plan;

    if (status === "active" || status === "trialing") {
      dbStatus = SubscriptionStatus.ACTIVE;
      userPlan = Plan.PRO;
    } else if (status === "past_due") {
      dbStatus = SubscriptionStatus.PAST_DUE;
      userPlan = Plan.FREE;
    } else if (
      status === "canceled" ||
      status === "unpaid" ||
      status === "incomplete_expired"
    ) {
      dbStatus = SubscriptionStatus.CANCELED;
      userPlan = Plan.FREE;
    } else {
      dbStatus = SubscriptionStatus.INCOMPLETE;
      userPlan = Plan.FREE;
    }

    await SubscriptionRepository.update(userId, {
      status: dbStatus,
      currentPeriodEnd,
    });

    await UserRepository.updatePlan(userId, userPlan);
  }

  static async handleSubscriptionDeleted(subscription: Stripe.Subscription) {
    const stripeSubscriptionId = subscription.id;

    const existingSubscription =
      await SubscriptionRepository.findByStripeSubscriptionId(
        stripeSubscriptionId,
      );

    if (!existingSubscription) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "subscription not found in DB for the given Stripe subscription ID",
        {},
      );
    }

    const userId = existingSubscription.userId;

    await SubscriptionRepository.update(userId, {
      status: SubscriptionStatus.CANCELED,
    });

    await UserRepository.updatePlan(userId, Plan.FREE);
  }
}
