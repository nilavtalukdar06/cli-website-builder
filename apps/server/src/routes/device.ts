import express, { Router } from "express";
import { deviceController } from "src/controllers/device";

const router: Router = express.Router();

router.post("/create", deviceController);

export default router;
