import { env } from "src/config/env";
import { stripe } from "src/lib/stripe";

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
}
