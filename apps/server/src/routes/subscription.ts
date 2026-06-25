import express, { Router } from "express";
import { checkout, portal } from "src/controllers/subscription";
import { jwtAuth } from "src/middlewares/jwt";

const router: Router = express.Router();

router.post("/checkout", jwtAuth, checkout);
router.post("/portal", jwtAuth, portal);

export default router;
