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
  }
};
