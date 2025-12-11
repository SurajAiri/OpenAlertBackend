import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fcmToken: { type: String, required: true, unique: true },
  platform: { type: String, enum: ["ios", "android"], required: true },
  createdAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true },
});

const DeviceModel = mongoose.model("Device", deviceSchema);

export default DeviceModel;
