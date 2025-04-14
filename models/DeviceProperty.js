// models/DeviceProperty.js
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/constants');
const logger = require('../utils/logger');
// 连接 MongoDB
mongoose.connect(MONGO_URI)
  .then(() => logger.info('MongoDB连接成功'))
  .catch(err => logger.error('MongoDB连接失败', { error: err.message }));

// 设备属性历史表的 Schema
const devicePropertyHistorySchema = new mongoose.Schema({
  product_id: String,
  device_name: String,
  identifier: String,
  value: mongoose.Mixed,
  timestamp: Date
});

// 设备当前属性表的 Schema
const deviceCurrentPropertySchema = new mongoose.Schema({
  product_id: String,
  device_name: String,
  identifier: String,
  value: mongoose.Mixed,
  timestamp: Date
});
// 文件信息表的 Schema
const fileInfoSchema = new mongoose.Schema({
  fid: { type: String, unique: true },
  name: String,
  size: Number,
  createdAt: Date
});

// 导出模型
const DevicePropertyHistory = mongoose.model('DevicePropertyHistory', devicePropertyHistorySchema);
const DeviceCurrentProperty = mongoose.model('DeviceCurrentProperty', deviceCurrentPropertySchema);
const FileInfo = mongoose.model('FileInfo', fileInfoSchema);
module.exports = {
  DevicePropertyHistory,
  DeviceCurrentProperty,
  FileInfo
};