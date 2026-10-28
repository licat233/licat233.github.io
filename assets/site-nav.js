/* Site-wide navigation and theme state — no page-specific content logic. */
(() => {
  "use strict";
  const root = document.documentElement;
  const nav = document.querySelector(".site-header .nav-links");
  const pills = Array.from(nav?.querySelectorAll(".nav-pill") || []);
  const toggle = document.querySelector(".site-header .theme-toggle");
  if (!nav || !pills.length) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)");
  const persistedTheme = () => {
    try {
      const t = localStorage.getItem("licat-theme");
      return t === "light" || t === "dark" ? t : null;
    } catch (_) { return null; }
  };
  const updateThemeToggle = () => {
    if (!toggle) return;
    const dark = root.dataset.theme === "dark";
    const zh = root.lang.toLowerCase().startsWith("zh");
    const label = zh ? (dark ? "切换到昼间模式" : "切换到夜间模式")
      : (dark ? "Switch to light mode" : "Switch to dark mode");
    toggle.setAttribute("aria-label", label);
    toggle.setAttribute("aria-pressed", String(dark));
    toggle.title = label;
  };
  const applyTheme = (theme, persist = false, animate = false) => {
    const update = () => {
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
        meta.content = theme === "dark" ? "#101416" : "#f2f7fa";
      });
      if (persist) {
        try { localStorage.setItem("licat-theme", theme); } catch (_) {}
      }
      updateThemeToggle();
    };
    if (animate && !reducedMotion.matches && document.startViewTransition) {
      document.startViewTransition(update);
    } else {
      update();
    }
    if (animate && window.gsap && toggle && !reducedMotion.matches) {
      window.gsap.fromTo(toggle.querySelector(".theme-toggle-track"),
        { rotation: -24, scale: 0.82 },
        { rotation: 0, scale: 1, duration: .48, ease: "back.out(1.8)" });
    }
  };
  updateThemeToggle();
  toggle?.addEventListener("click", () =>
    applyTheme(root.dataset.theme === "dark" ? "light" : "dark", true, true));
  const followSystem = event => {
    if (!persistedTheme()) applyTheme(event.matches ? "dark" : "light", false, true);
  };
  if (systemTheme.addEventListener) systemTheme.addEventListener("change", followSystem);
  else if (systemTheme.addListener) systemTheme.addListener(followSystem);

  // AI is a primary category with two child pages. The disclosure stays
  // outside the horizontally clipped layout (four primary links now fit).
  const aiGroup = nav.querySelector('[data-nav-group="ai"]');
  const aiTrigger = aiGroup?.querySelector('.nav-submenu-trigger');
  const aiSubnav = aiGroup?.querySelector('.ai-subnav');
  if (aiGroup && aiTrigger && aiSubnav) {
    const openAi = () => {
      aiSubnav.hidden = false;
      aiTrigger.setAttribute('aria-expanded', 'true');
    };
    const closeAi = () => {
      aiSubnav.hidden = true;
      aiTrigger.setAttribute('aria-expanded', 'false');
    };
    const hoverPointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
    aiTrigger.addEventListener('click', () => {
      if (hoverPointer) openAi();
      else if (aiSubnav.hidden) openAi();
      else closeAi();
    });
    aiGroup.addEventListener('focusout', event => {
      if (!aiGroup.contains(event.relatedTarget)) closeAi();
    });
    if (hoverPointer) {
      aiGroup.addEventListener('mouseenter', openAi);
      aiGroup.addEventListener('mouseleave', closeAi);
    }
    document.addEventListener('pointerdown', event => {
      if (!aiGroup.contains(event.target)) closeAi();
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape' || aiSubnav.hidden) return;
      closeAi();
      aiTrigger.focus();
    });
  }

  const getNavTarget = pill => {
    const id = pill?.dataset.navTarget;
    return id === "top" ? document.querySelector(".hero-wrap") : (id ? document.getElementById(id) : null);
  };
  // The AI tab is one visual pill with two semantic controls (link + chevron).
  // Keep aria-current on the link, but move the glass selection to the GROUP.
  const pillSurface = pill => pill.closest('[data-nav-group="ai"]') || pill;
  const pillLeft = surface => surface.getBoundingClientRect().left -
    nav.getBoundingClientRect().left + nav.scrollLeft;
  const center = (pill, smooth) => {
    if (!pill || nav.scrollWidth <= nav.clientWidth + 2) return;
    const surface = pillSurface(pill);
    nav.scrollTo({
      left: Math.max(0, pillLeft(surface) - (nav.clientWidth - surface.offsetWidth) / 2),
      behavior: smooth && !reducedMotion.matches ? "smooth" : "auto"
    });
  };
  const moveNavIndicator = (pill, options = {}) => {
    if (!pill) return;
    const surface = pillSurface(pill);
    if (options.instant) nav.classList.add("nav-instant");
    nav.style.setProperty("--nav-indicator-x", pillLeft(surface) + "px");
    nav.style.setProperty("--nav-indicator-w", surface.offsetWidth + "px");
    nav.classList.add("nav-ready");
    if (options.center) center(pill, !options.instant);
    if (options.instant) requestAnimationFrame(() => requestAnimationFrame(() =>
      nav.classList.remove("nav-instant")));
  };
  const setActiveNav = (pill, options = {}) => {
    if (!pill) return;
    pills.forEach(item => {
      const active = item === pill;
      item.classList.toggle("active", active);
      if (active) item.setAttribute("aria-current", item.dataset.navSectionCurrent || "page");
      else item.removeAttribute("aria-current");
    });
    moveNavIndicator(pill, options);
  };
  pills.forEach(pill => {
    pill.addEventListener("click", event => {
      if (event.defaultPrevented || event.metaKey || event.ctrlKey || event.altKey ||
          event.shiftKey || event.button !== 0) return;
      const target = getNavTarget(pill);
      if (!target) return;
      event.preventDefault();
      setActiveNav(pill, { center: true });
      if (pill.dataset.navTarget === "top") {
        window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "auto" : "smooth" });
      } else {
        target.scrollIntoView({ behavior: reducedMotion.matches ? "auto" : "smooth", block: "start" });
      }
      const hash = pill.getAttribute("href");
      if (hash && window.history.replaceState) history.replaceState(null, "", hash);
    });
  });
  const activeAtLoad = () => {
    const hashId = decodeURIComponent(location.hash.slice(1));
    return (hashId && pills.find(pill => pill.dataset.navTarget === hashId)) ||
      pills.find(pill => pill.classList.contains("active")) || pills[0];
  };
  requestAnimationFrame(() => setActiveNav(activeAtLoad(), { instant: true, center: true }));
  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => moveNavIndicator(
      pills.find(pill => pill.classList.contains("active")) || pills[0],
      { instant: true }));
  });
  window.addEventListener("hashchange", () => {
    const pill = pills.find(item => item.dataset.navTarget === decodeURIComponent(location.hash.slice(1)));
    if (pill) setActiveNav(pill, { center: true });
  });
  window.LicatSiteNav = {
    navPills: pills,
    getNavTarget,
    setActiveNav,
    moveNavIndicator
  };
})();