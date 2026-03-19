// 田园中的 AI - 博客交互脚本

// 博客文章数据
const blogPosts = [
    {
        id: 1,
        title: "当 AI 遇见田园：科技与自然的和谐共生",
        excerpt: "在远离城市喧嚣的田园中，我发现了人工智能发展的另一种可能——不是取代人类，而是与自然和谐共存，创造更美好的生活。",
        category: "AI 思考",
        date: "2026-03-15",
        image: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&h=600&fit=crop"
    },
    {
        id: 2,
        title: "自然语言处理的诗意：让 AI 理解人类的情感",
        excerpt: "语言不仅是信息的载体，更是情感的表达。如何让 AI 真正理解人类语言背后的情感色彩？",
        category: "技术探索",
        date: "2026-03-10",
        image: "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=600&fit=crop"
    },
    {
        id: 3,
        title: "AI 伦理：在效率与人性之间寻找平衡",
        excerpt: "当算法决定我们的生活时，我们该如何确保它们的选择是公正的？",
        category: "AI 伦理",
        date: "2026-03-05",
        image: "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=800&h=600&fit=crop"
    },
    {
        id: 4,
        title: "机器学习与创意：AI 能否成为艺术家？",
        excerpt: "从生成艺术到音乐创作，AI 在创意领域的应用越来越广泛。",
        category: "创意 AI",
        date: "2026-02-28",
        image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&h=600&fit=crop"
    },
    {
        id: 5,
        title: "从乡村到云端：分布式 AI 的未来",
        excerpt: "边缘计算和分布式系统正在改变 AI 的部署方式。",
        category: "技术趋势",
        date: "2026-02-20",
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&h=600&fit=crop"
    },
    {
        id: 6,
        title: "慢 AI 运动：为什么我们需要放慢脚步",
        excerpt: "在快速迭代成为行业标准的今天，我提出慢 AI 的概念。",
        category: "AI 思考",
        date: "2026-02-15",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&h=600&fit=crop"
    },
    {
        id: 7,
        title: "AI 辅助写作：工具还是伙伴？",
        excerpt: "作为技术作家，我每天都在使用 AI 辅助写作。",
        category: "创意 AI",
        date: "2026-02-10",
        image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=800&h=600&fit=crop"
    },
    {
        id: 8,
        title: "教育中的 AI：培养下一代的技术素养",
        excerpt: "AI 正在改变教育，但我们真正应该教给孩子的是什么？",
        category: "AI 教育",
        date: "2026-02-05",
        image: "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&h=600&fit=crop"
    }
];

// 移动端导航切换
function toggleNav() {
    const nav = document.querySelector('.nav-links');
    if (nav) nav.classList.toggle('active');
}

// 格式化日期
function formatDate(dateString) {
    const d = new Date(dateString);
    return d.getFullYear() + '年' + String(d.getMonth()+1).padStart(2,'0') + '月' + String(d.getDate()).padStart(2,'0') + '日';
}

// 初始化
document.addEventListener('DOMContentLoaded', function() {
    // 首页
    const postsGrid = document.getElementById('postsGrid');
    if (postsGrid) {
        postsGrid.innerHTML = blogPosts.slice(0, 6).map(function(post) {
            return '<article class="post-card fade-in-up" onclick="window.location.href=\'article.html?id=' + post.id + '\'">' +
                '<img src="' + post.image + '" alt="' + post.title + '" class="post-image" loading="lazy">' +
                '<div class="post-content">' +
                '<span class="post-category">' + post.category + '</span>' +
                '<h3 class="post-title">' + post.title + '</h3>' +
                '<p class="post-excerpt">' + post.excerpt + '</p>' +
                '<div class="post-meta">' +
                '<span class="post-date">📅 ' + formatDate(post.date) + '</span>' +
                '<span class="read-more">阅读全文 →</span>' +
                '</div></div></article>';
        }).join('');
    }
    
    // 博客列表页
    const postsList = document.getElementById('postsList');
    if (postsList) {
        postsList.innerHTML = blogPosts.map(function(post) {
            return '<article class="post-list-item fade-in-up" onclick="window.location.href=\'article.html?id=' + post.id + '\'">' +
                '<img src="' + post.image + '" alt="' + post.title + '" class="post-list-image" loading="lazy">' +
                '<div class="post-list-content">' +
                '<span class="post-category">' + post.category + '</span>' +
                '<h3 class="post-list-title">' + post.title + '</h3>' +
                '<p class="post-list-excerpt">' + post.excerpt + '</p>' +
                '<div class="post-list-meta">' +
                '<span>📅 ' + formatDate(post.date) + '</span>' +
                '<span>📖 阅读更多 →</span>' +
                '</div></div></article>';
        }).join('');
    }
    
    // 文章详情页
    const articleContainer = document.querySelector('.article-container');
    if (articleContainer) {
        const params = new URLSearchParams(window.location.search);
        const postId = parseInt(params.get('id'));
        const post = blogPosts.find(function(p) { return p.id === postId; });
        
        if (post) {
            document.title = post.title + ' - 田园中的 AI';
            articleContainer.innerHTML = '<header class="article-header">' +
                '<span class="article-category">' + post.category + '</span>' +
                '<h1>' + post.title + '</h1>' +
                '<div class="article-meta">' +
                '<span>📅 ' + formatDate(post.date) + '</span>' +
                '<span>✍️ 田原</span>' +
                '</div></header>' +
                '<img src="' + post.image + '" alt="' + post.title + '" class="article-featured-image">' +
                '<article class="article-content"><p>文章内容加载中...</p></article>' +
                '<footer class="article-footer">' +
                '<p>感谢阅读！</p>' +
                '<a href="blog.html" class="back-to-blog">← 返回博客列表</a>' +
                '</footer>';
        } else {
            window.location.href = 'blog.html';
        }
    }
});
