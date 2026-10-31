# Licat · AI Prompt Library

公开页面：**https://licat233.github.io/prompts/**

这里收录个人收集、总结和整理的 AI 提示词，以中文原文为主。每条提示词包含标题、分类、用途介绍、标签与完整 Markdown 正文。

## 结构（Astro 生产版）

- `content/*.md`：中文提示词原文；`../en/prompts/content/*.md`：对应英文正文。
- `../astro/src/data/prompts.json`：中英文条目的标题、分类、摘要、标签和对应关系，唯一目录数据源。
- `../astro/src/components/prompts/PromptLibrary.astro`：中英文共用页面结构。
- `../astro/src/client/prompt-library.js`：搜索、分类、阅读和复制交互。
- `prompt-library.css`：共用样式，由 Astro 构建复制到发布目录。

旧版 `index.html`、`prompt-library.js` 和 `nav.css` 已退役；不再分别维护中文、英文页面。

## 新增或更新条目

1. 在 `content/` 编辑 Markdown，保留 `<!-- prompt:begin -->` 与 `<!-- prompt:end -->` 之间的可复制正文。
2. 更新 `../astro/src/data/prompts.json` 的目录记录，不要在 JavaScript 中复制另一份目录数据。
3. 同步更新 `../en/prompts/content/` 中对应的英文 Markdown；遵循已有翻译状态字段。
4. 从 `astro/` 运行 `npm run build`、`npm run check`，并完成浏览器测试，再合并发布。

分类键：`agent`、`thinking`、`design`、`learning`。

页面使用原生 HTML、CSS、JavaScript，不依赖新的框架或额外 CDN 服务。完整文案保留在 Markdown 源文件中，避免摘要覆盖原文。


## 《AI 说人话指南》版本

- **当前正式使用版：** [V1.3.2](content/ai-natural-communication-v1.3.2.md)；中英文网页列表显示此版本。
- **历史正式使用版：** [V1.3.1](content/ai-natural-communication-v1.3.1.md)；原文保留，旧详情页跳转至 V1.3.2。
- **历史研究总结版：** [V1.3](content/ai-natural-communication-v1.3.md)；保留原文，方便比对、引用与追溯。
- 旧分享链接 `?p=ai-natural-communication-v1.3` 会在网页端指向最新正式使用版，不会失效。
- V1.3.1 新增执行优先级、内容生成与自审机制，保留作为历史版本。
- V1.3.2 新增「能省就省」原则：上下文能表达的逻辑不重复标注，连接词用于强调、转折和澄清；加入句子层面的用词自审，保留必要事实与条件。

## 配套提示词

- [AI 说人话指南 V1.3.2](content/ai-natural-communication-v1.3.2.md)：自然交流、价值判断、语言省略与内容质量的总原则。
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
- **具体剔除：** 14 条条目的顶层展示标题；《AI 说人话指南 V1.3.2》的副标题、版本和适用信息；《AI 高价值内容生成与自审指令 V1.1》的定位、适用范围和配套说明；获奖级网页设计提示词的使用引言；寓言学习提示词的使用引言与点评；Codex 技巧的客户端版本说明。
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

## AI 编程执行规范

- [AI 编程反过度防御与最小实现指令 V1.0](content/ai-coding-minimal-defensive-v1.md)：面向 Codex、Claude Code 和项目编程约定，覆盖减少假想防御、重复校验、过早抽象、冗余注释、过量测试，以及必要的安全边界。
- 按现有约定将展示信息放在可复制正文标记之外；正文保留九个完整章节以及最终执行准则。

## English version

- English catalogue: [English Prompt Library](../en/prompts/).
- All 17 currently listed entries have independent Chinese and English Markdown files. Both language pages use the shared Astro component and catalogue.
- Historical `?p=slug` share links redirect to the new path-based detail pages while preserving language selection.
- Chinese files under `prompts/content/` remain the original texts. Do not silently overwrite originals during translation.
