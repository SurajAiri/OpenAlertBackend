import sendPushNotification from "../services/fcm_notification.service.js";
import DeviceService from "../services/device.service.js";
async function sendNotification(req, res) {
  const message = req.body;

  try {
    const { id: userId } = req.user;
    const device = await DeviceService.getByUserId(userId);
    if (!device || !device.fcmToken) {
      return res
        .status(404)
        .send({ success: false, message: "FCM token not found for user" });
    }
    const fcmToken = device.fcmToken;

    sendPushNotification(fcmToken, message);
    res.status(200).send({ success: true, message: "Notification sent" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to send notification" });
  }
}

export { sendNotification };
