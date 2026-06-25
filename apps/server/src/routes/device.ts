import express, { Router } from "express";
import { authorize, deviceController, poll } from "src/controllers/device";
import { authenticate } from "src/middlewares/auth";

const router: Router = express.Router();

/**
 * @openapi
 * /api/device/create:
 *   post:
 *     summary: Initiate a device flow login session
 *     tags: [Device Flow]
 *     responses:
 *       200:
 *         description: Successfully created device flow code details
 */
router.post("/create", deviceController);

/**
 * @openapi
 * /api/device/authorize:
 *   post:
 *     summary: Authorize a device with a user code
 *     tags: [Device Flow]
 *     security:
 *       - cookieAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userCode
 *             properties:
 *               userCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Device authorized successfully
 *       401:
 *         description: Unauthorized
 */
router.post("/authorize", authenticate, authorize);

/**
 * @openapi
 * /api/device/poll:
 *   post:
 *     summary: Poll status of the device flow authorization session
 *     tags: [Device Flow]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - deviceCode
 *             properties:
 *               deviceCode:
 *                 type: string
 *     responses:
 *       200:
 *         description: Return status and refresh/access tokens if authorized
 *       400:
 *         description: Device not yet authorized or expired
 */
router.post("/poll", poll);

export default router;
