const mongoose = require('mongoose');
const { MONGO_URI } = require('../config/constants');

// 连接 MongoDB
mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const devicePropertySchema = new mongoose.Schema({
  identifier: String,
  value: mongoose.Mixed,
  timestamp: Date
});

module.exports = mongoose.model('DeviceProperty', devicePropertySchema);
