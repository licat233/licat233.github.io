# 发布博客文章

文章用 Markdown 编写，保存在 `astro/src/content/blog/`（Astro Content Collection）。合并到 `main` 后，GitHub Actions 会自动构建 Astro 网站并发布到 GitHub Pages。

## 1. 新建文章

例如新建 `astro/src/content/blog/2026-10-28-my-first-note.md`：

```markdown
---
title: "我的第一篇笔记"
date: 2026-10-28
lang: zh
description: "简短介绍这篇文章。"
---

这里开始写正文。

## 小标题

支持 **加粗**、链接、图片和代码块。
```

文件名中的 `my-first-note` 就是 URL 的 slug。发布后不要随意改文件名，以免改变链接。

## 2. 可选：英文版

英文文章单独保存为 `astro/src/content/blog/2026-10-28-my-first-note-en.md`，头部使用 `lang: en`，正文用英文撰写。

生成的地址分别是：

- 中文：`/blog/my-first-note/`
- 英文：`/en/blog/my-first-note/`

若两种语言的文章都存在，可在中文文章头部加入 `translation_url: /en/blog/my-first-note/`，英文文章加入 `translation_url: /blog/my-first-note/`。没有对应译文时不填写。

## 3. 提交与发布

将 Markdown 文件提交到 GitHub，建议通过 Pull Request 合并到 `main`。合并后站点会自动部署。

想先在本地检查，可以从仓库根目录运行：

```bash
cd astro
npm ci
npm run build
npm run check
```

发布后打开文章 URL 和 [博客列表](https://licat233.github.io/blog/) 检查正文、链接与图片即可。
