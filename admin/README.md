# 🌾 博客管理系统配置指南

## 快速开始

### 步骤 1：配置 GitHub OAuth（必需！）

Decap CMS 需要 GitHub OAuth 来进行登录认证。

1. 打开 [GitHub Developer Settings](https://github.com/settings/developers)
2. 点击 **OAuth Apps** → **New OAuth App**
3. 填写信息：
   - **Application name**: `田园中的 AI 博客`
   - **Homepage URL**: `https://blog-ai-in-pastoral.fty650660.pages.dev`
   - **Authorization callback URL**: `https://blog-ai-in-pastoral.fty650660.pages.dev/admin/`
4. 点击 **Register application**
5. 复制 **Client ID**（一串字符）
6. 点击 **Generate a new client secret**，复制 **Client Secret**

### 步骤 2：在 Cloudflare Pages 设置环境变量

1. 登录 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 进入 **Workers & Pages** → 选择 `blog-ai-in-pastoral`
3. 点击 **Settings** → **Environment variables**
4. 添加以下变量：

| Variable name | Value |
|--------------|-------|
| `REPO_NAME` | `fty650660/blog-ai-in-pastoral` |
| `BASE_URL` | `https://blog-ai-in-pastoral.fty650660.pages.dev` |

5. 点击 **Save**

### 步骤 3：更新 config.yml

编辑 `admin/config.yml`，确保：
```yaml
backend:
  name: github
  repo: fty650660/blog-ai-in-pastoral  # 你的 GitHub 用户名/仓库名
  branch: main
```

### 步骤 4：推送代码到 GitHub

```bash
cd blog-ai-in-pastoral
git add .
git commit -m "feat: 添加 Decap CMS 博客管理系统"
git push origin main
```

### 步骤 5：等待部署完成

Cloudflare Pages 会自动部署，约 1-2 分钟。

### 步骤 6：访问管理后台

打开：`https://blog-ai-in-pastoral.fty650660.pages.dev/admin/`

首次访问会跳转到 GitHub 授权页面，授权后即可登录。

---

## 管理功能

### 📝 创建新文章

1. 登录后点击 **新建博客文章**
2. 填写标题、分类、标签
3. 使用 Markdown 编辑器撰写内容
4. 可上传图片作为封面
5. 点击 **发布**

### ✏️ 编辑文章

1. 在文章列表中选择要编辑的文章
2. 修改内容
3. 点击 **发布** 保存更改

### 🗑️ 删除文章

1. 在文章列表中选择要删除的文章
2. 点击底部的 **删除**
3. 确认删除

---

## 常见问题

### Q: 登录后显示 404？
A: 检查 `admin/config.yml` 中的 `repo` 和 `branch` 是否正确。

### Q: 无法上传图片？
A: 确保 GitHub OAuth 有 `public_repo` 权限。

### Q: 文章发布后网站没有更新？
A: Cloudflare Pages 需要 1-2 分钟重新部署，等待完成后刷新。

---

## 文件结构

```
blog-ai-in-pastoral/
├── admin/
│   ├── index.html      # CMS 入口页面
│   ├── config.yml      # CMS 配置文件
│   └── README.md       # 本文件
├── _posts/             # 博客文章（Markdown 格式）
│   └── YYYY-MM-DD-slug.md
├── _pages/             # 静态页面
├── assets/images/posts/ # 上传的图片
├── index.html          # 首页
├── blog.html           # 博客列表页
└── ...
```

---

## 下一步优化

- [ ] 更新博客列表页，自动读取 `_posts/` 目录的文章
- [ ] 添加文章详情页模板
- [ ] 添加搜索功能
- [ ] 添加草稿功能
