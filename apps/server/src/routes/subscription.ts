import express, { Router } from "express";
import { checkout, portal } from "src/controllers/subscription";
import { authenticate } from "src/middlewares/auth";

const router: Router = express.Router();

router.post("/checkout", authenticate, checkout);
router.post("/portal", authenticate, portal);

export default router;
