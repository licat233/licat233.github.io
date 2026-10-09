"""Read-only checks for the portable Liquid Glass design Skill.

No network, browser, runtime mutation, installs, or third-party dependencies.
These tests verify discoverability, coverage, linked references, and known
contrast checks; they do not assert a rendered UI has passed visual QA.
"""
from __future__ import annotations

import re
import unittest
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SKILL = ROOT / "SKILL.md"
MATERIAL = ROOT / "references" / "material-and-color.md"
CSS = ROOT / "references" / "css-patterns.md"
QA = ROOT / "references" / "qa-and-case-study.md"
OPTICAL = ROOT / "references" / "optical-implementation.md"
PORTFOLIO = ROOT / "references" / "portfolio-case-study.md"
NATIVE = ROOT / "references" / "eao-native-diagrams.md"


def contrast_rgb(a: str, b: str) -> float:
    """WCAG 2.2 relative luminance contrast for *opaque*, uniform HEX pixels."""
    def luminance(hex_value: str) -> float:
        assert re.fullmatch(r"#[0-9a-fA-F]{6}", hex_value)
        srgb = [int(hex_value[i:i + 2], 16) / 255 for i in (1, 3, 5)]
        linear = [c / 12.92 if c <= .04045 else ((c + .055) / 1.055) ** 2.4 for c in srgb]
        return sum(x * w for x, w in zip(linear, (.2126, .7152, .0722)))
    l1, l2 = sorted((luminance(a), luminance(b)), reverse=True)
    return (l1 + .05) / (l2 + .05)


