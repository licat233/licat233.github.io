/*
 * Progressive discovery for new Agent Skills.
 * The two published Skills remain static and readable even if GitHub is
 * unavailable, rate-limited or blocked. No framework or backend required.
 */
(() => {
  "use strict";
  const grid = document.querySelector("#skills .skills-grid");
  if (!grid || typeof window.fetch !== "function") return;
  const en = document.documentElement.lang.toLowerCase().startsWith("en");
  const repo = "licat233/licat233.github.io";
  const existing = new Set(Array.from(grid.querySelectorAll(".skill-card h3"), node => node.textContent.trim()));
  const validSlug = /^[a-z0-9][a-z0-9-]{0,79}$/;
  const labels = en
    ? { category: "AGENT SKILL", usage: "WHAT IT HELPS WITH", read: "Read SKILL.md", source: "Browse source", fallback: "Read SKILL.md for scope, use cases and instructions." }
    : { category: "AGENT SKILL", usage: "主要用途", read: "阅读 SKILL.md", source: "浏览源文件", fallback: "阅读 SKILL.md 了解适用场景、工作流程与验证方法。" };

  function getDescription(markdown) {
    const block = /^---\s*\r?\n([\s\S]*?)\r?\n---(?:\s|$)/.exec(markdown);
    if (!block) return "";
    const match = /^description:\s*(.+)$/m.exec(block[1]);
    if (!match) return "";
    let value = match[1].trim();
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) value = value.slice(1, -1);
    if (/^[>|][-+]?\s*$/.test(value)) return "";
    return value.replace(/\\n/g, " ").replace(/\s+/g, " ").trim().slice(0, 320);
  }

  function buildCard(slug, description, index) {
    const article = document.createElement("article");
    article.className = "liquid-demo skill-card apple-glass-base apple-glass-regular";
    article.innerHTML = `
      <span class="lg-glass-filter" aria-hidden="true"></span>
      <span class="lg-glass-overlay" aria-hidden="true"></span>
      <span class="lg-glass-specular" aria-hidden="true"></span>
      <div class="skill-card-content">
        <div class="skill-card-top"><span class="skill-index"></span><span class="skill-domain"></span></div>
        <h3></h3><p class="skill-summary"></p>
        <div class="skill-usage"><h4></h4><ul><li></li></ul></div>
        <div class="skill-actions">
          <a class="skill-link" target="_blank" rel="noopener noreferrer"></a>
          <a class="skill-source" target="_blank" rel="noopener noreferrer"></a>
        </div>
      </div>`;
    article.querySelector(".skill-index").textContent = String(index).padStart(2, "0");
    article.querySelector(".skill-domain").textContent = labels.category;
    article.querySelector("h3").textContent = slug;
    const useSplit = description.split(/\s+Use when\s+/i);
    article.querySelector(".skill-summary").textContent = useSplit[0] || description || labels.fallback;
    article.querySelector(".skill-usage h4").textContent = labels.usage;
    article.querySelector(".skill-usage li").textContent = useSplit[1] || labels.fallback;
    const fileBase = "https://github.com/" + repo + "/tree/main/skills/" + encodeURIComponent(slug);
    const read = article.querySelector(".skill-link");
    read.href = "https://github.com/" + repo + "/blob/main/skills/" + encodeURIComponent(slug) + "/SKILL.md";
    read.textContent = labels.read + " ↗";
    const source = article.querySelector(".skill-source");
    source.href = fileBase;
    source.textContent = labels.source + " ↗";
    return article;
  }

  async function discover() {
    try {
      const response = await fetch("https://api.github.com/repos/" + repo + "/contents/skills", {
        headers: { Accept: "application/vnd.github+json" }
      });
      if (!response.ok) return;
      const entries = await response.json();
      if (!Array.isArray(entries)) return;
      const missing = entries.filter(entry =>
        entry.type === "dir" && validSlug.test(entry.name) && !existing.has(entry.name)
      ).slice(0, 40);
      if (!missing.length) return;
      const results = await Promise.all(missing.map(async entry => {
        try {
          const url = "https://raw.githubusercontent.com/" + repo + "/main/skills/" + encodeURIComponent(entry.name) + "/SKILL.md";
          const doc = await fetch(url);
          if (!doc.ok) return null;
          return { slug: entry.name, description: getDescription(await doc.text()) };
        } catch (_) { return null; }
      }));
      let next = existing.size + 1;
      for (const item of results.filter(Boolean).sort((a, b) => a.slug.localeCompare(b.slug))) {
        if (existing.has(item.slug)) continue;
        grid.appendChild(buildCard(item.slug, item.description, next++));
        existing.add(item.slug);
      }
      // New cards can change document height after ScrollTrigger initializes.
      if (next > 3 && window.ScrollTrigger?.refresh) window.ScrollTrigger.refresh();
    } catch (_) {
      // The static catalogue is the accessible fallback.
    }
  }

  if ("requestIdleCallback" in window) window.requestIdleCallback(discover, { timeout: 2500 });
  else window.setTimeout(discover, 1200);
})();
