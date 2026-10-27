---
layout: post
title: "如何在这个 Blog 发布 Markdown 笔记"
date: 2026-10-27 11:00:00 +0800
description: "不需要博客后台，新增一份 Markdown 文件就能发布文章。"
---

这个 Blog 直接托管在 GitHub Pages 上。日常写作只需要 Markdown，不用登录额外的内容管理后台。

## 新建文章

在网站仓库的 `_posts/` 文件夹中新增 Markdown 文件。文件名遵循下面的格式：

```text
YYYY-MM-DD-your-article-slug.md
```

例如：

```text
2026-10-27-my-first-note.md
```

文件开头填写文章信息：

```yaml
---
layout: post
title: "文章标题"
date: 2026-10-27
description: "用一句话说明本文内容。"
---
```

接下来正常使用 Markdown 写正文即可，支持标题、图片、链接、表格与代码块。

## 发布

将文件提交到 GitHub 仓库的 `main` 分支。GitHub Pages 完成构建后，文章会自动出现在 [Blog 列表](/blog/)中，无须手动修改主页。

这就是全部的发布流程。
