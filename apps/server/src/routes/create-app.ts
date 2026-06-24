import express, { type Router } from "express";
import { createApp } from "src/controllers/create-app";
import { jwtAuth } from "src/middlewares/jwt";

const router: Router = express.Router();

router.post("/create", jwtAuth, createApp);

export default router;
