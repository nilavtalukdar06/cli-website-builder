import express, { type Router } from "express";
import { handleWebhook } from "src/controllers/webhook";

const router: Router = express.Router();

/**
 * @openapi
 * /api/webhook:
 *   post:
 *     summary: Stripe Webhook receiver endpoint
 *     tags: [Billing & Subscriptions]
 *     parameters:
 *       - in: header
 *         name: stripe-signature
 *         required: true
 *         schema:
 *           type: string
 *         description: Cryptographic signature to verify the request integrity
 *     responses:
 *       200:
 *         description: Webhook received and processed successfully
 *       400:
 *         description: Bad request (missing signature header or invalid signature verification)
 *       500:
 *         description: Internal server error processing the webhook event
 */
router.post("/", handleWebhook);

export default router;
