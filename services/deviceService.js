const axios = require('axios');
const { generateAuthorization } = require('../utils/authUtil');
const { PRODUCT_ID, DEVICE_NAME } = require('../config/constants');
const { DeviceCurrentProperty, DevicePropertyHistory } = require('../models/DeviceProperty'); 
const logger = require('../utils/logger');

// 单独定义方法
async function getDeviceProperties(productId = PRODUCT_ID, deviceName = DEVICE_NAME) {
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
}

async function getDevicePropertyHistory({
  product_id = PRODUCT_ID,
  device_name = DEVICE_NAME,
  identifier,
  start_time = Date.now() - 7 * 86400000,
  end_time = Date.now(),
  sort = '2',
  offset = '0',
  limit = '30'
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
}

// 同步方法
async function syncDeviceProperties() {
  try {
    // 获取设备当前属性
    const properties = await getDeviceProperties(productId = PRODUCT_ID, deviceName = DEVICE_NAME);

    // 更新设备当前属性表
    await DeviceCurrentProperty.deleteMany({}); // 清空当前属性表
    await DeviceCurrentProperty.insertMany(properties.map(property => ({
      ...property,
      product_id: PRODUCT_ID,
      device_name: DEVICE_NAME
    })));

    // 查询各个属性的历史记录并插入到历史表中
    for (const property of properties) {
      const history = await getDevicePropertyHistory({
        product_id: PRODUCT_ID,
        device_name: DEVICE_NAME,
        identifier: property.identifier
      });

      const historyRecords = history.list.map(item => ({
        identifier: property.identifier,
        value: item.value,
        timestamp: item.time,
        product_id: PRODUCT_ID,
        device_name: DEVICE_NAME
      }));

      for (const record of historyRecords) {
        const existingRecord = await DevicePropertyHistory.findOne({
          identifier: record.identifier,
          timestamp: record.timestamp
        });

        if (!existingRecord) {
          await DevicePropertyHistory.create(record);
        }
      }
    }
    logger.info(`同步成功: ${properties.length} 条记录`);
  } catch (error) {
    logger.error('同步失败', { error });
    throw error;
  }
}

// 从数据库中查询设备属性
async function getDevicePropertiesFromDB(product_id, device_name) {
  try {
    const properties = await DeviceCurrentProperty.find({ product_id, device_name });
    console.log('service Received product_id:', product_id);
    console.log('service Received device_name:', device_name);
    console.log('service Received device_name:', properties);
    return properties.map(property => ({
      identifier: property.identifier,
      value: property.value,
      timestamp: property.timestamp
    }));
  } catch (error) {
    logger.error('从数据库获取设备属性失败', { error });
    throw error;
  }
}

module.exports = { 
  getDeviceProperties,
  getDevicePropertyHistory,
  syncDeviceProperties,
  getDevicePropertiesFromDB
};
