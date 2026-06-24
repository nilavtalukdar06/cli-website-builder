import express, { Router } from "express";
import { deviceController, poll } from "src/controllers/device";

const router: Router = express.Router();

router.post("/create", deviceController);

router.post("/poll", poll);

export default router;
