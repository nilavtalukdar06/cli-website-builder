import express, { Router } from "express";
import { authorize, deviceController, poll } from "src/controllers/device";
import { authenticate } from "src/middlewares/auth";

const router: Router = express.Router();

router.post("/create", deviceController);

router.post("/authorize", authenticate, authorize);

router.post("/poll", poll);

export default router;
