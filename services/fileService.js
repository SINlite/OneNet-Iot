const axios = require('axios');
const { generateAuthorization } = require('../utils/authUtil');
const logger = require('../utils/logger');

module.exports = {
  /**
   * 获取存储空间信息
   */
  async getAccountFileSpace() {
    const response = await axios.get('https://iot-api.heclouds.com/device/file-space', {
      headers: { Authorization: generateAuthorization() }
    });

    return {
      total: response.data.data.total_size,
      used: response.data.data.use_size,
      remaining: response.data.data.has_size
    };
  },

  /**
   * 查询设备文件数量
   */
  async getDeviceFileCount(productId, deviceName) {
    const response = await axios.get('https://iot-api.heclouds.com/device/file-device-count', {
      params: { product_id: productId, device_name: deviceName },
      headers: { Authorization: generateAuthorization() }
    });

    return {
      limit: response.data.data.upper_limit,
      count: response.data.data.files_total
    };
  }
};
