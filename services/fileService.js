const axios = require('axios');
const { generateAuthorization } = require('../utils/authUtil');
const { PRODUCT_ID, DEVICE_NAME } = require('../config/constants');
const logger = require('../utils/logger');

module.exports = {
  /**
   * 获取存储空间信息
   */
  async getAccountFileSpace() {
    const response = await axios.get('https://iot-api.heclouds.com/device/file-space', {
      headers: { Authorization: generateAuthorization() }
    });

    return {
      total: response.data.data.total_size,
      used: response.data.data.use_size,
      remaining: response.data.data.has_size
    };
  },

  /**
   * 查询设备文件数量
   */
  async getDeviceFileCount(productId=PRODUCT_ID, deviceName=DEVICE_NAME) {
    const response = await axios.get('https://iot-api.heclouds.com/device/file-device-count', {
      params: { product_id: productId, device_name: deviceName },
      headers: { Authorization: generateAuthorization() }
    });

    return {
      limit: response.data.data.upper_limit,
      count: response.data.data.files_total
    };
  },

  /**
   * 下载设备文件
   * @param {string} fileId - 文件ID
   * @returns {Promise<Stream>} 文件流
   */
  async downloadDeviceFile(fileId) {
    if (!fileId) throw new Error('文件ID不能为空');
  
    try {
      const response = await axios.get('https://iot-api.heclouds.com/device/file-download', {
        params: { fid: fileId },
        headers: { Authorization: generateAuthorization() },
        responseType: 'stream' // 关键：指定返回流格式
      });
  
      if (response.status !== 200) {
        throw new Error(`下载失败，状态码: ${response.status}`);
      }
  
      return response.data;
    } catch (error) {
      logger.error('文件下载失败', {
        fileId,
        error: error.message
      });
      throw error;
    }
  },
  /**
   * 删除设备文件
   * @param {string} fileId - 文件ID
   * @returns {Promise<{code: number, msg: string}>} 删除结果
   */
  async deleteDeviceFile(fileId) {
    if (!fileId) throw new Error('文件ID不能为空');
  
    try {
      const response = await axios.post(
        'https://iot-api.heclouds.com/device/file-delete',
        { fid: fileId },
        {
          headers: { 
            Authorization: generateAuthorization(),
            'Content-Type': 'application/json'
          }
        }
      );
  
      if (response.data.code !== 0) {
        throw new Error(`删除失败: ${response.data.msg}`);
      }
  
      return {
        success: true,
        requestId: response.data.request_id
      };
    } catch (error) {
      logger.error('文件删除失败', {
        fileId,
        error: error.response?.data || error.message
      });
      throw error;
    }
  },
  /**
   * 获取文件列表
   * @param {number} [limit=10] - 每页数量
   * @param {number} [offset=0] - 偏移量
   * @returns {Promise<{files: Array, total: number}>} 文件列表
   */
  async getFileList(limit = 10, offset = 0) {
    try {
      const response = await axios.get('https://iot-api.heclouds.com/device/file-list', {
        params: { limit, offset },
        headers: { Authorization: generateAuthorization() }
      });
  
      if (response.data.code !== 0) {
        throw new Error(`获取失败: ${response.data.msg}`);
      }
  
      // 按文档要求只返回必要字段
      const files = response.data.data.list.map(file => ({
        fid: file.fid,
        name: file.name,
        size: file.file_size,
        createdAt: file.ct
      }));
  
      return {
        files,
        total: response.data.data.meta.total,
        limit: response.data.data.meta.limit,
        offset: response.data.data.meta.offset,
        requestId: response.data.request_id
      };
    } catch (error) {
      logger.error('获取文件列表失败', {
        params: { limit, offset },
        error: error.response?.data || error.message
      });
      throw error;
    }
  },
};

