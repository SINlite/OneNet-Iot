const axios = require('axios');
const { generateAuthorization } = require('../utils/authUtil');
const { PRODUCT_ID, DEVICE_NAME } = require('../config/constants');
const DeviceProperty = require('../models/DeviceProperty');
const logger = require('../utils/logger');

module.exports = {
  /**
   * 获取设备当前属性
   */
  async getDeviceProperties(productId = PRODUCT_ID, deviceName = DEVICE_NAME) {
    const authHeader = generateAuthorization();
    const response = await axios.get('https://iot-api.heclouds.com/thingmodel/query-device-property', {
      params: { product_id: productId, device_name: deviceName },
      headers: { Authorization: authHeader }
    });

    if (response.data.code !== 0) {
      throw new Error(response.data.msg);
    }

    return response.data.data.map(item => ({
      identifier: item.identifier,
      value: item.value,
      timestamp: new Date(item.time)
    }));
  },

  /**
   * 查询属性历史记录
   */
  async getDevicePropertyHistory({
    product_id = PRODUCT_ID,
    device_name = DEVICE_NAME,
    identifier,
    start_time = Date.now() - 7 * 86400000,
    end_time = Date.now(),
    sort = '2',
    offset = '0',
    limit = '10'
  }) {
    if (!identifier) throw new Error('缺少identifier参数');

    const response = await axios.get('https://iot-api.heclouds.com/thingmodel/query-device-property-history', {
      params: { product_id, device_name, identifier, start_time, end_time, sort, offset, limit },
      headers: { Authorization: generateAuthorization() }
    });

    return {
      total: response.data.data.total,
      list: response.data.data.list.map(item => ({
        value: item.value,
        time: new Date(item.time)
      }))
    };
  },

  /**
   * 获取设备列表
   */
  async getDeviceList(productId = PRODUCT_ID, offset = 0, limit = 10) {
    const response = await axios.get('https://iot-api.heclouds.com/device/list', {
      params: { product_id: productId, offset, limit },
      headers: { Authorization: generateAuthorization() }
    });

    if (!response.data.data ||!response.data.data.list) {
      logger.error('获取设备列表失败，返回数据中没有 list 字段', { response: response.data });
      return [];
    }

    return response.data.data.list.map(device => ({
      name: device.name,
      status: device.status,
      lastActive: device.last_time
    }));
  },

  /**
   * 内部同步方法
   */
  async syncDeviceProperties() {
    try {
      const properties = await this.getDeviceProperties();
      await DeviceProperty.insertMany(properties);
      logger.info(`同步成功: ${properties.length}条记录`);
    } catch (error) {
      logger.error('同步失败', { error });
      throw error;
    }
  }
};
