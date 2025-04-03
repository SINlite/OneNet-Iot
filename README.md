# IoT Platform API 项目结构
```markdown
	project/
	├── config/
	│   └── constants.js              # 配置文件（含PREDICTION_SERVICE_URL）
	├── controllers/
	│   ├── deviceController.js       # 设备相关控制器
	│   ├── fileController.js         # 文件相关控制器
	│   ├── pestDetectionController.js# 病害识别控制器
	│   └── predictionController.js   # 产量预测控制器

	├── services/
	│   ├── deviceService.js          # 设备服务
	│   ├── fileService.js            # 文件服务
	│   ├── pestDetectionService.js   # 病害识别服务
	│   └── predictionService.js      # 产量预测服务
	├── models/
	│   └── DeviceProperty.js         # 设备属性模型
	├── jobs/
	│   └── deviceSyncJob.js          # 设备数据同步任务
	├── routes/
	│   └── apiRoutes.js              # 路由配置
	├── utils/
	│   ├── authUtil.js               # 认证工具
	│   └── logger.js                 # 日志工具
	├── docs/
	│   └── swagger.js                # API文档配置
	├── app.js                        # 主入口文件
	└── package.json                  # 项目依赖
```

## 关键文件说明

### 1. 核心业务文件
| 文件路径 | 功能描述 |
|----------|----------|
| `controllers/deviceController.js` | 处理设备相关API请求 |
| `services/deviceService.js` | 实现设备数据获取、历史记录查询等业务逻辑 |
| `jobs/deviceSyncJob.js` | 每30分钟同步设备数据到数据库的定时任务 |

### 2. API端点
```http
GET    /api/devices            # 获取设备列表
GET    /api/devices/properties # 查询设备当前属性
GET    /api/devices/history    # 查询属性历史记录
GET    /api/files/space        # 获取存储空间信息
GET    /api/files/count        # 查询设备文件数量
GET    /api/health             # 服务健康检查
GET    /api/files              # 文件列表
GET    /api/files/download     # 文件下载
POST   /api/files/delete       # 文件删除
POST   /api/predict            # 产量预测
GET    /api/ideal-values       # 特征理想值查询
POST   /api/disease_detection  # 上传照片进行病虫害识别
GET    /api/latest_detection   # 对最新的照片进行病虫害识别
```

### 3. 配置示例 (`config/constants.js`)
```javascript
module.exports = {
  // 物联网平台配置
  PRODUCT_ID: 'W4b66Qt625',
  DEVICE_NAME: 'device01',
  ACCESS_KEY: 'your-access-key',
  
  // 数据库配置
  MONGO_URI: 'mongodb://user:pass@mongo:27017/db',
  
  // 定时任务配置
  SYNC_CONFIG: {
    INTERVAL_MINUTES: 30,  // 同步间隔
    MAX_RETRIES: 3         // 失败重试次数
  }
};
```

### 4. 如何运行
```bash
# 安装依赖
npm install

# 启动开发模式（需安装nodemon）
npm run dev

# 生产环境启动
npm start

# 运行定时任务手动测试
node jobs/deviceSyncJob.js
```

## 依赖树
```
├── axios@1.6.7           # HTTP客户端
├── express@4.18.2        # Web框架
├── mongoose@8.1.3        # MongoDB ODM
├── node-cron@3.0.2       # 定时任务
└── winston@3.11.0        # 日志记录
```
