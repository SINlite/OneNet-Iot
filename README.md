# IoT Platform API 项目结构
```markdown
  project/
  ├── config/               # 配置文件目录
  │   └── constants.js      # 系统常量配置（API密钥、数据库连接等）
  ├── controllers/          # 控制器层
  │   ├── deviceController.js # 设备相关API控制器
  │   └── fileController.js   # 文件管理API控制器
  ├── services/             # 业务逻辑层
  │   ├── deviceService.js    # 设备相关服务
  │   └── fileService.js      # 文件管理服务
  ├── models/               # 数据模型
  │   └── DeviceProperty.js   # 设备属性MongoDB模型
  ├── jobs/                 # 后台任务
  │   └── deviceSyncJob.js    # 设备数据同步定时任务
  ├── utils/                # 工具类
  │   ├── authUtil.js         # 认证工具
  │   └── logger.js           # 日志工具
  ├── routes/               # 路由配置
  │   └── apiRoutes.js        # API路由定义
  ├── logs/                 # 日志目录（自动生成）
  │   ├── error.log           # 错误日志
  │   └── combined.log        # 综合日志
  ├── .gitignore           # Git忽略配置
  ├── package.json         # 项目依赖配置
  ├── README.md           # 项目说明文档
  └── app.js              # 应用入口文件
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
POST    /api/files/delete      # 文件删除
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
