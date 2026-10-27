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

- `/zh/` 是旧中文入口，已收敛为保留 query/hash 的兼容跳转，中文主页仅维护 `/` 一份。

- 基础导航回归检查：`python3 scripts/check_site_navigation.py`，GitHub Actions 的 `site-navigation.yml` 在提交时自动执行；另须检查 GitHub Pages 正式部署结果。

## 项目详情页与站点层级
- 五组双语项目详情页保留原有章节导航，用 `_includes/project-return.html` 提供返回个人主页 Projects 区域的统一面包屑。
- 常规项目详情页与主页共用 `licat-theme` 偏好；EAO 与 ToolScout 是独立项目展示页，仍使用各自的局部导航，但已补充返回 Projects 的路径。
- 项目页的章节导航不等于网站主导航。新增项目时不得复制首页的完整 Header；应使用清晰的上级链接，并保留项目自己的内容导航。

- 自动验收增加 Jekyll 实际 HTML 渲染检查：`scripts/check_rendered_site.py`，验证 8 个中文／英文核心路由（包括文章）及 10 个项目详情面包屑，避免只通过源代码检查却出现空白导航。

## 网站信息架构（2026-10-27）
- 主导航仅含五个独立栏目：`/`, `/projects/`, `/skills/`, `/blog/`, `/prompts/`。英文栏目对应 `/en/...`。
- 首页「精选项目、Agent Skills、开发轨迹、方法」是页面内锚点，使用 `_includes/home-sections.html`，**不属于全站主导航**；首页预览仍保留。
- 项目目录 `_data/projects.yml`，Skills 目录 `_data/skills.yml`；真实栏目页共用 `_layouts/site-section.html`，不要新增空栏目。
- 项目展示页保留自己的产品/项目内导航，同时通过 `_includes/site-context.html` 显示 Licat → Projects → 当前项目、五个主栏目链接。样式由 `assets/site-context.css` 管理。
- `scripts/check_site_navigation.py` 检查源代码契约；`scripts/check_rendered_site.py` 在 Jekyll 实际生成的 HTML 上验证栏目、语言、主导航与项目层级。
- 既有项目 URL、文章 URL 以及 `/zh/` 兼容入口均保留。EAO、ToolScout 等项目独立视觉并未重写；`/lottery-calculate/` 是独立应用，而不是普通内容页。
