import admin from "firebase-admin";
import fs from "fs";
import path from "path";
import "dotenv/config";
import express from "express";

const serviceAccountPath = path.resolve(
  "src/config/firebase-service-token.json"
);
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, "utf8"));

// console.log(serviceAccount);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const sendNotificationService = async (fcmToken, message) => {
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

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());

app.post("/send-notification", sendNotification);
app.get("/", (req, res) => {
  res.status(200).send({ message: "Health Check for 'Open Alert' APIs." });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
