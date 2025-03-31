// models/DeviceProperty.js
//
const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/constants');
const logger = require('../utils/logger');
// 连接 MongoDB
mongoose.connect(MONGO_URI)
  .then(() => logger.info('MongoDB连接成功'))
  .catch(err => logger.error('MongoDB连接失败', { error: err.message }));

const devicePropertySchema = new mongoose.Schema({
  identifier: String,
  value: mongoose.Mixed,
  timestamp: Date
});

module.exports = mongoose.model('DeviceProperty', devicePropertySchema);
