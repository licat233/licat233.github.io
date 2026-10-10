#!/usr/bin/env python3
"""Validate the portable Agent Skill using only Python's standard library."""
from __future__ import annotations

import re
import shutil
import subprocess
import sys
from pathlib import Path

SKILL = Path(__file__).resolve().parents[1]
FILE = SKILL / "SKILL.md"
EXPECTED = [
    "SKILL.md",
    "README.md",
    "assets/example.html",
    "assets/motion.css",
    "assets/reversible-motion.js",
    "references/MOTION-GRAMMAR.md",
    "references/IMPLEMENTATION.md",
    "references/FAILURE-MODES.md",
    "references/ACCEPTANCE.md",
    "references/eao-story-choreography.md",
    "references/MOTION-AMBITION-GATE.md",
    "scripts/validate_skill.py",
    "scripts/qa_browser.mjs",
]
errors: list[str] = []


def require(condition: bool, message: str) -> None:
    if not condition:
        errors.append(message)


for name in EXPECTED:
    require((SKILL / name).is_file(), f"Missing file: {name}")

if FILE.exists():
    text = FILE.read_text(encoding="utf-8")
    m = re.search(r"\A---\n(.*?)\n---\n", text, re.S)
    require(m is not None, "SKILL.md must start with YAML frontmatter")
    if m:
        fm = m.group(1)
        name = re.search(r"^name:\s*(.+)$", fm, re.M)
        desc = re.search(r"^description:\s*(.+)$", fm, re.M)
        require(name is not None, "Missing frontmatter name")
        require(desc is not None, "Missing frontmatter description")
        if name:
            identifier = name.group(1).strip()
            require(bool(re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", identifier)),
                    "Skill name must be lowercase hyphen-separated")
            require(identifier == SKILL.name, "Skill directory name must match name:")
            require(len(identifier) <= 64, "Skill name exceeds 64 characters")
        if desc:
            require(0 < len(desc.group(1)) <= 1024,
                    "description: length must be 1-1024 characters")
    require(len(text.splitlines()) <= 500, "SKILL.md should be <= 500 lines")

    for path in [FILE, *(SKILL / "references").glob("*.md")]:
        for target in re.findall(r"(?<!!)\[[^\]]+\]\(([^)]+)\)", path.read_text(encoding="utf-8")):
            if target.startswith(("https://", "http://", "#", "mailto:")):
                continue
            local = (path.parent / target.split("#", 1)[0]).resolve()
            require(local.is_file(), f"Broken relative link: {path.name} -> {target}")

case = SKILL / "references/eao-story-choreography.md"
if case.exists():
    example = case.read_text(encoding="utf-8")
    for marker in ("A", "B", "C", "D", "step-arrow", "gsap.set",
                   "aria-hidden", "word", "parent", "FAQ",
                   "reverse", "idle", "scrollWidth", "reduced-motion"):
        require(marker.lower() in example.lower(),
                f"EAO scene case lacks: {marker}")
    require("references/eao-story-choreography.md" in FILE.read_text(),
            "SKILL.md must route agents to EAO narrative case")

# Validate the documented *actual* A→arrow→B sequence, not only keywords.
if case.exists():
    code_match = re.search(r"~~~js\n(.*?)\n~~~", example, re.S)
    require(code_match is not None, "EAO case requires a JavaScript sequence recipe")
    if code_match and shutil.which("node"):
        recipe = code_match.group(1)
        syntax = subprocess.run(["node", "--check", "-"], input=recipe,
                                capture_output=True, text=True)
        require(syntax.returncode == 0,
                f"EAO sequence recipe syntax failure:\\n{syntax.stderr}")
        harness = recipe + """
const events = [];
const timeline = {
  fromTo: (target, initial, final, at) =>
    events.push([target.key, at])
};
const cards = Array.from({ length: 4 }, (_, i) => ({
  key: String.fromCharCode(65 + i),
  nextElementSibling: i < 3
    ? { key: "arrow-" + i, matches: () => true }
    : null
}));
globalThis.getComputedStyle = () => ({ display: "flex" });
addOrderedSteps(timeline, cards, false);
const actual = events.map(([key]) => key);
const wanted = ["A", "arrow-0", "B", "arrow-1",
                "C", "arrow-2", "D"];
if (JSON.stringify(actual) !== JSON.stringify(wanted)) {
  throw new Error("Incorrect semantic sequence: " + actual.join(","));
}
"""
        behavior = subprocess.run(["node", "-"], input=harness,
                                  capture_output=True, text=True)
        require(behavior.returncode == 0,
                f"EAO sequence recipe behavior failure:\\n{behavior.stderr}")

# Nested card scenes are a separate semantic completeness gate.
if case.exists():
    for marker in ("parent/child", "seven distinct facts",
                   "actual grid-row", "idle", "reduced-motion",
                   "30/30", "optical", "FAQ"):
        require(marker.lower() in example.lower(),
                f"EAO nested-child scene case lacks: {marker}")
    main = FILE.read_text(encoding="utf-8")
    for marker in ("version: 1.3.0", "Parent + child animation",
                   "inventory", "shared", "readable"):
        require(marker.lower() in main.lower(),
                f"Motion Skill lacks explicit nested-scene policy: {marker}")

# A requested expressive scene requires an ambition decision BEFORE code,
# and a distinct visual-motion acceptance gate AFTER functional QA.
ambition = SKILL / "references/MOTION-AMBITION-GATE.md"
if ambition.exists() and FILE.exists():
    ambition_text = ambition.read_text(encoding="utf-8")
    skill_text = FILE.read_text(encoding="utf-8")
    acceptance = (SKILL / "references/ACCEPTANCE.md").read_text(encoding="utf-8")
    for level in ("L1", "L2", "L3", "L4"):
        require(level in ambition_text and level in skill_text,
                f"Missing per-scene motion ambition level: {level}")
    for token in ("Gate 1", "Gate 2", "Gate 3", "Gate 4",
                  "Parent-child", "near-zero opacity", "normal wheel/touch",
                  "20/45/70/100%", "visual", "technical QA",
                  "not an acceptable primary deliverable",
                  "idle completion", "reduced"):
        require(token.lower() in ambition_text.lower(),
                f"Motion Design Ambition Gate lacks: {token}")
    for token in ("Motion Design Ambition Gate", "20–40px",
                  "visual NOT ACCEPTED", "normal-speed",
                  "engineering acceptance", "visual-motion acceptance"):
        require(token.lower() in skill_text.lower(),
                f"SKILL.md lacks mandatory decision/quality contract: {token}")
    for token in ("Motion Design Ambition Gate", "L1/L2/L3/L4",
                  "normal wheel/touch", "visual",
                  "engineering PASS/FAIL", "0/20/45/70/100%"):
        require(token.lower() in acceptance.lower(),
                f"Acceptance checklist lacks visual ambition gate: {token}")
    require("references/MOTION-AMBITION-GATE.md" in skill_text,
            "Root SKILL.md must link the mandatory ambition guide")

js = SKILL / "assets/reversible-motion.js"
css = SKILL / "assets/motion.css"
if js.exists():
    source = js.read_text(encoding="utf-8")
    for fragment in ("ScrollTrigger", "scrub: true", "setTimeout",
                     "idleTween.kill()", "window.scrollY", "rangeAt(",
                     "prefers-reduced-motion", "scrollHeight"):
        require(fragment in source, f"Controller missing expected behavior: {fragment}")
    require("padding-block-end" not in source, "Controller uses footer padding hack")
    if shutil.which("node"):
        check = subprocess.run(["node", "--check", str(js)], capture_output=True, text=True)
        require(check.returncode == 0, f"JavaScript syntax failure:\n{check.stderr}")
if css.exists():
    style = css.read_text(encoding="utf-8")
    require("padding-block-end" not in style, "Do not add fake Footer padding")
    require("prefers-reduced-motion" in style, "Missing reduced-motion CSS")
    require("opacity: 0 !important" not in style, "Content may disappear if JS fails")

if errors:
    print("FAIL: reusable Skill validation")
    for error in errors:
        print(f"  - {error}")
    sys.exit(1)
print(f"PASS: {SKILL.name} — {len(EXPECTED)} required files; metadata, links, JS/CSS checks")
