# 实时竞拍大师 - 抖音电商直播竞拍全栈系统

## 🎯 项目简介
抖音电商直播竞拍全栈系统，支持高并发实时出价场景，100+ 用户同时在线价格完全同步。
技术栈：React 18 + TypeScript 5 + NestJS 10 + MySQL 8.0 + Redis 7.0 + Socket.io 4

## ✨ 核心功能
1. 用户注册与登录
2. 商品全生命周期管理
3. 高并发出价引擎（Redis分布式锁 + Lua原子脚本）
4. 实时同步直播竞拍（Socket.io房间级隔离）
5. 自动延时机制
6. 订单流转系统

## 🚀 快速启动

### 依赖环境
- Node.js 20+
- MySQL 8.0+
- Redis 7.0+
- Docker（推荐用于快速启动数据库）

### 启动数据库
```bash
docker run -d --name tiktok-mysql -p 3306:3306 \
  -e MYSQL_ROOT_PASSWORD=123456 \
  -e MYSQL_DATABASE=tiktok_auction \
  mysql:8.0

docker run -d --name tiktok-redis -p 6379:6379 redis:7.2
```

### 启动后端
```bash
cd backend
npm install
cp .env.example .env
# 配置数据库连接
npm run prisma:generate
npm run prisma:migrate:dev --name init
npx ts-node src/scripts/init-data.ts
npm run start:dev
```

### 启动商家端
```bash
cd frontend/merchant-admin
npm install
npm run dev
```

### 启动用户端H5
```bash
cd frontend/user-h5
npm install
npm run dev
```

## 👤 体验账号
- 商家端：test_merchant / 123456
- 用户端：test_user / 123456
- 支持自由注册新账号

## 📚 完整文档
- 技术方案设计：docs/直播竞拍系统技术方案设计.md
- 线上部署指南：docs/线上部署指南.md
- 前后端联调指南：docs/前后端联调指南.md
- 项目成果报告：docs/项目成果报告.md
