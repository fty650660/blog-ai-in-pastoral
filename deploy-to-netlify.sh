#!/bin/bash

# Netlify 自动化部署脚本
# 用于快速部署 Decap CMS 博客到 Netlify

set -e

echo "🚀 开始 Netlify 自动化部署..."
echo ""

# 检查是否已安装 Netlify CLI
if ! command -v netlify &> /dev/null; then
    echo "❌ Netlify CLI 未安装，正在安装..."
    npm install -g netlify-cli
fi

# 检查是否已登录
echo "📝 检查 Netlify 登录状态..."
if ! netlify api --endpoint /v1/user 2>&1 | grep -q "id"; then
    echo "🔐 需要登录 Netlify..."
    echo "   即将打开浏览器，请使用 GitHub 账号登录"
    echo ""
    netlify login
fi

echo "✅ 登录成功！"
echo ""

# 创建或链接站点
echo "🏗️  检查/创建 Netlify 站点..."
SITE_ID=$(netlify status --json 2>/dev/null | grep -o '"id": "[^"]*"' | head -1 | cut -d'"' -f4)

if [ -z "$SITE_ID" ]; then
    echo "   创建新站点..."
    netlify init --manual
else
    echo "   已链接到现有站点：$SITE_ID"
fi

echo ""
echo "📦 部署站点..."
netlify deploy --prod --dir=.

echo ""
echo "✨ 部署完成！"
echo ""
echo "📋 接下来请手动完成以下配置（在 Netlify 仪表板）："
echo ""
echo "1️⃣  启用 Identity："
echo "   - 访问：https://app.netlify.com/sites/[你的站点]/identity"
echo "   - 点击 'Enable Identity'"
echo "   - 设置 Registration preferences 为 'Invite only' 或 'Open'"
echo ""
echo "2️⃣  启用 Git Gateway："
echo "   - 访问：https://app.netlify.com/sites/[你的站点]/settings/identity#services"
echo "   - 点击 'Enable Git Gateway'"
echo "   - 授权 Netlify 访问 GitHub"
echo ""
echo "3️⃣  更新 GitHub OAuth 回调 URL："
echo "   - 访问：https://github.com/settings/developers"
echo "   - 编辑你的 OAuth App '田园中的 AI 博客'"
echo "   - 设置 Authorization callback URL 为："
echo "     https://[你的站点].netlify.app/admin/"
echo ""
echo "4️⃣  创建管理员账号："
echo "   - 访问：https://[你的站点].netlify.app/admin/"
echo "   - 点击 'Login with Netlify Identity'"
echo "   - 注册第一个账号（自动成为管理员）"
echo ""
echo "🎉 完成！"
