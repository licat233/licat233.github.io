---
layout: post
title: "如何用 Astro + GitHub Pages 发布 Markdown 博客"
date: 2026-10-27 11:00:00 +0800
lang: zh
description: "以本站为例，介绍使用 Astro 内容集合、Markdown 和 GitHub Actions 发布中英文博客文章的实际流程。"
translation_url: /en/blog/publish-markdown-notes/
---

> 本文已于 2026 年 10 月 28 日按网站当前的 Astro 架构更新。本文介绍的是本站的实际发布流程，不是通用的 Jekyll 教程。

这个 Blog 使用 **Astro + GitHub Pages**。写文章不需要额外的 CMS：Markdown 保存在 GitHub 仓库中，Astro 在构建时把它转换为静态网页，再由 GitHub Actions 部署。

## 文章放在哪里？

博客原稿仍存放在仓库根目录的 `_posts/`，但**现在由 Astro Content Collection 读取，不再由 Jekyll 渲染**。

新建一篇中文文章，例如：

```text
_posts/2026-10-28-my-first-note.md
```

文件内容可以从以下模板开始：

```yaml
---
title: "我的第一篇笔记"
date: 2026-10-28
lang: zh
description: "简要介绍这篇文章要解决的问题。"
---

这里是 Markdown 正文。

## 一个小标题

可以使用列表、表格、链接、图片和代码块。
```

**关键字段：** `title`、`date`、`lang`；建议填写 `description`。目前 `lang` 支持 `zh` 和 `en`。旧 Jekyll 模板中的 `layout: post`、`layout: post-en` 对 Astro 不再有作用，也不要指望 `permalink` 改变 Astro 生成的文章地址。**本站这篇已有文章仍保留旧 `layout` 字段，只为兼容历史 Jekyll 回滚检查；新文章不必填写。**

本站目前通过 `astro/src/content.config.ts` 的 `glob` 加载 Markdown，再由 `astro/src/pages/blog/[slug].astro` 生成中文文章页。

文件名前面的日期用于源文件组织；网页的 Slug 由文件名去掉日期前缀而得。因此上例会发布到：

```text
/blog/my-first-note/
```

Slug 应当简短、可读且不与已有文章冲突。修改旧文章文件名可能改变 URL，已发布的文章不要随意改名。

## 如何发布英文版？

英文文章单独写成 Markdown，放在同一个 `_posts/` 目录下。本站约定以 `-en.md` 结尾：

```text
_posts/2026-10-28-my-first-note-en.md
```

例如：

```yaml
---
title: "My First Note"
date: 2026-10-28
lang: en
description: "A short summary of this article."
translation_url: /blog/my-first-note/
---

The English Markdown article starts here.
```

它将发布到 `/en/blog/my-first-note/`。当**中文和英文两篇都实际存在**时，在中文文章的头部增加：

```yaml
translation_url: /en/blog/my-first-note/
```

这样语言切换链接才能指向真实的对应文章。**只有单语文章时，不要添加虚构的 `translation_url`**；本站会让语言按钮返回另一语言的 Blog 列表，而不会错误声明两篇文章互为翻译。

中英文正文应独立编写或校对，不要只翻译标题、却让正文仍保持原语言。

## 文章怎样变成网页？

发布链路是：

```text
_posts/*.md
   ↓ Astro Content Collection（按 lang 分类）
   ↓ /blog/[slug]/ 与 /en/blog/[slug]/ 静态构建
   ↓ GitHub Actions：Astro 构建、检查、部署
   ↓ GitHub Pages
```

博客列表也是读取同一内容集合自动生成的，不需要手工为每篇文章新增 `.astro` 页面或编辑首页导航。

**图片与链接：** Markdown 可以写绝对站内路径，例如 `/assets/example.png`，但图片文件必须实际存在并随网站发布。发布前检查中英文内链、图片地址和代码块显示。

## 如何检查并发布？

在仓库根目录执行：

```bash
cd astro
npm ci
npm run build
npm run check
node scripts/check-legacy-routes.mjs
```

项目使用 Node.js 24 与仓库锁定的依赖。第一次安装需要 `npm ci`；已有依赖时不必每次重复安装。

建议在工作分支提交文章并创建 Pull Request，待 GitHub 的构建与浏览器检查通过后再合并至 `main`。当前 `.github/workflows/deploy-astro-pages.yml` 会在 `main` 更新时执行 Astro 构建、校验和 GitHub Pages 部署（部署需启用仓库变量 `ASTRO_PAGES_ACTIVE`）。

最后直接打开新文章与 [中文 Blog 列表](/blog/) 检查页面。若有英文版，也检查 [English Blog](/en/blog/) 以及双向语言切换。

**总结：写 Markdown → 核对元数据与双语链接 → 构建检查 → 合并到 `main` → 验证线上页面。** 不需要安装博客后台，也无需维护 Jekyll 布局。
