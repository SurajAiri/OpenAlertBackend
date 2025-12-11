import admin from "../config/firebase_config.js";

const sendPushNotification = async (fcmToken, message) => {
  try {
    const payload = {
      notification: {
        title: message.title,
        body: message.body,
      },
      data: message.data || {},
      android: {
        priority: "high", // 🔥 Highest delivery priority
        notification: {
          channelId: "high_importance_channel", // Must match Flutter channel
          priority: "max", // 🔥 Highest display priority
          sound: "default",
        },
      },
      apns: {
        payload: {
          aps: {
            sound: "default",
            contentAvailable: true,
          },
        },
        headers: {
          "apns-priority": "10",
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

export default sendPushNotification;
