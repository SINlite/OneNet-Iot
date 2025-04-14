# 使用官方 Node.js 镜像作为基础镜像
FROM node:18-alpine

# 创建工作目录
WORKDIR /usr/src/app

# 复制 package.json 和 package-lock.json (如果有)
COPY package*.json ./

RUN npm config set registry http://mirrors.cloud.tencent.com/npm/

# 安装依赖
RUN npm install \
    axios@1.8.4 \
    express@4.21.2 \
    mongoose@8.13.1 \
    mqtt@5.10.4 \
    node-cron@3.0.3 \
    node-schedule@2.1.1 \
    winston@3.17.0 \
    multer
# 复制应用程序源代码
COPY . .

# 暴露应用程序端口 (假设使用 3000 端口)
EXPOSE 3000

# 定义启动命令
CMD ["node", "app.js"]
