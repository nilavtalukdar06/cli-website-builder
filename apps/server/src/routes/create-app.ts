import express, { type Router } from "express";
import { createApp } from "src/controllers/create-app";
import { checkCredits } from "src/middlewares/credit";
import { jwtAuth } from "src/middlewares/jwt";

const router: Router = express.Router();

/**
 * @openapi
 * /api/app/create:
 *   post:
 *     summary: Request website creation/updates (streamed response)
 *     tags: [App Generation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - prompt
 *             properties:
 *               prompt:
 *                 type: string
 *                 description: Natural language instruction/description of the website to build or modify
 *               sessionId:
 *                 type: string
 *                 description: Existing VM session ID to perform edits/follow-up instructions on
 *     responses:
 *       200:
 *         description: Event stream containing VM preparation, tool logs, file edits, and completion summaries
 *       401:
 *         description: Unauthorized / invalid Bearer token
 *       402:
 *         description: Payment required / credits exhausted
 */
router.post("/create", jwtAuth, checkCredits, createApp);

export default router;
