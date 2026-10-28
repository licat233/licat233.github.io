---
layout: post
title: "我是如何用 Markdown 发布博客的"
date: 2026-10-27 11:00:00 +0800
lang: zh
description: "写好 Markdown，提交到 GitHub，让文章自动发布到博客。我日常使用的简单流程。"
translation_url: /en/blog/publish-markdown-notes/
---

我写博客基本不用编辑后台。用 Markdown 把内容写好，提交到 GitHub，网站就会自动生成文章。

## 写一篇 Markdown

在 `_posts/` 目录新建文件，比如：

```text
_posts/2026-10-28-my-first-note.md
```

填上标题、日期和语言，下面就可以直接写正文：

```markdown
---
title: "我的第一篇笔记"
date: 2026-10-28
lang: zh
description: "这篇文章的简短介绍。"
---

今天想记录一个小发现。

## 我是怎么做的

这里写正文。**重点**可以加粗，也可以插入链接、图片和代码。
```

文件名中的 `my-first-note` 会成为文章地址的一部分。尽量用简短、清楚的英文命名；文章发布后，最好不要随意改文件名。

## 发布到网站

写完后，把 Markdown 提交到 GitHub，合并到 `main` 分支。GitHub Actions 会自动用 **Astro + GitHub Pages** 构建、发布网站。

上面的文章会出现在：

```text
/blog/my-first-note/
```

不需要单独制作网页，博客列表也会自动显示新文章。发布后打开链接看一眼，确认文字、图片和链接正常即可。

## 如果还想发布英文版

再建一个 `_posts/2026-10-28-my-first-note-en.md`，把 `lang` 改成 `en`，写入完整英文正文，就会得到 `/en/blog/my-first-note/`。

如果中英文两篇都已经发布，可以分别添加 `translation_url` 指向对方的地址，让语言切换按钮直达对应文章。没有翻译版时，就不添加这个字段。
