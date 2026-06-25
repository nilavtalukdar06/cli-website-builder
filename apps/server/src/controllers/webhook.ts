import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { stripe } from "src/lib/stripe";
import { env } from "src/config/env";
import { WebhookService } from "src/services/webhook";
import { ApiError } from "src/utils/error";
import Stripe from "stripe";

export const handleWebhook = async (req: Request, res: Response) => {
  const sig = req.headers["stripe-signature"];
  if (!sig) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          false,
          "Missing stripe-signature header",
          {},
        ),
      );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig as string,
      env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err: any) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          false,
          `Webhook signature verification failed: ${err.message}`,
          err,
        ),
      );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        await WebhookService.handleCheckoutCompleted(session);
        break;
      }
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        await WebhookService.handleSubscriptionUpdated(subscription);
        break;
      }
      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        await WebhookService.handleSubscriptionDeleted(subscription);
        break;
      }
      default:
        // Ignore unhandled event types
        break;
    }

    return res.status(StatusCodes.OK).json({ received: true });
  } catch (error) {
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json(
        new ApiError(
          StatusCodes.INTERNAL_SERVER_ERROR,
          false,
          "Failed to process webhook event",
          error,
        ),
      );
  }
};
