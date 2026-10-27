---
layout: post-en
lang: en
title: "Publishing Markdown Notes on This Blog"
date: 2026-10-27 11:00:00 +0800
description: "How I publish posts to a small GitHub Pages blog using Markdown, without a CMS."
permalink: /en/blog/publish-markdown-notes/
translation_url: /blog/publish-markdown-notes/
---

This Blog is hosted on GitHub Pages. I write posts in Markdown and use the existing site build process, without a separate content management system.

## Create a post

Add a Markdown file under the repository's `_posts/` directory. Name it using this pattern:

```text
YYYY-MM-DD-your-article-slug.md
```

For example:

```text
2026-10-27-my-first-note.md
```

Put the post metadata at the start of the file:

```yaml
---
layout: post-en
lang: en
title: "Your article title"
date: 2026-10-27
description: "A one-sentence summary of the post."
permalink: /en/blog/my-first-note/
---
```

Then write the body in Markdown. Headings, links, images, tables and code blocks work as expected.

## Publish

Commit the file to the repository's `main` branch. When GitHub Pages finishes building, the article appears automatically on the [English Blog index](/en/blog/).

For Chinese posts, use the existing `layout: post` and the `/blog/` section instead.

That's the entire workflow.
