const fileService = require('../services/fileService');
const logger = require('../utils/logger');

module.exports = {
  /**
   * 获取存储空间信息
   */
  getAccountFileSpace: async (req, res) => {
    try {
      const data = await fileService.getAccountFileSpace();
      res.json({ success: true, data });
    } catch (error) {
      logger.error('获取存储空间失败', { error });
      res.status(500).json({
        success: false,
        error: '服务不可用'
      });
    }
  },

  /**
   * 查询设备文件数量
   */
  getDeviceFileCount: async (req, res) => {
    try {
      const { product_id, device_name } = req.query;
      const data = await fileService.getDeviceFileCount(product_id, device_name);
      res.json({ success: true, data });
    } catch (error) {
      logger.error('查询文件数量失败', {
        params: req.query,
        error
      });
      res.status(400).json({
        success: false,
        error: error.message
      });
    }
  },
  /**
   * 下载设备文件
   */
  downloadFile : async (req, res) => {
    try {
      const { fid } = req.query;
      if (!fid) {
        return res.status(400).json({
          success: false,
          error: '缺少必要参数: fid'
        });
      }
  
      const fileStream = await fileService.downloadDeviceFile(fid);
  
      // 设置响应头
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${fid}.bin` // 可根据实际需求调整文件名
      });
  
      // 管道传输流
      fileStream.pipe(res);
  
    } catch (error) {
      logger.error('文件下载控制器错误', {
        params: req.query,
        error: error.stack
      });
  
      res.status(500).json({
        success: false,
        error: '文件下载失败: ' + error.message
      });
    }
  },
  	/**
   * 删除设备文件
   */
  deleteFile : async (req, res) => {
    try {
      const { fid } = req.body;
  
      if (!fid) {
        return res.status(400).json({
          success: false,
          error: '缺少必要参数: fid'
        });
      }
  
      const result = await fileService.deleteDeviceFile(fid);
  
      res.json({
        success: true,
        requestId: result.requestId,
        message: '文件删除成功'
      });
  
    } catch (error) {
      logger.error('文件删除控制器错误', {
        body: req.body,
        error: error.stack
      });
  
      const statusCode = error.message.includes('失败') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        requestId: error.response?.data?.request_id
      });
    }
  }
};

