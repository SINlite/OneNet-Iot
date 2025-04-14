const deviceService = require('../services/deviceService');
const logger = require('../utils/logger');

module.exports = {
  /**
   * 获取设备属性
   */
  getDeviceProperties: async (req, res) => {
    try {
      const { product_id, device_name } = req.query;
      console.log('control Received product_id:', product_id);
      console.log('control Received device_name:', device_name);
      const data = await deviceService.getDevicePropertiesFromDB(product_id, device_name);
      res.json({ success: true, data });
    } catch (error) {
      logger.error('获取设备属性失败', { error });
      res.status(500).json({ 
        success: false,
        error: error.message 
      });
    }
  },

  /**
   * 查询设备属性历史
   */
  getDevicePropertyHistory: async (req, res) => {
    try {
      const params = req.query;
      const data = await deviceService.getDevicePropertyHistory(params);
      res.json({ success: true, data });
    } catch (error) {
      logger.error('查询历史记录失败', { 
        params: req.query,
        error 
      });
      res.status(400).json({
        success: false,
        error: '参数错误: ' + error.message
      });
    }
  },

  /**
   * 获取设备列表
   */
  getDeviceList: async (req, res) => {
    try {
      const { product_id, offset = 0, limit = 10 } = req.query;
      const data = await deviceService.getDeviceList(product_id, offset, limit);
      res.json({ success: true, data });
    } catch (error) {
      logger.error('获取设备列表失败', { 
        product_id: req.query.product_id,
        error 
      });
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  }
};
