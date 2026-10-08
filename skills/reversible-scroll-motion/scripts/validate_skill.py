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
