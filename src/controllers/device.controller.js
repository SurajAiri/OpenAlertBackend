import DeviceService from "../services/device.service.js";

const DeviceController = {
  async addUpdateDevice(req, res) {
    const { fcmToken, platform } = req.body;
    const { id: userId } = req.user;

    try {
      let device = await DeviceService.getByUserId(userId);
      // if same device fcmToken exists, just return
      if (device && device.fcmToken === fcmToken) {
        return res.sendResponse(200, device, "Device already registered");
      }
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

  async getUserDevices(req, res) {
    const { id: userId } = req.user;
    // console.log("Fetching devices for userId:", userId);

    try {
      const devices = await DeviceService.getAllByUserId(userId);
      // console.log("Retrieved devices:", devices);
      if (!devices || devices.length === 0) {
        return res.sendResponse(404, "No devices found for user");
      }
      return res.sendResponse(
        200,
        devices,
        "User devices retrieved successfully"
      );
    } catch (error) {
      console.error("Get user devices error:", error);
      return res.sendResponse(500, "Failed to retrieve user devices", error);
    }
  },
};

export default DeviceController;