class DesignGlassSkillContract(unittest.TestCase):
    @classmethod
    def setUpClass(cls) -> None:
        cls.content = SKILL.read_text(encoding="utf-8")
        cls.material = MATERIAL.read_text(encoding="utf-8")
        cls.css = CSS.read_text(encoding="utf-8")
        cls.qa = QA.read_text(encoding="utf-8")
        cls.optical = OPTICAL.read_text(encoding="utf-8")
        cls.portfolio = PORTFOLIO.read_text(encoding="utf-8")
        cls.native = NATIVE.read_text(encoding="utf-8")

    def test_hermes_frontmatter(self) -> None:
        match = re.match(r"^---\n(.*?)\n---\n", self.content, re.DOTALL)
        self.assertIsNotNone(match, "YAML frontmatter missing")
        header = match.group(1)
        self.assertRegex(header, r"(?m)^name:\s+design-liquid-glass-ui$")
        self.assertRegex(header, r"(?m)^description:\s+.+$")
        self.assertRegex(header, r"(?m)^version:\s+1\.2\.0$")
        self.assertIn("hermes:", header)
        self.assertIn("frontend", header)

    def test_refs_resolve(self) -> None:
        for reference in (
            "material-and-color.md",
            "css-patterns.md",
            "qa-and-case-study.md",
            "optical-implementation.md",
            "portfolio-case-study.md",
            "eao-native-diagrams.md",
        ):
            self.assertIn("references/" + reference, self.content)
            self.assertTrue((ROOT / "references" / reference).is_file())

    def test_permission_separation_and_approval(self) -> None:
        for marker in ("permission", "user approval", "repo", "not", "deploy"):
            self.assertIn(marker.lower(), self.content.lower())
        self.assertIn("Skill is **instruction**", self.content)
        self.assertIn("not as permission to redesign", self.content)

    def test_quality_gates(self) -> None:
        for x in (
            "1440", "1024", "768", "390", "360",
            "prefers-reduced-motion", "prefers-reduced-transparency",
            "forced-colors", "aria-current", "contrast",
            "lazy loading", "versioned CSS/JS", "real", "fallback",
        ):
            self.assertIn(x.lower(), (self.content + self.material + self.css + self.qa).lower())

    def test_brand_is_role_not_universal_green(self) -> None:
        self.assertIn("brand", self.content.lower())
        self.assertIn("logo", self.material.lower())
        self.assertIn("#00B8AE", self.qa)
        self.assertNotIn("--site-accent: #00B8AE", self.css)

    def test_css_reference_does_not_require_framework(self) -> None:
        self.assertIn("@supports not", self.css)
        self.assertIn(":focus-visible", self.css)
        self.assertIn('aria-current="page"', self.css)
        for unwanted in ("npm install", "WebGLRenderingContext", "ReactDOM", "Vue.createApp"):
            self.assertNotIn(unwanted, self.css)

    def test_optical_stack_and_single_surface_contract(self) -> None:
        for marker in (
            "glass-surface", "glass-filter", "glass-tint", "glass-specular",
            "position: relative", "position: absolute", "pointer-events: none",
            "aria-hidden", "z-index: 3", "border-radius: inherit",
            "getBoundingClientRect()", "padding box",
        ):
            self.assertIn(marker, self.optical, marker)
        self.assertIn("one-positioned-surface", self.content)
        self.assertIn("single visible glass card", self.content)
        self.assertIn("two nested glass cards", self.optical.lower())

    def test_case_tuning_not_pretended_universal(self) -> None:
        for marker in (
            "2.35px", "2.1px", "1.8px", ".12", ".11", "22%",
            "scale=32", "scale=50", "stdDeviation=\"50\"",
        ):
            # SVG attributes are expressed as source/markup, not as a
            # recommendation that every website uses the same values.
            self.assertIn(marker, self.optical + self.portfolio, marker)
        for marker in (
            "not universal", "never a substitute", "not guaranteed",
            "Safari", "WCAG", "CSS", "Demo",
        ):
            self.assertIn(marker.lower(), (self.optical + self.portfolio).lower())

    def test_pinned_scene_with_contrast_and_accessibility(self) -> None:
        for marker in (
            "body::before", "position: fixed", "100svh",
            "existing-hero.webp", "background-attachment:fixed",
            "prefers-contrast: more", "prefers-reduced-transparency: reduce",
            "forced-colors: active", "@supports not",
        ):
            self.assertIn(marker, self.optical, marker)
        self.assertIn("without collapsing", self.optical)
        self.assertIn("actual Safari", self.optical)

    def test_portfolio_release_separates_preview_and_production(self) -> None:
        for marker in (
            "canonical", "noindex", "backup/", "CSS",
            "four", "4/4", "not establish", "timeline",
        ):
            self.assertIn(marker.lower(), self.portfolio.lower())
        self.assertIn("current source", self.portfolio.lower())
        self.assertIn("fixed scene", self.portfolio.lower())

    def test_reference_integrity_and_markdown(self) -> None:
        for path in (SKILL, MATERIAL, CSS, QA, OPTICAL, PORTFOLIO, NATIVE):
            text = path.read_text(encoding="utf-8")
            self.assertGreater(len(text), 500)
            self.assertNotIn("§", text)
            self.assertEqual(text.count(chr(96) * 3) % 2, 0, path.name)
        self.assertIn("optical-implementation.md", self.content)
        self.assertIn("portfolio-case-study.md", self.content)

    def test_eao_native_diagram_material_contract(self) -> None:
        for marker in (
            "colourless", "carrier", "optical", "SVG", "tspan",
            "source-text parity", "display:none", "pointer-events: none",
            "backdrop-filter", "desktop", "tablet", "phone",
            "Safari", "30/30", "aesthetic", "production",
        ):
            self.assertIn(marker.lower(), self.native.lower(), marker)
        self.assertIn("references/eao-native-diagrams.md", self.content)
        self.assertIn("not a production approval", self.native)
        self.assertIn("independently", self.native)
        self.assertIn("Apple", self.content)
        # Cross-Skill references must resolve from THIS directory, too.
        for source in (NATIVE,):
            for ref in re.findall(r"(?<!!)\[[^\]]+\]\(([^)]+)\)", source.read_text()):
                if ref.startswith(("https://", "http://", "#")):
                    continue
                path = (source.parent / ref.split("#")[0]).resolve()
                self.assertTrue(path.is_file(), f"broken link: {source} -> {ref}")

    def test_basic_opaque_examples_not_misleading(self) -> None:
        # The example explicitly asks for composite testing. Opaque baseline is
        # verified only to catch an obviously inaccessible starter.
        self.assertGreaterEqual(contrast_rgb("#136f75", "#FFFFFF"), 4.5)
        self.assertGreaterEqual(contrast_rgb("#25374a", "#FFFFFF"), 4.5)
        self.assertAlmostEqual(contrast_rgb("#000000", "#FFFFFF"), 21.0, places=1)

    def test_historical_case_not_universal_default(self) -> None:
        self.assertIn("case-specific", self.qa)
        self.assertIn("current repository", self.qa)
        self.assertIn("never assume", self.qa.lower())


if __name__ == "__main__":
    unittest.main()
