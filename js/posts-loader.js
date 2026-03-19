// 博客文章数据加载脚本
// 从 GitHub API 读取 _posts 目录中的 Markdown 文件

const GITHUB_REPO = 'fty650660/blog-ai-in-pastoral';
const GITHUB_BRANCH = 'main';
const POSTS_PATH = '_posts';

// 解析 Markdown 文件的 frontmatter
function parseFrontmatter(content) {
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/;
  const match = content.match(frontmatterRegex);
  
  if (!match) {
    return {
      frontmatter: {},
      body: content
    };
  }
  
  const frontmatterStr = match[1];
  const body = match[2];
  
  const frontmatter = {};
  frontmatterStr.split('\n').forEach(line => {
    const colonIndex = line.indexOf(':');
    if (colonIndex > 0) {
      const key = line.slice(0, colonIndex).trim();
      let value = line.slice(colonIndex + 1).trim();
      // 处理引号
      if ((value.startsWith('"') && value.endsWith('"')) || 
          (value.startsWith("'") && value.endsWith("'"))) {
        value = value.slice(1, -1);
      }
      // 处理数组
      if (value.startsWith('[') && value.endsWith(']')) {
        value = value.slice(1, -1).split(',').map(v => v.trim().replace(/['"]/g, ''));
      }
      frontmatter[key] = value;
    }
  });
  
  return { frontmatter, body };
}

// 从 GitHub API 获取文件列表
async function fetchPostsFromGitHub() {
  try {
    const response = await fetch(
      `https://api.github.com/repos/${GITHUB_REPO}/contents/${POSTS_PATH}?ref=${GITHUB_BRANCH}`
    );
    
    if (!response.ok) {
      throw new Error(`GitHub API 错误：${response.status}`);
    }
    
    const files = await response.json();
    const mdFiles = files.filter(f => f.name.endsWith('.md'));
    
    const posts = await Promise.all(
      mdFiles.map(async file => {
        const contentResponse = await fetch(file.download_url);
        const content = await contentResponse.text();
        const { frontmatter, body } = parseFrontmatter(content);
        
        return {
          slug: file.name.replace('.md', ''),
          path: file.path,
          ...frontmatter,
          body,
          downloadUrl: file.download_url
        };
      })
    );
    
    // 按日期排序（最新的在前）
    posts.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    
    return posts;
  } catch (error) {
    console.error('获取文章失败:', error);
    return [];
  }
}

// 生成文章卡片 HTML
function createPostCard(post) {
  const coverImage = post.cover || 'https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=800';
  const excerpt = post.excerpt || post.body?.slice(0, 150).replace(/[#*`]/g, '') + '...' || '点击阅读全文';
  const category = post.category || '未分类';
  const date = post.date || '未知日期';
  
  return `
    <article class="post-card" onclick="window.location.href='article.html?slug=${post.slug}'" style="cursor: pointer;">
      <img src="${coverImage}" alt="${post.title}" class="post-cover" onerror="this.src='https://images.unsplash.com/photo-1518182170546-0766ce6fec56?w=800'">
      <div class="post-content">
        <span class="post-category">${category}</span>
        <h3 class="post-title">${post.title}</h3>
        <p class="post-excerpt">${excerpt}</p>
        <div class="post-meta">
          <span class="post-date">📅 ${date}</span>
          <span class="read-more">阅读全文 →</span>
        </div>
      </div>
    </article>
  `;
}

// 渲染文章列表
async function renderPostsList() {
  const postsListEl = document.getElementById('postsList');
  
  if (!postsListEl) {
    console.log('未找到 postsList 元素，跳过渲染');
    return;
  }
  
  postsListEl.innerHTML = '<div style="text-align: center; padding: 40px;">🌾 加载文章中...</div>';
  
  const posts = await fetchPostsFromGitHub();
  
  if (posts.length === 0) {
    postsListEl.innerHTML = `
      <div style="text-align: center; padding: 40px;">
        <p>暂无文章</p>
        <p style="color: #666; font-size: 14px;">
          访问 <a href="/admin/" style="color: #D4AF37;">管理后台</a> 创建第一篇文章
        </p>
      </div>
    `;
    return;
  }
  
  postsListEl.innerHTML = posts.map(createPostCard).join('');
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', renderPostsList);

// 导出函数供其他页面使用
window.BlogPosts = {
  fetchPostsFromGitHub,
  parseFrontmatter,
  renderPostsList
};
