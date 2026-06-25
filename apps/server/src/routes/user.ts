import express, { type Router } from "express";
import { getMe, login, logout } from "src/controllers/session";
import { refreshCliToken, signUp } from "src/controllers/user";
import { authenticate } from "src/middlewares/auth";
import { validate } from "src/middlewares/validation";
import { sessionSchema } from "src/validators/session";
import { signUpSchema } from "src/validators/user";

const router: Router = express.Router();

/**
 * @openapi
 * /api/auth/sign-up:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Invalid input or user already exists
 */
router.post("/sign-up", validate(signUpSchema), signUp);

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Log in an existing user and create a cookie session
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Logged in successfully, session cookie set
 *       401:
 *         description: Invalid credentials
 */
router.post("/login", validate(sessionSchema), login);

/**
 * @openapi
 * /api/auth/me:
 *   get:
 *     summary: Retrieve the current logged-in user profile
 *     tags: [Authentication]
 *     security:
 *       - cookieAuth: []
 *     responses:
 *       200:
 *         description: Successfully retrieved user session info
 *       401:
 *         description: Unauthorized / session invalid or missing
 */
router.get("/me", authenticate, getMe);

/**
 * @openapi
 * /api/auth/cli/refresh:
 *   post:
 *     summary: Obtain a fresh CLI access token using a refresh token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Returns new accessToken
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post("/cli/refresh", refreshCliToken);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Log out current user and clear the session cookie
 *     tags: [Authentication]
 *     responses:
 *       200:
 *         description: Logged out successfully
 */
router.post("/logout", logout);

export default router;
