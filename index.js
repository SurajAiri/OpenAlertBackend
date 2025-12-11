import "dotenv/config";
import express from "express";
import responseFormatter from "./src/middlewares/response.middlewares.js";
import { sendNotification } from "./src/controllers/fcm_notification.controller.js";

const app = express();
const PORT = process.env.PORT || 3000;

// middlewares
app.use(express.json());
app.use(responseFormatter);

app.get("/", (req, res) => {
  res.sendResponse(200, { message: "Health Check for 'Open Alert' APIs." });
});

app.post("/send-notification", sendNotification);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
