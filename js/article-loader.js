// 文章详情页加载脚本
// 从 URL 参数获取 slug，从 GitHub API 读取文章并渲染

const GITHUB_REPO = 'fty650660/blog-ai-in-pastoral';
const GITHUB_BRANCH = 'main';
const POSTS_PATH = '_posts';

// 简单的 Markdown 转 HTML（基础版本）
function simpleMarkdownToHtml(markdown) {
  if (!markdown) return '';
  
  let html = markdown
    // 标题
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    // 粗体
    .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
    // 斜体
    .replace(/\*(.*)\*/gim, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/gim, '<a href="$2" target="_blank">$1</a>')
    // 图片
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/gim, '<img src="$2" alt="$1" style="max-width: 100%; border-radius: 8px; margin: 16px 0;">')
    // 引用
    .replace(/^> (.*$)/gim, '<blockquote>$1</blockquote>')
    // 代码块
    .replace(/```([\s\S]*?)```/gim, '<pre style="background: #2C2C2C; color: #F8F6F4; padding: 16px; border-radius: 8px; overflow-x: auto;"><code>$1</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/gim, '<code style="background: #F0EDE8; padding: 2px 6px; border-radius: 4px;">$1</code>')
    // 列表
    .replace(/^- (.*$)/gim, '<li>$1</li>')
    // 水平线
    .replace(/^---$/gim, '<hr style="border: none; border-top: 1px solid #E0DCD5; margin: 24px 0;">')
    // 段落
    .replace(/\n\n/gim, '</p><p style="margin: 16px 0; line-height: 1.8;">')
    // 换行
    .replace(/\n/gim, '<br>');
  
  return '<p style="margin: 16px 0; line-height: 1.8;">' + html + '</p>';
}

// 解析 frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return { frontmatter: {}, body: content };
  }
  
  const frontmatterStr = match[1];
  const body = match[2];
  
  const frontmatter = {};
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
      }
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body };
}

// 获取文章详情
async function fetchPostBySlug(slug) {
  try {
    // 先获取文件列表
    const filesResponse = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_PATH}?ref=${GITHUB_BRANCH}`
    );
    
    if (!filesResponse.ok) {
      throw new Error('获取文件列表失败');
    }
    
    const files = await filesResponse.json();
    const targetFile = files.find(f => f.name === `${slug}.md`);
    
    if (!targetFile) {
      throw new Error(`文章 ${slug} 不存在`);
    }
    
    // 获取文件内容
    const contentResponse = await fetch(targetFile.download_url);
    const content = await contentResponse.text();
    const { frontmatter, body } = parseFrontmatter(content);
    
    return {
      slug,
      ...frontmatter,
      body,
      cover: frontmatter.cover || 'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=1200'
    };
  } catch (error) {
    console.error('获取文章失败:', error);
    return null;
  }
}

// 渲染文章详情
async function renderArticle() {
  const container = document.querySelector('.article-container');
  
  if (!container) {
    console.error('未找到 article-container 元素');
    return;
  }
  
  // 从 URL 获取 slug
  const urlParams = new URLSearchParams(window.location.search);
  const slug = urlParams.get('slug');
  
  if (!slug) {
    container.innerHTML = `
      <div class="article-wrapper">
        <article class="article-content">
          <h1>❌ 文章未找到</h1>
          <p>请从博客列表页选择一篇文章阅读。</p>
          <a href="blog.html" style="color: #D4AF37; text-decoration: none;">← 返回博客列表</a>
        </article>
      </div>
    `;
    return;
  }
  
  container.innerHTML = `
    <div class="article-wrapper">
      <div style="text-align: center; padding: 40px;">🌾 加载文章中...</div>
    </div>
  `;
  
  const post = await fetchPostBySlug(slug);
  
  if (!post) {
    container.innerHTML = `
      <div class="article-wrapper">
        <article class="article-content">
          <h1>❌ 文章加载失败</h1>
          <p>无法从 GitHub 获取文章内容，请稍后重试。</p>
          <a href="blog.html" style="color: #D4AF37; text-decoration: none;">← 返回博客列表</a>
        </article>
      </div>
    `;
    return;
  }
  
  // 生成标签 HTML
  const tagsHtml = Array.isArray(post.tags) 
    ? post.tags.map(tag => `<span class="tag">${tag}</span>`).join('')
    : '';
  
  // 渲染文章
  container.innerHTML = `
    <div class="article-wrapper">
      <header class="article-header">
        <img src="${post.cover}" alt="${post.title}" class="article-cover" onerror="this.src='https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=1200'">
        <div class="article-meta-info">
          <span class="article-category">${post.category || '未分类'}</span>
          <h1 class="article-title">${post.title}</h1>
          <div class="article-meta">
            <span class="meta-item">📅 ${post.date || '未知日期'}</span>
            <span class="meta-item">👤 管理员</span>
          </div>
          ${tagsHtml ? `<div class="article-tags">${tagsHtml}</div>` : ''}
        </div>
      </header>
      
      <article class="article-content">
        ${simpleMarkdownToHtml(post.body)}
      </article>
      
      <div class="article-footer">
        <a href="blog.html" class="back-link">← 返回博客列表</a>
      </div>
    </div>
  `;
  
  // 更新页面标题
  document.title = `${post.title} - 田园中的 AI`;
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', renderArticle);
