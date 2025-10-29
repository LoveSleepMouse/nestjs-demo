#!/bin/bash

echo "🚀 启动全栈应用..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 请先安装 Node.js (版本 >= 16)"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 请先安装 npm"
    exit 1
fi

echo "📦 安装依赖..."
npm run install:all

if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"
echo "🌐 启动开发服务器..."
echo "📱 前端地址: http://localhost:3000"
echo "🔧 后端地址: http://localhost:3001"
echo ""
echo "测试账户:"
echo "  用户名: admin, 密码: password"
echo "  用户名: user, 密码: password"
echo ""

# 启动开发服务器
npm run start:dev
