import express from "express";
import { sendNotification } from "../controllers/fcm_notification.controller.js";
const router = express.Router();

router.post("/send-notification", sendNotification);

export default router;
