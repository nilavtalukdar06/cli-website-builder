import express, { type Router } from "express";
import { createApp } from "src/controllers/create-app";

const router: Router = express.Router();

router.post("/create", createApp);

export default router;
