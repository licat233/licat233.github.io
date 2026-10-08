(() => {
  const root = document.documentElement;
  const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

  /* ───────────────────────── Theme */
  const themeToggle = document.querySelector(".theme-toggle");

  const getStoredTheme = () => {
    try {
      const value = localStorage.getItem("licat-theme");
      return value === "light" || value === "dark" ? value : null;
    } catch (_) {
      return null;
    }
  };

  const currentTheme = () =>
    root.dataset.theme === "dark" ? "dark" : "light";

  const updateThemeButton = () => {
    if (!themeToggle) return;
    const dark = currentTheme() === "dark";
    const zh = root.lang.toLowerCase().startsWith("zh");
    themeToggle.setAttribute("aria-pressed", String(dark));
    themeToggle.setAttribute(
      "aria-label",
      zh
        ? (dark ? "切换到昼间模式" : "切换到夜间模式")
        : (dark ? "Switch to light mode" : "Switch to dark mode")
    );
    themeToggle.title = themeToggle.getAttribute("aria-label");
  };

  const applyTheme = (theme, { persist = false, animate = false } = {}) => {
    const commit = () => {
      root.dataset.theme = theme;
      root.style.colorScheme = theme;
      document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
        meta.setAttribute("content", theme === "dark" ? "#101416" : "#f2f7fa");
      });
      if (persist) {
        try {
          localStorage.setItem("licat-theme", theme);
        } catch (_) {}
      }
      updateThemeButton();
    };

    if (
      animate &&
      !reducedMotionQuery.matches &&
      typeof document.startViewTransition === "function"
    ) {
      document.startViewTransition(commit);
    } else {
      commit();
    }

    if (animate && window.gsap && themeToggle && !reducedMotionQuery.matches) {
      window.gsap.fromTo(
        themeToggle.querySelector(".theme-toggle-track"),
        { rotation: -24, scale: 0.82 },
        { rotation: 0, scale: 1, duration: 0.48, ease: "back.out(1.8)" }
      );
    }
  };

  updateThemeButton();

  themeToggle?.addEventListener("click", () => {
    const next = currentTheme() === "dark" ? "light" : "dark";
    applyTheme(next, { persist: true, animate: true });
  });

  const onSystemThemeChange = (event) => {
    if (getStoredTheme()) return;
    applyTheme(event.matches ? "dark" : "light", { persist: false, animate: true });
  };

  if (systemThemeQuery.addEventListener) {
    systemThemeQuery.addEventListener("change", onSystemThemeChange);
  } else if (systemThemeQuery.addListener) {
    systemThemeQuery.addListener(onSystemThemeChange);
  }

  /* ───────────────────────── Navigation indicator + snap */
  const navLinks = document.querySelector(".nav-links");
  const navPills = Array.from(document.querySelectorAll(".nav-pill"));

  const getNavTarget = (pill) => {
    const id = pill?.dataset.navTarget;
    if (id === "top") return document.querySelector(".hero-wrap");
    return id ? document.getElementById(id) : null;
  };

  const centerNavPill = (pill, smooth = true) => {
    if (!navLinks || !pill || navLinks.scrollWidth <= navLinks.clientWidth + 2) return;
    const left =
      pill.offsetLeft -
      (navLinks.clientWidth - pill.offsetWidth) / 2;
    navLinks.scrollTo({
      left: Math.max(0, left),
      behavior: smooth && !reducedMotionQuery.matches ? "smooth" : "auto"
    });
  };

  const moveNavIndicator = (pill, { instant = false, center = false } = {}) => {
    if (!navLinks || !pill) return;

    if (instant) navLinks.classList.add("nav-instant");

    navLinks.style.setProperty("--nav-indicator-x", `${pill.offsetLeft}px`);
    navLinks.style.setProperty("--nav-indicator-w", `${pill.offsetWidth}px`);
    navLinks.classList.add("nav-ready");

    if (center) centerNavPill(pill, !instant);

    if (instant) {
      requestAnimationFrame(() => {
        requestAnimationFrame(() => navLinks.classList.remove("nav-instant"));
      });
    }
  };

  const setActiveNav = (pill, options = {}) => {
    if (!pill) return;
    navPills.forEach((item) => {
      const active = item === pill;
      item.classList.toggle("active", active);
      if (active) item.setAttribute("aria-current", "page");
      else item.removeAttribute("aria-current");
    });
    moveNavIndicator(pill, options);
  };

  navPills.forEach((pill) => {
    pill.addEventListener("click", (event) => {
      const target = getNavTarget(pill);
      if (!target) return;

      event.preventDefault();
      setActiveNav(pill, { center: true });

      if (pill.dataset.navTarget === "top") {
        window.scrollTo({
          top: 0,
          behavior: reducedMotionQuery.matches ? "auto" : "smooth"
        });
      } else {
        target.scrollIntoView({
          behavior: reducedMotionQuery.matches ? "auto" : "smooth",
          block: "start"
        });
      }

      const hash = pill.getAttribute("href");
      if (hash && history.replaceState) {
        history.replaceState(null, "", hash);
      }
    });
  });

  const activeAtLoad =
    navPills.find((pill) => pill.classList.contains("active")) || navPills[0];

  requestAnimationFrame(() => {
    moveNavIndicator(activeAtLoad, { instant: true, center: true });
  });

  let resizeFrame = 0;
  window.addEventListener("resize", () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      const active = navPills.find((pill) => pill.classList.contains("active"));
      moveNavIndicator(active || navPills[0], { instant: true, center: false });
    });
  });

  /* ───────────────────────── GSAP */
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (gsap && ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);

    // Navigation follows the section currently crossing the visual focus line.
    navPills.forEach((pill) => {
      const target = getNavTarget(pill);
      if (!target) return;

      ScrollTrigger.create({
        trigger: target,
        start: "top 46%",
        end: "bottom 46%",
        onEnter: () => setActiveNav(pill, { center: true }),
        onEnterBack: () => setActiveNav(pill, { center: true })
      });
    });
  } else if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const pill = navPills.find(
          (item) => getNavTarget(item) === visible.target
        );
        setActiveNav(pill, { center: true });
      },
      { rootMargin: "-28% 0px -58% 0px", threshold: [0, 0.1, 0.25, 0.5] }
    );

    navPills.forEach((pill) => {
      const target = getNavTarget(pill);
      if (target) observer.observe(target);
    });
  }

  if (!gsap) return;

  const mm = gsap.matchMedia();

  mm.add(
    {
      all: "(min-width: 0px)",
      desktop: "(min-width: 761px)",
      finePointer: "(pointer: fine)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      const { desktop, finePointer, reduceMotion } = context.conditions;
      const cleanups = [];

      if (reduceMotion) {
        gsap.set(
          ".site-header, .system-flow, .flow-glow, .hero-ghost, .hero-scene, .eyebrow, .hero-word, .hero-inline-note, .hero-paren, .hero-logo-token, .hero-signal, .hero-badge, .hero-actions, .hero-resource",
          { clearProps: "all" }
        );
        return;
      }

      gsap.set(".site-header", { y: -22, autoAlpha: 0 });
      gsap.set(".system-flow", { x: 150, autoAlpha: 0 });
      gsap.set(".flow-glow", { autoAlpha: 0 });
      gsap.set(".hero-ghost", { autoAlpha: 0, scale: 1.08 });
      gsap.set(".hero-scene", { autoAlpha: 0, scale: 1.08 });
      gsap.set(".eyebrow", { y: 12, autoAlpha: 0 });
      gsap.set(".hero-word", { yPercent: 112, autoAlpha: 0 });
      gsap.set(".hero-inline-note", { x: -14, autoAlpha: 0 });
      gsap.set(".hero-paren", { scale: 0, autoAlpha: 0 });
      gsap.set(".hero-logo-token", { scale: 0, rotation: -42, autoAlpha: 0 });
      gsap.set(".hero-signal", { scale: 0.78, rotation: 6, autoAlpha: 0 });
      gsap.set(".hero-badge", { scale: 0, rotation: -80, autoAlpha: 0 });
      gsap.set(".hero-actions", { y: 16, autoAlpha: 0 });
      gsap.set(".hero-resource", { y: 14, autoAlpha: 0 });

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.08
      });

      intro
        .to(".site-header", { y: 0, autoAlpha: 1, duration: 0.62 })
        .to(".flow-glow", { autoAlpha: 1, duration: 1.05, stagger: 0.12 }, "-=.38")
        .to(".system-flow", { x: 0, autoAlpha: 1, duration: 1.25 }, "-=.92")
        .to(".hero-ghost", { autoAlpha: 1, scale: 1, duration: 1.15 }, "-=1.02")
        .to(".hero-scene", { autoAlpha: 1, scale: 1, duration: 1.0 }, "-=.92")
        .to(".eyebrow", { y: 0, autoAlpha: 1, duration: 0.42 }, "-=.72")
        .to(
          ".hero-word",
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.82,
            stagger: 0.09,
            ease: "power4.out"
          },
          "-=.56"
        )
        .to(".hero-inline-note", { x: 0, autoAlpha: 1, duration: 0.48 }, "-=.44")
        .to(
          ".hero-paren",
          { scale: 1, autoAlpha: 1, duration: 0.46, stagger: 0.08, ease: "back.out(2)" },
          "-=.34"
        )
        .to(
          ".hero-logo-token",
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.56, ease: "back.out(1.7)" },
          "-=.33"
        )
        .to(
          ".hero-signal",
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.50, ease: "back.out(1.45)" },
          "-=.38"
        )
        .to(
          ".hero-badge",
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.68, ease: "back.out(1.55)" },
          "-=.28"
        )
        .to(".hero-actions", { y: 0, autoAlpha: 1, duration: 0.44 }, "-=.33")
        .to(
          ".hero-resource",
          { y: 0, autoAlpha: 1, duration: 0.44, stagger: 0.08 },
          "-=.32"
        );

      /* GSAP Creative Motion Showcase
         Official patterns: Flip stacked-to-grid, SplitText masked typography,
         MorphSVG path morph. One-shot entrances, never pin/scrub. */
      if (ScrollTrigger) {
        const Split = window.SplitText;
        const Flip = window.Flip;
        const Morph = window.MorphSVGPlugin;
        if (Split) gsap.registerPlugin(Split);
        if (Flip) gsap.registerPlugin(Flip);
        if (Morph) gsap.registerPlugin(Morph);

        // GSAP's MorphSVG interpolates SVG path points, not opacity or CSS transforms.
        // The hero ribbon first grows from a thin line into its actual curved silhouette.
        const ribbon = document.querySelector(".flow-ribbon-main");
        if (Morph && ribbon) {
          const finalShape = ribbon.getAttribute("d");
          const lineShape =
            "M-160 256 C270 257 590 253 858 250 C1200 248 1500 250 1880 250 " +
            "L1880 255 C1510 255 1210 255 858 255 C580 255 265 260 -160 262 Z";
          gsap.set(ribbon, { morphSVG: lineShape });
          intro.to(ribbon, {
            morphSVG: finalShape, duration: 1.7, ease: "expo.inOut"
          }, .46);
        }

        // SplitText creates actual per-character masks. Characters peel out of
        // three-dimensional space, then SplitText restores the original semantic DOM.
        gsap.utils.toArray(".section-head").forEach((head, sectionIndex) => {
          const title = head.querySelector("h2");
          const eyebrow = head.querySelector(".kicker");
          const note = head.querySelector(".section-note");
          if (!title) return;
          let split = null;
          cleanups.push(() => { if (split) split.revert(); });
          ScrollTrigger.create({
            trigger: head,
            start: "top 84%",
            once: true,
            onEnter: () => {
              const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
              tl.fromTo(eyebrow,
                { x: -38, autoAlpha: 0 },
                { x: 0, autoAlpha: 1, duration: .55, clearProps: "all" }, 0);
              if (Split) {
                split = Split.create(title, { type: "chars", mask: "chars" });
                const chars = split.chars;
                tl.fromTo(chars,
                  {
                    yPercent: (i) => i % 2 ? -155 : 165,
                    rotationX: (i) => i % 2 ? 85 : -85,
                    rotationY: (i) => i % 2 ? -42 : 42,
                    scale: .64, opacity: 0
                  },
                  {
                    yPercent: 0, rotationX: 0, rotationY: 0, scale: 1, opacity: 1,
                    ease: "expo.out", duration: 1.12,
                    stagger: { each: .042, from: sectionIndex % 2 ? "end" : "start" },
                    onComplete: () => { split?.revert(); split = null; }
                  }, .09);
              } else {
                tl.fromTo(title,
                  { y: 85, rotationX: -75, autoAlpha: 0 },
                  { y: 0, rotationX: 0, autoAlpha: 1, duration: 1.0, clearProps: "all" }, .09);
              }
              if (note) tl.fromTo(note,
                { x: 55, autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
                { x: 0, autoAlpha: 1, clipPath: "inset(0 0% 0 0)",
                  duration: .8, ease: "power3.inOut",
                  clearProps: "transform,opacity,visibility,clipPath" }, .38);
            }
          });
        });

        const allCards = gsap.utils.toArray(".projects .project");
        const grid = document.querySelector(".projects");
        const enterCards = (cards) => cards.forEach((card, index) => {
          ScrollTrigger.create({
            trigger: card, start: "top 90%", once: true,
            onEnter: () => {
              const fromLeft = index % 2 === 0;
              gsap.fromTo(card,
                {
                  autoAlpha: 0,
                  clipPath: fromLeft ? "inset(0 100% 0 0 round 24px)" : "inset(0 0 0 100% round 24px)",
                  x: fromLeft ? -85 : 85,
                  rotationY: fromLeft ? -24 : 24,
                  scale: .86,
                  transformOrigin: fromLeft ? "0% 50%" : "100% 50%"
                },
                {
                  autoAlpha: 1, clipPath: "inset(0 0 0 0 round 24px)",
                  x: 0, rotationY: 0, scale: 1,
                  duration: 1.02, ease: "power4.out",
                  clearProps: "all"
                });
            }
          });
        });
        if (grid && allCards.length > 2 && Flip && desktop) {
          const first = allCards.slice(0, 2);
          // Reserve final geometry before the first two cards form a physical
          // stack. The section height therefore never collapses or traps scroll.
          grid.style.minHeight = grid.offsetHeight + "px";
          grid.classList.add("creative-stack");

          ScrollTrigger.create({
            trigger: grid, start: "top 76%", once: true,
            onEnter: () => {
              const state = Flip.getState(first);
              grid.classList.remove("creative-stack");
              const play = Flip.from(state, {
                absolute: true, scale: true, duration: 1.28,
                ease: "expo.inOut", stagger: .12,
                onComplete: () => {
                  grid.style.minHeight = "";
                  gsap.set(first, {clearProps: "transform,width,height,position,top,left,zIndex"});
                }
              });
              // Enter subsequent cards only when they themselves are visible.
              enterCards(allCards.slice(2));
              ScrollTrigger.refresh();
            }
          });
          cleanups.push(() => { grid.classList.remove("creative-stack"); grid.style.minHeight = ""; });
        } else {
          enterCards(allCards);
        }

        // Clip masks create a wipe in the development timeline; the milestone
        // marker snaps into position with a real elastic ease.
        gsap.utils.toArray(".phase").forEach((phase, index) => {
          const dot = phase.querySelector(".phase-dot");
          ScrollTrigger.create({
            trigger: phase, start: "top 86%", once: true,
            onEnter: () => {
              gsap.fromTo(phase,
                {
                  clipPath: index % 2 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
                  y: index % 2 ? -45 : 45, autoAlpha: 0
                },
                {
                  clipPath: "inset(0% 0 0% 0)", y: 0, autoAlpha: 1,
                  duration: 1.0, ease: "power3.inOut",
                  clearProps: "all"
                });
              if (dot) gsap.fromTo(dot, {rotation: -105, scale: .15},
                { rotation: 0, scale: 1, duration: 1.1, ease: "elastic.out(1,0.55)",
                  clearProps: "transform", delay: .16 });
            }
          });
        });

        // Three-dimensional folding uses GSAP's transform pipeline instead of
        // costly CSS filters or WebGL. Each card opens once, then is static.
        gsap.utils.toArray(".principle").forEach((card, i) => {
          ScrollTrigger.create({
            trigger: card, start: "top 88%", once: true,
            onEnter: () => {
              gsap.fromTo(card,
                {
                  transformPerspective: 1000,
                  transformOrigin: i % 2 ? "100% 50%" : "0% 50%",
                  rotationY: i % 2 ? 82 : -82,
                  scale: .76, autoAlpha: 0
                },
                {
                  rotationY: 0, scale: 1, autoAlpha: 1,
                  duration: 1.18, ease: "back.out(1.3)",
                  clearProps: "all"
                });
            }
          });
        });
      }

      return () => cleanups.forEach((fn) => fn());
    }
  );

  window.addEventListener(
    "load",
    () => {
      const active = navPills.find((pill) => pill.classList.contains("active")) || navPills[0];
      moveNavIndicator(active, { instant: true, center: false });
      if (ScrollTrigger) ScrollTrigger.refresh();
    },
    { once: true }
  );
})();
