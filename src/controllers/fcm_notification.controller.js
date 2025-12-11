import admin from "../config/firebase_config.js";

const sendNotificationService = async (fcmToken, message) => {
  try {
    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      android: {
        priority: "high",
      },
      apns: {
        headers: {
          "apns-priority": "10",
        },
        payload: {
          aps: {
            contentAvailable: true,
          },
        },
      },
      token: fcmToken,
    };

    const response = await admin.messaging().send(payload);
    console.log("Successfully sent message:", response);
  } catch (error) {
    console.error("Error sending message:", error);
  }
};

function sendNotification(req, res) {
  const { fcmToken, message } = req.body;
  try {
    sendNotificationService(fcmToken, message);
    res.status(200).send({ success: true, message: "Notification sent" });
  } catch (error) {
    res
      .status(500)
      .send({ success: false, message: "Failed to send notification" });
  }
}

export { sendNotification };
