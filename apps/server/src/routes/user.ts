import express, { type Router } from "express";
import { getMe, login, logout } from "src/controllers/session";
import { signUp } from "src/controllers/user";
import { authenticate } from "src/middlewares/auth";
import { validate } from "src/middlewares/validation";
import { sessionSchema } from "src/validators/session";
import { signUpSchema } from "src/validators/user";

const router: Router = express.Router();

router.post("/sign-up", validate(signUpSchema), signUp);

router.post("/login", validate(sessionSchema), login);

router.get("/me", authenticate, getMe);

router.post("/logout", logout);

export default router;
