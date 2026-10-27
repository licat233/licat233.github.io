**首页**：[https://licat233.github.io/](https://licat233.github.io/)

## Blog 发布

文章位于 `_posts/`，以 `YYYY-MM-DD-slug.md` 命名；使用 Markdown 写作，文件开头填写 `layout: post`、`title`、`date`、`description`。提交到 `main` 后由 GitHub Pages 自动生成文章，列表见 [/blog/](https://licat233.github.io/blog/)。

## 站点导航与多语言（2026-10-27）
- 全站头部：`_includes/site-header.html`；栏目路由与中英文标签：`_data/site_nav.yml`。
- 主导航 CSS：`assets/site-header.css`；主题、选中态、响应式指示器：`assets/site-nav.js`。
- 栏目：Home / Projects / Skills / Blog / Prompts / Journey / Principles；只有 Blog 和 Prompts 是独立栏目页，其他项链接到首页内容区块。不要为展示区块创建空页面。
- 核心页面通过 Jekyll front matter 激活 include；修改导航目标和语言名称，只更改统一的数据文件，不要复制 Header HTML 或另起一套 CSS/JS。
- Blog 布局与中文、英文提示词页均引用同一头部；文章语言切换仅在有真实翻译页面时进入文章，否则返回另一语言的 Blog 列表。
- `/` 为中文主页 canonical，`/zh/` 为兼容地址；新链接优先使用 `/`。原文章、项目、分享深链接保留。
- 项目页面的章节导航属于**项目内部导航**，不应误认为全站主导航；后续对项目详情需补充统一的返回 Projects 路径。
- 必要回归：检查两种语言的首页、Blog、提示词库导航目标/高亮/主题/移动端；确认 Prompt Library 搜索与复制、Blog Markdown 文章页仍正常，GitHub Pages Build + Deploy 均成功。
