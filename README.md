# 全栈应用 - NestJS + React

这是一个基于 NestJS 后端和 React 前端的全栈应用，包含用户认证和数据查询功能。

## 功能特性

- 🔐 用户登录认证（JWT）
- 📊 数据查询页面（支持多条件筛选）
- 🎨 现代化响应式UI设计
- 🔄 前后端分离架构
- 🛡️ 路由保护和权限控制

## 技术栈

### 后端 (NestJS)
- NestJS 框架
- JWT 认证
- TypeScript
- Class Validator
- Passport.js

### 前端 (React)
- React 18
- TypeScript
- React Router
- Axios
- 响应式设计

## 项目结构

```
testProject/
├── backend/                 # NestJS 后端
│   ├── src/
│   │   ├── auth/           # 认证模块
│   │   ├── query/          # 查询模块
│   │   ├── app.module.ts
│   │   └── main.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/               # React 前端
│   ├── src/
│   │   ├── components/     # React 组件
│   │   ├── contexts/       # React Context
│   │   ├── services/       # API 服务
│   │   ├── App.tsx
│   │   └── index.tsx
│   ├── public/
│   ├── package.json
│   └── tsconfig.json
├── package.json            # 根项目配置
└── README.md
```

## 快速开始

### 1. 安装依赖

```bash
# 安装所有依赖（后端 + 前端）
npm run install:all
```

### 2. 启动开发服务器

```bash
# 同时启动后端和前端
npm run start:dev
```

或者分别启动：

```bash
# 启动后端 (端口: 3001)
npm run start:backend

# 启动前端 (端口: 3000)
npm run start:frontend
```

### 3. 访问应用

- 前端地址: http://localhost:3000
- 后端API: http://localhost:3001

## 测试账户

- 用户名: `admin`, 密码: `password`
- 用户名: `user`, 密码: `password`

## API 接口

### 认证接口
- `POST /auth/login` - 用户登录
- `GET /auth/profile` - 获取用户信息

### 查询接口
- `GET /query/categories` - 获取分类列表
- `GET /query/statuses` - 获取状态列表
- `GET /query/types` - 获取类型列表
- `GET /query/search` - 搜索数据

## 页面说明

### 登录页面
- 用户名和密码输入
- 表单验证
- 错误提示
- 自动跳转到查询页面

### 查询页面
- 多条件筛选（分类、状态、类型）
- 下拉框选择
- 实时查询
- 结果表格展示
- 响应式设计

## 开发说明

### 后端开发
```bash
cd backend
npm run start:dev    # 开发模式
npm run build        # 构建
npm run start:prod   # 生产模式
```

### 前端开发
```bash
cd frontend
npm start           # 开发模式
npm run build       # 构建
npm test            # 测试
```

## 部署

### 构建生产版本
```bash
npm run build:all
```

### 生产环境启动
```bash
# 后端
cd backend && npm run start:prod

# 前端 (需要配置Web服务器，如Nginx)
cd frontend && npm run build
```

## 注意事项

1. 确保 Node.js 版本 >= 16
2. 后端默认运行在 3001 端口
3. 前端默认运行在 3000 端口
4. 生产环境请修改 JWT 密钥
5. 建议使用环境变量管理配置

## 许可证

MIT License
