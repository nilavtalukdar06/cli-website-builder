import express, { type Router } from "express";
import { handleWebhook } from "src/controllers/webhook";

const router: Router = express.Router();

router.post("/", handleWebhook);

export default router;
