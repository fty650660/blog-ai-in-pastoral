# 田园中的 AI 博客

一个现代风格的个人博客，探索人工智能与生活的交融。

## 🎨 特性

- 现代编辑风格设计
- 响应式布局（支持移动端）
- 柔和白、木炭灰、柔和金配色
- 系统字体栈（无外部字体依赖）
- CSS Grid + Flexbox 布局
- 8 篇示例文章

## 📁 文件结构

```
├── index.html          # 首页
├── blog.html           # 博客列表页
├── about.html          # 关于我页面
├── article.html        # 文章详情页
├── css/
│   └── style.css       # 主样式
└── js/
    └── main.js         # 交互脚本
```

## 🚀 部署到 Cloudflare Pages

1. Fork 或克隆此仓库
2. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
3. 进入 **Workers & Pages** → **Create application** → **Pages**
4. 连接此 GitHub 仓库
5. 点击 **Deploy**

## 🌐 绑定自定义域名

1. 在 Pages 项目设置中进入 **Custom domains**
2. 添加你的域名
3. 按提示配置 DNS 记录

## 📝 本地预览

```bash
# 使用 Python
python3 -m http.server 8080

# 或使用 Node.js
npx serve
```

然后访问 http://localhost:8080

## 📄 许可证

MIT License
