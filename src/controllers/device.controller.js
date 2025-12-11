import DeviceService from "../services/device.service.js";

const DeviceController = {
  async addUpdateDevice(req, res) {
    const { fcmToken, platform } = req.body;
    const { id: userId } = req.user;

    try {
      let device = await DeviceService.getByUserId(userId);
      if (device) {
        // Update existing device
        device = await DeviceService.updateByUserId(userId, {
          fcmToken,
          platform,
        });
        return res.sendResponse(200, device, "Device updated successfully");
      } else {
        // Create new device
        device = await DeviceService.create({
          userId,
          fcmToken,
          platform,
        });
        return res.sendResponse(200, device, "Device created successfully");
      }
    } catch (error) {
      console.error("Device add/update error:", error);
      return res.sendResponse(500, "Failed to add/update device", error);
    }
  },
};

export default DeviceController;
