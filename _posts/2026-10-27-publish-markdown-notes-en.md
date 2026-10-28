---
layout: post-en
permalink: /en/blog/publish-markdown-notes/
title: "How I Publish Blog Posts with Markdown"
date: 2026-10-27 11:00:00 +0800
lang: en
description: "Write a Markdown file, commit it to GitHub, and publish a blog post automatically. Here's my simple workflow."
translation_url: /blog/publish-markdown-notes/
---

I write most of my blog posts in Markdown, without opening a CMS. Once the text is ready, I commit the file to GitHub and the site builds the page automatically.

## Write a Markdown post

Create a file in the `_posts/` folder, for example:

```text
_posts/2026-10-28-my-first-note-en.md
```

Add a title, date and language at the top. Then write the article in Markdown:

```markdown
---
title: "My First Note"
date: 2026-10-28
lang: en
description: "A short introduction to this post."
---

Today I want to share something I learned.

## What I tried

Write your post here. Add **bold text**, links, images or code when useful.
```

The `my-first-note` part of the filename becomes part of the URL. Pick a short, readable name and avoid changing it once the post is published.

## Publish it

Commit the Markdown file to GitHub and merge the change into `main`. GitHub Actions builds and publishes my **Astro + GitHub Pages** site automatically.

The post will appear at:

```text
/en/blog/my-first-note/
```

There's no need to create an HTML page manually. The blog index updates with the new post. After publishing, I open the page once to check the text, images and links.

## Publishing a Chinese version too

Create a separate `_posts/2026-10-28-my-first-note.md` with `lang: zh`. It will appear at `/blog/my-first-note/`.

When both versions exist, each article can set `translation_url` to its counterpart so visitors can switch languages directly. Otherwise, leave that field out.
