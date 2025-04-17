// ImageController.js
const imageService = require('../services/ImageService');
const logger = require('../utils/logger');
const fs = require('fs');
const path = require('path');
module.exports = {
    // 上传文件
    // ImageController.js
uploadFile: async (req, res) => {
        try {
            if (!req.file) {
                return res.status(400).json({ error: 'No file part' });
            }
            const file = req.file;
            const tempFilePath = path.join(__dirname, '../temp', file.originalname);

            // 将文件暂存到本地
            fs.writeFileSync(tempFilePath, file.buffer);

            const result = await imageService.uploadFile(tempFilePath);

            // 删除临时文件
            fs.unlinkSync(tempFilePath);

            res.json(result);
        } catch (error) {
            logger.error('上传文件失败', { error });
            res.status(500).json({ error: error.message });
        }
    },

    // 检测图像
    detectImage: async (req, res) => {
        try {
            const result = await imageService.detectImage();
            res.json(result);
        } catch (error) {
            logger.error('检测图像失败', { error });
            res.status(500).json({ error: error.message });
        }
    },

    // 检测实时视频流
    detectLive: async (req, res) => {
        try {
            const result = await imageService.detectLive();
            res.json(result);
        } catch (error) {
            logger.error('检测实时视频流失败', { error });
            res.status(500).json({ error: error.message });
        }
    }
};
