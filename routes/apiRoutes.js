const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');
const fileController = require('../controllers/fileController');
const predictionController = require('../controllers/predictionController');

const imageController = require('../controllers/ImageController');
const multer = require('multer');
const upload = multer();

// 图像识别相关路由
router.post('/image/upload', upload.single('file'), imageController.uploadFile);
router.get('/image/detect', imageController.detectImage);
router.get('/image/detect_live', imageController.detectLive);

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
router.post('/files/upload', fileController.uploadFile); // 新增文件上传路由
router.get('/files/download/latest', fileController.downloadLatestFile); // 新增下载最新文件路由

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
