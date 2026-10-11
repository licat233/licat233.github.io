# GSAP 开发轨迹 V2：官方 Skills 驱动的场景研究

> 2026-10-11。独立的 /motion-preview/ 审阅页，不修改 licat 个人主页的 CSS / JS / HTML，不视为用户已经验收的正式效果。

## 上游来源（权威且可追溯）

- [GreenSock Official AI Skills](https://github.com/greensock/gsap-skills) — 实际查阅版本 `aed9cfd3277740755f6bfc1155c7aa645403b760`
- `skills/gsap-timeline/SKILL.md` — 统一 Timeline、明确章节 label、相对位置编排，不串接多余 delay。
- `skills/gsap-scrolltrigger/SKILL.md` — 单一顶层 ScrollTrigger，scrub 与动态 start；不对子 tween 添加独立 trigger；在自然文档内滚动。
- `skills/gsap-plugins/SKILL.md` — 官方 DrawSVG、MorphSVG、MotionPath；使用 MorphSVG 插件完成路径之间变形，不自行插值 SVG d。
- `skills/gsap-performance/SKILL.md` — 主体使用 transform；节点数量仅 5 个；不动画玻璃 backdrop-filter；避免批量持续触发布局重排。
- 官方文档：https://gsap.com/docs/v3/Plugins/ScrollTrigger/ 、 https://gsap.com/docs/v3/Plugins/MorphSVGPlugin/

**重要取舍**：本方案未使用 Flip。Flip 的官方适用场景是两次真实 DOM 布局状态之间的变换；本方案是固定 SVG 中的能力结构重排，直接使用 GSAP transform + MorphSVG 更可靠。不是为了堆插件而使用插件。

## 动画故事板（没有卡片淡入、随机飞入或微动效代替主叙事）

| Chapter | 表达含义 | 主体运动 |
| --- | --- | --- |
| 01 BUILD | 单点的系统构建能力 | 核心模块的真实 SVG 描边及内部图形进入 |
| 02 AUTOMATE | 核心能力扩展为自动化链 | 模块从一处扩展到三处（约 440 SVG 单位），路径绘制，流转点沿该路径移动，核心图形变为箭头 |
| 03 ORCHESTRATE | 工具、交付、知识、治理形成网络 | 三模块重排、两模块加入、6 条关系线结构性生长，核心图形变为协作六角结构 |

滚动向上时，同一个 GSAP Timeline 反向播放，保留完整可逆性。

## 可读性与失效保护

- 三个章节文字一直处于正常 DOM 和文档流，不用 `autoAlpha:0` / scroll-triggered 隐藏。
- CSS sticky 看板，不采用 pin 的额外 spacer 或滚动锁定。
- `prefers-reduced-motion: reduce`：直接保留完整静态网络、章节正常可读，不启动 ScrollTrigger。
- GSAP/CDN 失败：保持完整静态 SVG（可读内容仍在）。
- 减轻玻璃发白：不叠加白色渐变遮罩，优先采用更深的文本对比和轻量模糊。

## 测试

MacStudio.local / Playwright Chromium：1440 桌面、768 平板、390 手机；实滚动到三个章节中心，主视觉正确处于 BUILD → AUTOMATE → ORCHESTRATE；正向和反向回放；低动态模式；网络与 JS 控制台错误；横向溢出。公开预览需在 GitHub Pages 发布后再次做手机和桌面公网测试。

注意：这仍是待用户视觉评审的 V2，不应声称用户已经批准或将其合并到正式主页。
