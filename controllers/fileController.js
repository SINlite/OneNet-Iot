const fileService = require('../services/fileService');
const logger = require('../utils/logger');
const { FileInfo } = require('../models/DeviceProperty');

const multer = require('multer');
const path = require('path');
// 配置 multer 存储引擎
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/usr/src/image');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

module.exports = {
  /**
   * 下载最新文件
   */
  downloadLatestFile: async (req, res) => {
    try {
      const fid = await fileService.getLatestFileFid();
      const fileInfo = await FileInfo.findOne({ fid });
      if (!fileInfo) {
        return res.status(404).json({
          success: false,
          error: '文件不存在'
        });
      }

      const fileName = `${fileInfo.name}`;
      const fileStream = await fileService.downloadDeviceFile(fid);

      // 设置响应头
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${fileName}`
      });

      // 管道传输流
      fileStream.pipe(res);
    } catch (error) {
      logger.error('下载最新文件控制器错误', {
        error: error.stack
      });

      res.status(500).json({
        success: false,
        error: '下载最新文件失败: ' + error.message
      });
    }
  },
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

      // 检查 fid 是否存在于数据库中
      const fileInfo = await FileInfo.findOne({ fid });
      if (!fileInfo) {
        return res.status(404).json({
          success: false,
          error: '文件不存在'
        });
      }

      const fileName = `${fileInfo.name}.jpg`; // 从数据库获取文件名并添加 .jpg 后缀
      const fileStream = await fileService.downloadDeviceFile(fid);

      // 设置响应头
      res.set({
        'Content-Type': 'application/octet-stream',
        'Content-Disposition': `attachment; filename=${fileName}`
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
  },
  //获取文件列表
  getFileList : async (req, res) => {
    try {
      const { limit , offset } = req.query;
      
      const result = await fileService.getFileList(
        parseInt(limit),
        parseInt(offset)
      );
  
      res.json({
        success: true,
        data: {
          files: result.files,
          pagination: {
            total: result.total,
            limit: result.limit,
            offset: result.offset
          }
        },
        requestId: result.requestId
      });
  
    } catch (error) {
      const statusCode = error.message.includes('失败') ? 400 : 500;
      res.status(statusCode).json({
        success: false,
        error: error.message,
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      });
    }
  },
   /**
     * 上传文件
     */
    uploadFile: async (req, res) => {
        try {
            upload.single('image')(req, res, async function (err) {
                if (err) {
                    logger.error('文件上传失败', { error: err.message });
                    return res.status(500).json({
                        success: false,
                        error: '文件上传失败: ' + err.message
                    });
                }

                if (!req.file) {
                    return res.status(400).json({
                        success: false,
                        error: '未提供文件'
                    });
                }

                // 可以在这里添加将文件信息保存到数据库的逻辑
                const fileInfo = {
                    name: req.file.filename,
                    path: req.file.path,
                    size: req.file.size
                };

                res.json({
                    success: true,
                    data: fileInfo,
                    message: '文件上传成功'
                });
            });
        } catch (error) {
            logger.error('文件上传控制器错误', {
                error: error.stack
            });
            res.status(500).json({
                success: false,
                error: '文件上传失败: ' + error.message
            });
        }
    },
  
};

