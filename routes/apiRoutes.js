const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const fileController = require('../controllers/fileController');

// 设备相关路由
router.get('/devices/properties', deviceController.getDeviceProperties);
router.get('/devices/history', deviceController.getDevicePropertyHistory);
router.get('/devices', deviceController.getDeviceList);

// 文件相关路由
router.get('/files/space', fileController.getAccountFileSpace);
router.get('/files/count', fileController.getDeviceFileCount);

// 健康检查
router.get('/health', (req, res) => {
  res.json({ 
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
