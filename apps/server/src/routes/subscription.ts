import express, { Router } from "express";
import { checkout, portal } from "src/controllers/subscription";
import { authenticate } from "src/middlewares/auth";

const router: Router = express.Router();

/**
 * @openapi
 * /api/billing/checkout:
 *   post:
 *     summary: Create a Stripe Checkout Session for upgrading to PRO
 *     tags: [Billing & Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully created session, returns checkout redirect url
 *       401:
 *         description: Unauthorized
 */
router.post("/checkout", authenticate, checkout);

/**
 * @openapi
 * /api/billing/portal:
 *   post:
 *     summary: Create a Stripe Customer Portal Session for managing subscriptions
 *     tags: [Billing & Subscriptions]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully created customer portal session url
 *       401:
 *         description: Unauthorized
 */
router.post("/portal", authenticate, portal);

export default router;
