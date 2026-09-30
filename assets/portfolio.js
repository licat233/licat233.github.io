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

      gsap.to(".system-flow svg", {
        y: -13,
        rotation: -0.7,
        transformOrigin: "50% 50%",
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".flow-glow-a", {
        scale: 1.07,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".flow-glow-b", {
        scale: 0.94,
        duration: 7.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      if (ScrollTrigger) {
        if (desktop) {
          gsap.to(".system-flow", {
            y: -185,
            rotation: 5,
            scale: 1.07,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.25
            }
          });

          gsap.to(".hero-ghost", {
            yPercent: -8,
            autoAlpha: 0.42,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.2
            }
          });

          gsap.to(".hero-scene img", {
            yPercent: 8,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.1
            }
          });

          gsap.to(".hero-badge", {
            y: 72,
            rotation: 28,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.35
            }
          });
        }

        gsap.utils.toArray(".section-head").forEach((heading) => {
          gsap.from(heading, {
            y: 26,
            autoAlpha: 0,
            duration: 0.68,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 90%",
              once: true
            }
          });
        });

        ScrollTrigger.batch(".project", {
          start: "top 88%",
          once: true,
          interval: 0.08,
          batchMax: desktop ? 2 : 1,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 42, autoAlpha: 0, scale: 0.982 },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.72,
                stagger: 0.10,
                ease: "power3.out",
                clearProps: "opacity,visibility"
              }
            );
          }
        });

        ScrollTrigger.batch(".phase", {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 30, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.64,
                stagger: 0.13,
                ease: "power3.out",
                clearProps: "opacity,visibility"
              }
            );
          }
        });

        ScrollTrigger.batch(".principle", {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 28, autoAlpha: 0, scale: 0.985 },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.62,
                stagger: 0.10,
                ease: "power3.out",
                clearProps: "opacity,visibility"
              }
            );
          }
        });
      }

      if (finePointer) {
        const flowX = gsap.quickTo(".system-flow", "x", { duration: 1.15, ease: "power3.out" });
        const ghostX = gsap.quickTo(".hero-ghost", "x", { duration: 1.3, ease: "power3.out" });
        const sceneX = gsap.quickTo(".hero-scene", "x", { duration: 1.2, ease: "power3.out" });
        const glowAX = gsap.quickTo(".flow-glow-a", "x", { duration: 1.35, ease: "power3.out" });
        const glowAY = gsap.quickTo(".flow-glow-a", "y", { duration: 1.35, ease: "power3.out" });
        const glowBX = gsap.quickTo(".flow-glow-b", "x", { duration: 1.45, ease: "power3.out" });
        const glowBY = gsap.quickTo(".flow-glow-b", "y", { duration: 1.45, ease: "power3.out" });

        const onMouseMove = (event) => {
          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;
          flowX(x * 30);
          ghostX(x * -18);
          sceneX(x * -14);
          glowAX(x * 58);
          glowAY(y * 32);
          glowBX(x * -42);
          glowBY(y * -25);
        };
        document.addEventListener("mousemove", onMouseMove);
        cleanups.push(() => document.removeEventListener("mousemove", onMouseMove));

        document.querySelectorAll(".project, .principle").forEach((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.42, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.42, ease: "power3.out" });
          const yTo = gsap.quickTo(card, "y", { duration: 0.42, ease: "power3.out" });

          const move = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            rx(py * -3.2);
            ry(px * 4.0);
            yTo(-4);
          };
          const leave = () => {
            rx(0);
            ry(0);
            yTo(0);
          };

          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          });
        });

        const github = document.querySelector(".github-cta");
        if (github) {
          const gx = gsap.quickTo(github, "x", { duration: 0.34, ease: "power2.out" });
          const gy = gsap.quickTo(github, "y", { duration: 0.34, ease: "power2.out" });
          const move = (event) => {
            const r = github.getBoundingClientRect();
            gx(((event.clientX - r.left) / r.width - 0.5) * 8);
            gy(((event.clientY - r.top) / r.height - 0.5) * 8);
          };
          const leave = () => { gx(0); gy(0); };
          github.addEventListener("pointermove", move);
          github.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            github.removeEventListener("pointermove", move);
            github.removeEventListener("pointerleave", leave);
          });
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
