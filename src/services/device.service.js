import DeviceModel from "../models/device.model.js";

const DeviceService = {
  async create(deviceData) {
    return await DeviceModel.create(deviceData);
  },

  async updateById(id, updateData) {
    return await DeviceModel.findByIdAndUpdate(id, updateData, { new: true });
  },

  async deleteById(id) {
    return await DeviceModel.findByIdAndDelete(id);
  },

  async getById(id) {
    return await DeviceModel.findById(id);
  },

  async updateByUserId(userId, updateData) {
    return await DeviceModel.findOneAndUpdate({ userId }, updateData, {
      new: true,
    });
  },
  async getByUserId(userId) {
    return await DeviceModel.findOne({ userId });
  },

  async getAllByUserId(userId) {
    return await DeviceModel.find({ userId });
  },

  //   async getAll(offset = 0, limit = 10, userId) {
  //     const query = userId ? { userId } : {};
  //     return await DeviceModel.find(query).skip(offset).limit(limit);
  //   },

  //   async count(userId) {
  //     const query = userId ? { userId } : {};
  //     return await DeviceModel.countDocuments(query);
  //   },

  //   async getByDeviceToken(deviceToken) {
  //     return await DeviceModel.findOne({ deviceToken });
  //   },
};

export default DeviceService;
