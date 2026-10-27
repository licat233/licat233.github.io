# Licat · AI Prompt Library

公开页面：**https://licat233.github.io/prompts/**

这里收录个人收集、总结和整理的 AI 提示词，以中文原文为主。每条提示词包含标题、分类、用途介绍、标签与完整 Markdown 正文。

## 结构

- `index.html`：浏览与阅读页面
- `prompt-library.css`：视觉样式、响应式与深色模式
- `prompt-library.js`：条目索引、搜索、分类、独立链接、一键复制
- `content/*.md`：提示词原文，供页面加载、GitHub 阅读和版本追踪

## 新增或更新条目

1. 在 `content/` 新增或修改一份 `slug.md`，将展示标题、用途说明和编辑备注写在可复制区间之外；用 `<!-- prompt:begin -->` 和 `<!-- prompt:end -->` 仅包围需要实际复制给 AI 的指令正文。
2. 在 `prompt-library.js` 的 `catalogue` 数组登记对应的 `id`（必须与文件名相同）、标题、分类、用途和标签。
3. 新增条目时同步更新 `index.html` 的条目统计、简要描述及 SEO 信息。检查筛选、复制和深链接功能；**任何条目缺少正文边界标记时，网页会禁用复制，而不是复制可能混入元信息的整份 Markdown。**

分类键：`agent`、`thinking`、`design`、`learning`。

页面使用原生 HTML、CSS、JavaScript，不依赖新的框架或额外 CDN 服务。完整文案保留在 Markdown 源文件中，避免摘要覆盖原文。


## 《AI 说人话指南》版本

- **当前正式使用版：** [V1.3.1](content/ai-natural-communication-v1.3.1.md)；网页列表显示此版本。
- **历史研究总结版：** [V1.3](content/ai-natural-communication-v1.3.md)；保留原文，方便比对、引用与追溯。
- 旧分享链接 `?p=ai-natural-communication-v1.3` 会在网页端指向最新正式使用版，不会失效。
- V1.3.1 新增执行优先级、内容生成与自审机制，正文依据作者提供的 2026-10-21 版本整理。网站只增加 Markdown 层级、段落和表格格式，未擅自删减内容。

## 配套提示词

- [AI 说人话指南 V1.3.1](content/ai-natural-communication-v1.3.1.md)：自然交流、价值判断与内容质量的总原则。
- [AI 高价值内容生成与自审指令 V1.1](content/ai-high-value-writing-audit-v1.1.md)：将上述原则用于正式内容创作，覆盖写作前事实判断、写作、价值审稿、局部修订及 SEO 与配图。
- 两个条目在网页详情页互相提供「配套阅读」链接；均保留全文并可单独复制、分享。

## SEO 字符数验证提示词

- [SEO Title 与 Meta Description｜Python 字符数精确校验](content/seo-python-character-validation.md)：要求 AI 实际执行 Python `len()`，按 Title ≤60、Meta Description ≤160 字符做候选验证；超限重写，验证通过才输出。
- 严格遵循既有复制边界：标题和用途说明留在 `<!-- prompt:begin -->` 外，复制按钮只提供指令正文。
- 注意：`len()` 是 Python Unicode 代码点计数，不等同于 Google 搜索结果的像素宽度或各类字素簇的视觉字符数；不要把通过长度约束描述成 Google 不截断的保证。

## 编辑说明

- 对原文的明显文字错误、缺失占位符做必要修正，尽量保留内容与语气。
- 《AI 说人话指南 V1.3》原有「十一条原则」与实际 12 条不符，已更正为「十二条」。
- 四象限协作提示词中有乱码，已按上下文恢复通顺表述。
- Logo 动画提示词补全首尾帧、动画参考素材的明确占位符。
- 记忆与历史对话提示词补充「仅分析真实可访问的内容」条件，防止虚构来源。
- Codex 使用技巧附加版本与客户端差异提醒；功能名称并非所有版本通用。
- DetailFlow 工作流保留上游 Skill 链接：https://github.com/AJbeckliy/detail-flow

以上为个人整理与经验分享，并不代表所有提示词均原创，或适用于每个模型与版本。正式使用前仍应根据实际场景核对。


## 复制正文与展示信息的边界（2026-10-24）

针对当时全部 14 条条目完成统一整理：

- **页面展示信息：** 主标题、版本、适用范围、编辑前言、使用场景说明、末尾点评等放在正文边界之外；卡片标题、描述和配套关系由 `prompt-library.js` 提供。
- **可复制正文：** 仅在 `<!-- prompt:begin -->` 与 `<!-- prompt:end -->` 之间；页面阅读区和「复制完整提示词」均使用同一段正文。
- **保留正文必要结构：** 长指令内部的二、三级标题、清单、表格、约束与操作顺序仍属于提示词，不做无差别删除。
- **具体剔除：** 14 条条目的顶层展示标题；《AI 说人话指南 V1.3.1》的副标题、版本和适用信息；《AI 高价值内容生成与自审指令 V1.1》的定位、适用范围和配套说明；获奖级网页设计提示词的使用引言；寓言学习提示词的使用引言与点评；Codex 技巧的客户端版本说明。
- **兼容性：** 原有文件名、分享 URL、分类和搜索逻辑保持不变，提示词总数仍为 14 条。

新增条目示例：

```md
# 展示标题（不会被复制）

这条提示词的用途说明（不会被复制）。

<!-- prompt:begin -->

这里才是要直接发送给 AI 的指令正文。

<!-- prompt:end -->

补充编辑说明（不会被复制）。
```

## English version

- English catalogue: [English Prompt Library](../en/prompts/).
- Both pages use the same 15-item catalogue and preserve individual `?p=slug` share links across language switches.
- 12 prompt bodies have manually translated English Markdown under `en/prompts/content/`; the three longer originals are shown in Chinese with an explicit language notice until they have been translated.
- The Chinese files under `prompts/content/` remain authoritative originals. Do not silently machine-rewrite them or merge translated content into source files.
