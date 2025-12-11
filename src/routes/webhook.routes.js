import express from "express";
import WebhookController from "../controllers/webhook.controller.js";
const router = express.Router();

router.post("/send-notification", WebhookController.sendPushNotification);

export default router;
