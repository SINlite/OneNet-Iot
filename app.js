const express = require('express');
const mongoose = require('mongoose');
const { MONGO_URI } = require('./config/constants');
const apiRoutes = require('./routes/apiRoutes');
const { startSyncJob } = require('./jobs/deviceSyncJob');
const logger = require('./utils/logger');

const app = express();

// 中间件
app.use(express.json());
app.use((req, res, next) => {
  logger.http(`${req.method} ${req.path}`);
  next();
});

// 数据库连接
mongoose.connect(MONGO_URI)
  .then(() => {
    logger.info('MongoDB连接成功');
    startSyncJob(); // 启动定时任务
  })
  .catch(err => logger.error('MongoDB连接失败', { error: err }));

// 路由
app.use('/api', apiRoutes);

// 错误处理
app.use((err, req, res, next) => {
  logger.error('系统错误', { 
    path: req.path,
    error: err.stack 
  });
  res.status(500).json({ 
    success: false,
    error: '系统异常' 
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`服务已启动，端口: ${PORT}`);
}); 
