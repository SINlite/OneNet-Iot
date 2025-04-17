// ImageService.js
const axios = require('axios');
const logger = require('../utils/logger');
const fs = require('fs');
const FormData = require('form-data');

const IMAGE_API_URL = 'http://yolov8-gpu:7000';

// 上传文件
async function uploadFile(filePath) {
    try {
        const formData = new FormData();
        const fileStream = fs.createReadStream(filePath);
        formData.append('file', fileStream);

        const response = await axios.post(`${IMAGE_API_URL}/upload`, formData, {
            headers: {
                ...formData.getHeaders()
            }
        });

        return response.data;
    } catch (error) {
        logger.error('上传文件失败', { error });
        throw error;
    }
}

// 检测图像
async function detectImage() {
    try {
        const response = await axios.get(`${IMAGE_API_URL}/detect`);
        return response.data;
    } catch (error) {
        logger.error('检测图像失败', { error });
        throw error;
    }
}

// 检测实时视频流
async function detectLive() {
    try {
        const response = await axios.get(`${IMAGE_API_URL}/detect_live`);
        return response.data;
    } catch (error) {
        logger.error('检测实时视频流失败', { error });
        throw error;
    }
}

module.exports = {
    uploadFile,
    detectImage,
    detectLive
};
