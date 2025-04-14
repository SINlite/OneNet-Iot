const { syncDeviceProperties } = require('../services/deviceService');
const { PRODUCT_ID, DEVICE_NAME, SYNC_CONFIG } = require('../config/constants');
const cron = require('node-cron');
const logger = require('../utils/logger');

let lastSyncStatus = {
  lastSuccess: null,
  lastError: null
};

function startSyncJob() {
  // 使用配置中的间隔时间
  const cronExpression = `*/${SYNC_CONFIG.INTERVAL_MINUTES} * * * *`;
  
  return cron.schedule(cronExpression, async () => {
    logger.info('开始设备属性同步任务', { context: 'SYNC_JOB' });
    
    try {
      await syncDeviceProperties();
      
      lastSyncStatus = {
        lastSuccess: new Date(),
        lastError: null
      };
      
      logger.info('同步成功', { context: 'SYNC_JOB' });
      
    } catch (error) {
      lastSyncStatus = {
        ...lastSyncStatus,
        lastError: {
          time: new Date(),
          message: error.message
        }
      };
      
      logger.error(`同步失败: ${error.message}`, {
        context: 'SYNC_JOB',
        stack: error.stack
      });
    }
  });
}

module.exports = { 
  startSyncJob,
  lastSyncStatus 
};