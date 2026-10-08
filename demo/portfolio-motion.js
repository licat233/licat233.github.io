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

      /* /demo/: scene-specific entrances, not continuous scroll/pointer effects.
         SplitText is an official GSAP plugin and is applied only to section h2s.
         Each visible element animates once; there is no pinning, scrub, or timeline
         waiting for the user's scroll to catch up. */
      if (ScrollTrigger) {
        const splitPlugin = window.SplitText;
        if (splitPlugin) gsap.registerPlugin(splitPlugin);

        gsap.utils.toArray(".section-head").forEach((head) => {
          const label = head.querySelector(".kicker");
          const title = head.querySelector("h2");
          const note = head.querySelector(".section-note");
          if (!title) return;

          let split = null;
          if (splitPlugin) {
            // Few characters, one-off. Masked char reveal avoids font-heavy effects.
            split = splitPlugin.create(title, { type: "chars", mask: "chars" });
            cleanups.push(() => split?.revert());
          }
          ScrollTrigger.create({
            trigger: head,
            start: "top 86%",
            once: true,
            onEnter: () => {
              const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
              if (label) tl.fromTo(label,
                { y: -14, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .48, clearProps: "all" }, 0);
              if (split) {
                tl.fromTo(split.chars,
                  { yPercent: 112, rotationX: -22, opacity: 0 },
                  {
                    yPercent: 0, rotationX: 0, opacity: 1, duration: .78,
                    stagger: .025, ease: "power4.out",
                    onComplete: () => { split.revert(); split = null; }
                  }, .08);
              } else {
                tl.fromTo(title, { y: 35, autoAlpha: 0, rotationX: -8 },
                  { y: 0, autoAlpha: 1, rotationX: 0, duration: .77, clearProps: "all" }, .09);
              }
              if (note) tl.fromTo(note,
                { x: 32, autoAlpha: 0 },
                { x: 0, autoAlpha: 1, duration: .68, clearProps: "all" }, .24);
            }
          });
        });

        const projectMoves = [
          { y: 65, scale: .88, rotationX: 12 },
          { x: 82, y: 12, rotation: 2.6, scale: .95 },
          { x: -85, y: 15, rotation: -2.8, scale: .95 },
          { y: 72, rotationX: -17, scale: .94 },
          { y: 58, scale: .90, rotation: -2 },
          { x: 72, rotationY: 12, scale: .94 },
          { x: -72, rotationY: -12, scale: .94 },
          { y: 62, scale: .88, rotationX: 13 }
        ];
        gsap.utils.toArray(".project").forEach((card, index) => {
          const title = card.querySelector("h3");
          const icon = card.querySelector(".project-icon");
          ScrollTrigger.create({
            trigger: card, start: "top 90%", once: true,
            onEnter: () => {
              const from = projectMoves[index % projectMoves.length];
              const tl = gsap.timeline();
              tl.fromTo(card, { ...from, autoAlpha: 0 },
                {
                  x: 0, y: 0, scale: 1, rotation: 0,
                  rotationX: 0, rotationY: 0, autoAlpha: 1,
                  duration: .86, ease: "power3.out",
                  clearProps: "transform,opacity,visibility"
                }, 0);
              if (title) tl.fromTo(title,
                { y: 18, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .48, ease: "power2.out",
                  clearProps: "transform,opacity,visibility" }, .16);
              if (icon) tl.fromTo(icon,
                { scale: .64, rotation: -22, autoAlpha: .4 },
                { scale: 1, rotation: 0, autoAlpha: 1, duration: .67,
                  ease: "back.out(1.5)", clearProps: "transform,opacity,visibility" }, .18);
            }
          });
        });

        gsap.utils.toArray(".phase").forEach((phase, index) => {
          const dot = phase.querySelector(".phase-dot");
          ScrollTrigger.create({
            trigger: phase, start: "top 86%", once: true,
            onEnter: () => {
              const tl = gsap.timeline();
              tl.fromTo(phase,
                { y: 44, opacity: 0, scale: .96 },
                { y: 0, opacity: 1, scale: 1, duration: .8,
                  ease: "power3.out", clearProps: "transform,opacity" }, 0);
              if (dot) tl.fromTo(dot,
                { scale: .2, rotation: -50 },
                { scale: 1, rotation: 0, duration: .7,
                  ease: "back.out(1.6)", clearProps: "transform" }, .1);
            }
          });
        });

        gsap.utils.toArray(".principle").forEach((card, index) => {
          ScrollTrigger.create({
            trigger: card, start: "top 90%", once: true,
            onEnter: () => {
              gsap.fromTo(card,
                { y: 44, scale: .89, rotationY: index % 2 ? 13 : -13, autoAlpha: 0 },
                { y: 0, scale: 1, rotationY: 0, autoAlpha: 1,
                  duration: .9, ease: "back.out(1.32)",
                  clearProps: "transform,opacity,visibility" });
            }
          });
        });

        const footer = document.querySelector(".footer-row");
        if (footer) {
          gsap.fromTo(footer, { y: 32, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: .85, ease: "power3.out",
              clearProps: "transform,opacity,visibility",
              scrollTrigger: { trigger: footer, start: "top 90%", once: true } });
        }
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
