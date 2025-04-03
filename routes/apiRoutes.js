const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const fileController = require('../controllers/fileController');
const predictionController = require('../controllers/predictionController');

// 设备相关路由
router.get('/devices/properties', deviceController.getDeviceProperties);
router.get('/devices/history', deviceController.getDevicePropertyHistory);
router.get('/devices', deviceController.getDeviceList);

// 文件相关路由
router.get('/files/space', fileController.getAccountFileSpace);
router.get('/files/count', fileController.getDeviceFileCount);
router.get('/files/download', fileController.downloadFile);
router.get('/files', fileController.getFileList); // 新增文件列表路由
router.post('/files/delete', fileController.deleteFile); // 新增删除路由

// 预测相关路由
router.post('/predict', predictionController.predictYield);
router.get('/ideal-values', predictionController.getIdealValues);

// 健康检查
router.get('/health', (req, res) => {
  res.json({ 
    status: 'UP',
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
