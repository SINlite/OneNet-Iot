const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/constants');
const apiRoutes = require('./routes/apiRoutes');
const { startSyncJob, startFileListSyncJob } = require('./jobs/deviceSyncJob');
const logger = require('./utils/logger');
const app = express();

// 中间件
app.use(express.json());
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});


// 路由
app.use('/api', apiRoutes);

// 错误处理
app.use((err, req, res, next) => {
  logger.error('请求处理失败', { 
    path: req.path,
    error: err.stack 
  });
  res.status(500).json({ error: '内部服务器错误' });
});
// 启动设备同步定时任务
const syncJob = startSyncJob();
// 启动文件列表同步定时任务
const fileListSyncJob = startFileListSyncJob();
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`服务已启动，端口: ${PORT}`);
}); 
