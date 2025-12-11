import express from "express";
import DeviceController from "../controllers/device.controller.js";
const router = express.Router();

router.get("/", DeviceController.getUserDevices);

router.post("/", DeviceController.addUpdateDevice);

export default router;
