import express, { Router } from "express";
import { checkout } from "src/controllers/subscription";
import { jwtAuth } from "src/middlewares/jwt";

const router: Router = express.Router();

router.post("/checkout", jwtAuth, checkout);

export default router;
