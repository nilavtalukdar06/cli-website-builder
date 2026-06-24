import express, { type Router } from "express";
import { signUp } from "src/controllers/user";
import { validate } from "src/middlewares/validation";
import { signUpSchema } from "src/validators/user";

const router: Router = express.Router();

router.post("/sign-up", validate(signUpSchema),signUp);

export default router;
