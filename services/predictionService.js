const axios = require('axios');
const logger = require('../utils/logger');
const { PREDICTION_SERVICE_URL } = require('../config/constants');

class PredictionService {
  /**
   * 获取产量预测
   * @param {object} params - 预测参数
   * @returns {Promise<{prediction: object, status: number}>} 预测结果
   */
  async predictYield(params) {
    try {
      const response = await axios.post(`${PREDICTION_SERVICE_URL}/predict`, params, {
        timeout: 5000 // 5秒超时
      });

      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      logger.error('预测服务调用失败', {
        params,
        error: error.response?.data || error.message
      });
      
      return {
        success: false,
        error: error.response?.data?.error || 'Prediction service unavailable',
        status: error.response?.status || 500
      };
    }
  }

  /**
   * 获取理想值范围
   */
  async getIdealValues() {
    try {
      const response = await axios.get(`${PREDICTION_SERVICE_URL}/ideal_values`, {
        timeout: 3000
      });
      
      return {
        success: true,
        data: response.data,
        status: response.status
      };
    } catch (error) {
      logger.error('获取理想值失败', {
        error: error.response?.data || error.message
      });
      
      return {
        success: false,
        error: 'Failed to fetch ideal values',
        status: error.response?.status || 500
      };
    }
  }
}

module.exports = new PredictionService();
