import express from "express";
import authRouter from "./auth.routes.js";
import actionRouter from "./action.routes.js";
import deviceRouter from "./device.routes.js";
import webhookRouter from "./webhook.routes.js";
import { restrictToUser } from "../middlewares/authorization.middlewares.js";

const router = express.Router();

// public routes
router.get(["/health", "/"], (req, res) => {
  res.sendResponse(200, { message: "Health Check for 'Open Alert' APIs." });
});
router.use("/auth", authRouter);

// webhook routes
router.use("/webhook", webhookRouter);

// restrict routes below to authenticated users only
// router.use(restrictToUser("user"));
router.use("/action", actionRouter);
router.use("/device", deviceRouter);

export default router;
