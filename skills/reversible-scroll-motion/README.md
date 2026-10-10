# Reversible Scroll Motion — Agent Skill

A portable [Agent Skills](https://agentskills.io/specification) skill distilled from the production Licat homepage animation work. It teaches an agent **how to build, debug and validate** reversible GSAP entrance animations without hijacking scrolling or hiding visible content forever.

## Install

Copy the **entire directory** (not just `SKILL.md`) to a Skills directory supported by your agent. Example for an agent that reads `~/.agents/skills/`:

```sh
mkdir -p ~/.agents/skills
cp -R skills/reversible-scroll-motion ~/.agents/skills/
```

For Claude Code, use its supported Skill directory (often `~/.claude/skills/`). For other agents, check their skill configuration. Some systems may require refreshing skill discovery / restarting the agent. This Skill does not install itself or modify other applications.

## Trigger phrases

- "为我的网站做 Apple 风格的 GSAP 滚动入场动画"
- "根据卡片在页面中的位置和内容关系编排空间运动，滚动回去时倒放"
- "修复页面滚动停止以后内容一直半透明隐藏"
- "Footer 进入页面下方也要自动完成动画，禁止加空白"
- "Create a reversible scroll choreography with visible idle completion"

## Files

- `SKILL.md` — main agent contract and design-to-production workflow.
- `references/` — visible motion grammar, implementation details, known regressions and acceptance criteria.
- `assets/example.html` + `assets/motion.css` + `assets/reversible-motion.js` — runnable, brand-neutral demonstration.
- `scripts/validate_skill.py` — zero-dependency frontmatter, links and code checks.
- `scripts/qa_browser.mjs` — optional Puppeteer browser tests (Puppeteer must be supplied by the host project).

## Try the example

Serve the **repo root** using any static HTTP server, for example:

```sh
python3 -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000/skills/reversible-scroll-motion/assets/example.html
```

No application build step required. The example uses GSAP + ScrollTrigger + optional SplitText via CDN. Without CDN availability, the page content remains visible.

Run structural validation:

```sh
python3 skills/reversible-scroll-motion/scripts/validate_skill.py
```

Run browser validation *only if Puppeteer is already available*, e.g. from a project with `npm install -D puppeteer`:

```sh
node skills/reversible-scroll-motion/scripts/qa_browser.mjs http://127.0.0.1:8000/skills/reversible-scroll-motion/assets/example.html
```

The linked [production example](https://licat233.github.io/zh/) provides a real, complete website; it is not a visual template to copy wholesale.

## Motion ambition: design judgement before code

Read the mandatory [Motion Design Ambition Gate](references/MOTION-AMBITION-GATE.md) when requesting or revising site
animations. Agents must classify each scene from **L1 microinteraction**
through **L4 cinematic**, according to content and brief, and verify
the effect is **perceptible during normal scrolling**.

## No presentation microanimations — hard rule (v1.4.0)

**NO MICROANIMATIONS as primary content/showcase motion.**
Opacity-only reveals, 20–40px fade-ups, generic stagger and randomly
chosen card flight directions fail the visual gate. Every major scene
must visibly **move, transform, assemble or draw** something because
of its information structure, not merely fade into existence.
Use the [Gate 0 checklist](references/MOTION-AMBITION-GATE.md#gate-0--hard-ban-on-presentation-microanimations);
if a major scene reads as “hidden → visible,” it is
**VISUAL NOT ACCEPTED** even if tests are green.

Leave dense practical text static when no meaningful motion fits.
Keep L1 control feedback, focus and reduced-motion accessibility.

Technical QA and **aesthetic acceptance** are separate checks.
The reusable controller is a learning scaffold: adapt scenes to actual
content; do not blindly copy its defaults into a different page.

## Lessons encoded

**Scroll determines movement, not readability.** Use reversible `ScrollTrigger` and one debounced `setTimeout` to finish scenes that are already visible while the user is idle. Re-anchor animation progress for smooth reverse. Keep real grid geometry fixed, clip horizontal travel appropriately, never inflate `scrollHeight` with bottom-origin cards, and never pad the footer to force animations to play.

## Narrative scenes

For A→B→C→D workflows, character-falling headings and large
glass cards with individually animated facts, read
[EAO story choreography](references/eao-story-choreography.md).
The controller remains the same; narrative order is a separate
design concern. Do not copy a site's visual identity or deploy without
authorization.
