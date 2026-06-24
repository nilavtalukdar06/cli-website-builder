import express, { type Router } from "express";
import { signUp } from "src/controllers/user";

const router: Router = express.Router();

router.post("/sign-up", signUp);

export default router;
