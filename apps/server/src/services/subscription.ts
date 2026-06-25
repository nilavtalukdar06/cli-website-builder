import { StatusCodes } from "http-status-codes";
import { env } from "src/config/env";
import { stripe } from "src/lib/stripe";
import { SubscriptionRepository } from "src/repositories/subscription";
import { ApiError } from "src/utils/error";

export abstract class SubscriptionService {
  constructor() {}
  static async createCheckoutSession(userId: string) {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      success_url: `${env.CLIENT_URL}/billing/success`,
      cancel_url: `${env.CLIENT_URL}/billing/cancel`,
      metadata: {
        userId,
      },
      line_items: [
        {
          price: env.STRIPE_PRICE_ID,
          quantity: 1,
        },
      ],
    });
    return session.url;
  }

  static async createPortalSession(userId: string) {
    const subscription = await SubscriptionRepository.findByUserId(userId);
    if (!subscription || !subscription.stripeCustomerId) {
      throw new ApiError(
        StatusCodes.NOT_FOUND,
        false,
        "No active subscription found. Please subscribe first.",
        {},
      );
    }
    const session = await stripe.billingPortal.sessions.create({
      customer: subscription.stripeCustomerId,
      return_url: `${env.CLIENT_URL}/dashboard`,
    });
    return session.url;
  }
}
