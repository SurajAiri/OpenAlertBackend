import sendPushNotification from "../services/fcm_notification.service.js";
import DeviceService from "../services/device.service.js";

/**
 * @param {string} userId
 * @param {string} message
 * @returns {Promise<string>}
 */
async function notificationHelper(userId, message) {
  const device = await DeviceService.getByUserId(userId);
  if (!device || !device.fcmToken) {
    return "Error: FCM token not found for user";
  }
  const fcmToken = device.fcmToken;

  await sendPushNotification(fcmToken, message);
  return "Success: Notification sent";
}

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

      const response = await notificationHelper(userId, message);
      if (response.startsWith("Error")) {
        console.error("Webhook notification error:", response);
        return res.sendResponse(500, {
          message: "Failed to send notification",
          error: response.split(": ")[1],
        });
      }
      // const device = await DeviceService.getByUserId(userId);
      // if (!device || !device.fcmToken) {
      //   return res
      //     .status(404)
      //     .send({ success: false, message: "FCM token not found for user" });
      // }
      // const fcmToken = device.fcmToken;

      // await sendPushNotification(fcmToken, message);
      //   res.status(200).send({ success: true, message: "Notification sent" });

      return res.sendResponse(200, {
        message: "Notification sent successfully",
      });
    } catch (error) {
      console.error("Webhook error:", error);
      return res.sendResponse(500, { message: "Internal Server Error" });
    }
  },

  async handleGmailInboxWebhook(req, res) {
    // console.log("Gmail Inbox Webhook hit:", req.body);
    // validate the proper user token in: `x-open-alert-token` header
    try {
      const token = req.headers["x-open-alert-token"];
      if (token === undefined || token !== process.env.WEBHOOK_TOKEN) {
        return res.sendResponse(401, {
          message: "Unauthorized: Invalid token",
        });
      }

      // todo: summarize these mails from ai (in future)
      // todo: find out the emergency level of these mails (in future)

      // send notification to user about new mails
      const mailCount = req.body.mails ? req.body.mails.length : 0;
      const payload = {
        title: "New Email Received",
        body:
          mailCount > 0
            ? `You have ${mailCount} new email(s) in your inbox.`
            : "No new emails.",
        data: { action: mailCount > 0 ? "play_alarm" : "none" },
      };
      const response = await notificationHelper(req.body.userId, payload);
      if (response.startsWith("Error")) {
        console.error("Gmail Inbox Webhook notification error:", response);
        return res.sendResponse(500, {
          message: "Failed to send notification",
          error: response.split(": ")[1],
        });
      }
      // console.log("Gmail Inbox Webhook notification result:", response);
      return res.sendResponse(200, { message: "Gmail Inbox Webhook received" });
    } catch (err) {
      console.error("Gmail Inbox Webhook error:", err);
      return res.sendResponse(500, {
        message: "Internal Server Error",
        error: err.message,
      });
    }
    // console.log("Gmail Inbox Webhook hit:", req.body);
    // return res.sendResponse(200, { message: "Gmail Inbox Webhook received" });
  },
};

export default WebhookController;
