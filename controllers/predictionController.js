const predictionService = require('../services/predictionService');
const logger = require('../utils/logger');

module.exports = {
  /**
   * 产量预测
   */
  predictYield: async (req, res) => {
    try {
      // 调用预测服务
      const { success, data, error, status } = await predictionService.predictYield(req.body);
      
      if (!success) {
        return res.status(status || 500).json({
          success: false,
          error
        });
      }

      res.json({
        success: true,
        data
      });

    } catch (error) {
      logger.error('预测控制器错误', {
        body: req.body,
        error: error.stack
      });
      
      res.status(500).json({
        success: false,
        error: 'Internal server error'
      });
    }
  },

  /**
   * 获取理想值范围
   */
  getIdealValues: async (req, res) => {
    try {
      const { success, data, error, status } = await predictionService.getIdealValues();
      
      if (!success) {
        return res.status(status || 500).json({
          success: false,
          error
        });
      }

      res.json({
        success: true,
        data
      });

    } catch (error) {
      logger.error('获取理想值控制器错误', {
        error: error.stack
      });
      
      res.status(500).json({
        success: false,
        error: 'Failed to process ideal values'
      });
    }
  }
};
