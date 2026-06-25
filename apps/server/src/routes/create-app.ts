import express, { type Router } from "express";
import { createApp } from "src/controllers/create-app";
import { checkCredits } from "src/middlewares/credit";
import { jwtAuth } from "src/middlewares/jwt";

const router: Router = express.Router();

router.post("/create", jwtAuth, checkCredits, createApp);

export default router;
