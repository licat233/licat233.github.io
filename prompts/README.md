# Licat · AI Prompt Library

公开页面：**https://licat233.github.io/prompts/**

这里收录个人收集、总结和整理的 AI 提示词，以中文原文为主。每条提示词包含标题、分类、用途介绍、标签与完整 Markdown 正文。

## 结构

- `index.html`：浏览与阅读页面
- `prompt-library.css`：视觉样式、响应式与深色模式
- `prompt-library.js`：条目索引、搜索、分类、独立链接、一键复制
- `content/*.md`：提示词原文，供页面加载、GitHub 阅读和版本追踪

## 新增或更新条目

1. 在 `content/` 新增或修改一份 `slug.md`，保留完整的用户可复制内容。
2. 在 `prompt-library.js` 的 `catalogue` 数组登记对应的 `id`（必须与文件名相同）、标题、分类、用途和标签。
3. 新增条目时同步更新 `index.html` 的条目统计、简要描述及 SEO 信息。检查筛选、复制和深链接功能。

分类键：`agent`、`thinking`、`design`、`learning`。

页面使用原生 HTML、CSS、JavaScript，不依赖新的框架或额外 CDN 服务。完整文案保留在 Markdown 源文件中，避免摘要覆盖原文。


## 《AI 说人话指南》版本

- **当前正式使用版：** [V1.3.1](content/ai-natural-communication-v1.3.1.md)；网页列表显示此版本。
- **历史研究总结版：** [V1.3](content/ai-natural-communication-v1.3.md)；保留原文，方便比对、引用与追溯。
- 旧分享链接 `?p=ai-natural-communication-v1.3` 会在网页端指向最新正式使用版，不会失效。
- V1.3.1 新增执行优先级、内容生成与自审机制，正文依据作者提供的 2026-10-21 版本整理。网站只增加 Markdown 层级、段落和表格格式，未擅自删减内容。

## 编辑说明

- 对原文的明显文字错误、缺失占位符做必要修正，尽量保留内容与语气。
- 《AI 说人话指南 V1.3》原有「十一条原则」与实际 12 条不符，已更正为「十二条」。
- 四象限协作提示词中有乱码，已按上下文恢复通顺表述。
- Logo 动画提示词补全首尾帧、动画参考素材的明确占位符。
- 记忆与历史对话提示词补充「仅分析真实可访问的内容」条件，防止虚构来源。
- Codex 使用技巧附加版本与客户端差异提醒；功能名称并非所有版本通用。
- DetailFlow 工作流保留上游 Skill 链接：https://github.com/AJbeckliy/detail-flow

以上为个人整理与经验分享，并不代表所有提示词均原创，或适用于每个模型与版本。正式使用前仍应根据实际场景核对。
