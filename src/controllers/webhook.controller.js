import sendPushNotification from "../services/fcm_notification.service.js";
import DeviceService from "../services/device.service.js";

const WebhookController = {
  async sendPushNotification(req, res) {
    try {
      const token = req.headers["x-open-alert-token"];
      // todo: later have token per user or per client app
      if (token === undefined || token !== process.env.WEBHOOK_TOKEN) {
        return res.sendResponse(401, {
          message: "Unauthorized: Invalid token",
        });
      }
      const { userId, message } = req.body;
      // todo: needs to validate userId and message properly

      if (!userId || !message) {
        return res.sendResponse(400, {
          message: "Bad Request: Missing userId or message in request body",
        });
      }

      const device = await DeviceService.getByUserId(userId);
      if (!device || !device.fcmToken) {
        return res
          .status(404)
          .send({ success: false, message: "FCM token not found for user" });
      }
      const fcmToken = device.fcmToken;

      sendPushNotification(fcmToken, message);
      res.status(200).send({ success: true, message: "Notification sent" });

      return res.sendResponse(200, {
        message: "Webhook received successfully",
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.sendResponse(500, { message: "Internal Server Error" });
    }
  },
};

export default WebhookController;
