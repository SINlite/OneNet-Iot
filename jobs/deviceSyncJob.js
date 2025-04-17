const { syncDeviceProperties } = require('../services/deviceService');
const { PRODUCT_ID, DEVICE_NAME, FILE_LIST_SYNC_INTERVAL_MINUTES, DEVICE_SYNC_INTERVAL_MINUTES } = require('../config/constants');
const cron = require('node-cron');
const logger = require('../utils/logger');
const fileService = require('../services/fileService');
const { FileInfo } = require('../models/DeviceProperty');

let lastSyncStatus = {
  lastSuccess: null,
  lastError: null
};

function startSyncJob() {
  // 使用配置中的间隔时间
  const cronExpression = `*/${DEVICE_SYNC_INTERVAL_MINUTES} * * * *`;
  
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
// 新增定时获取文件列表并保存到数据库的任务
function startFileListSyncJob() {
  const cronExpression = `*/${FILE_LIST_SYNC_INTERVAL_MINUTES} * * * *`;
  
  return cron.schedule(cronExpression, async () => {
    logger.info('开始文件列表同步任务', { context: 'FILE_LIST_SYNC_JOB' });
    
    try {
      const fileList = await fileService.getFileList();
      
      for (const file of fileList.files) {
        const existingFile = await FileInfo.findOne({ fid: file.fid });
        
        if (!existingFile) {
          const newFile = new FileInfo({
            fid: file.fid,
            name: file.name,
            size: file.size,
            createdAt: new Date(file.createdAt)
          });
          
          await newFile.save();
        } else {
        }
      }
      lastSyncStatus = {
        ...lastSyncStatus,
        lastSuccess: new Date(),
        lastError: null
      };
      logger.info('文件列表同步成功', { context: 'FILE_LIST_SYNC_JOB' });
      
    } catch (error) {
      lastSyncStatus = {
        ...lastSyncStatus,
        lastError: {
          time: new Date(),
          message: error.message
        }
      };
      
      logger.error(`文件列表同步失败: ${error.message}`, {
        context: 'FILE_LIST_SYNC_JOB',
        stack: error.stack
      });
    }
  });
}

module.exports = { 
  startSyncJob,
  lastSyncStatus,
  startFileListSyncJob,
};
