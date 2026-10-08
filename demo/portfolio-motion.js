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
         Official patterns: directional off-screen flights, SplitText masks,
         MorphSVG path morph. All scroll entrances reversible; no pin. */
      if (ScrollTrigger) {
        const Split = window.SplitText;
        const Morph = window.MorphSVGPlugin;
        if (Split) gsap.registerPlugin(Split);
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

        // Apple-style pacing: animation *duration* in scrub mode is the scroll
        // distance, not the tween's seconds. Keep the first motion in view,
        // give it ample scroll travel, and leave a stable end-state interval.
        const visibleScrollRange = (
          position, startRatio, travelFactor, reserve = 35
        ) => {
          const max = Math.max(1, ScrollTrigger.maxScroll(window) - reserve);
          const travel = Math.round(window.innerHeight * travelFactor);
          const preferredStart = Math.max(0, position - window.innerHeight * startRatio);
          const end = Math.min(max, preferredStart + travel);
          // Near the page end, move the beginning slightly earlier rather than
          // squeezing a long reveal into the last 100px of scrolling.
          const start = Math.max(0, Math.min(preferredStart, end - travel));
          return [start, Math.max(start + 1, end)];
        };
        const absTop = element => element.getBoundingClientRect().top + window.scrollY;
        const createRange = (element, startRatio, travelFactor, reserve = 35) => {
          const range = () => visibleScrollRange(
            absTop(element), startRatio, travelFactor, reserve
          );
          return { start: () => range()[0], end: () => range()[1] };
        };
        const groupRange = (parent, child, startRatio, travelFactor, reserve = 35) => {
          const range = () => visibleScrollRange(
            absTop(parent) + child.offsetTop, startRatio, travelFactor, reserve
          );
          return { start: () => range()[0], end: () => range()[1] };
        };
        // An empty numerical tween holds the finished visual state for the
        // final 15% of scroll progress. It reverses naturally when scrolling up.
        const appendHold = (timeline, fraction = .15) => {
          const live = timeline.duration();
          if (live > 0) {
            timeline.to({ settled: 0 }, {
              settled: 1,
              duration: live * fraction / (1 - fraction),
              ease: "none"
            }, ">");
          }
        };

        // Persistent SplitText masks permit genuine reverse play. Do not revert
        // the split after forward completion: the reverse needs those chars.
        gsap.utils.toArray(".section-head").forEach((head, sectionIndex) => {
          const title = head.querySelector("h2");
          const eyebrow = head.querySelector(".kicker");
          const note = head.querySelector(".section-note");
          if (!title) return;

          let split = null;
          if (Split) {
            split = Split.create(title, { type: "chars", mask: "chars" });
            // A staggered tween initializes characters only when each sub-tween
            // begins. Pre-set every glyph to avoid a partial flash at 0%.
            gsap.set(split.chars, {
              yPercent: i => i % 2 ? -125 : 135,
              rotationX: i => i % 2 ? 72 : -72,
              rotationY: i => i % 2 ? -30 : 30,
              scale: .76, autoAlpha: 0
            });
            cleanups.push(() => split.revert());
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: head,
              ...createRange(head, .76, desktop ? .57 : .54),
              scrub: true,
              invalidateOnRefresh: true
            }
          });

          if (eyebrow) tl.fromTo(eyebrow,
            { x: desktop ? -38 : -18, autoAlpha: 0 },
            { x: 0, autoAlpha: 1, duration: .62, ease: "power1.inOut" }, 0);

          if (split) {
            tl.fromTo(split.chars,
              {
                yPercent: i => i % 2 ? -125 : 135,
                rotationX: i => i % 2 ? 72 : -72,
                rotationY: i => i % 2 ? -30 : 30,
                scale: .76,
                autoAlpha: 0
              },
              {
                yPercent: 0, rotationX: 0, rotationY: 0,
                scale: 1, autoAlpha: 1,
                duration: 1.12, ease: "power1.inOut",
                stagger: { each: .035, from: sectionIndex % 2 ? "end" : "start" }
              }, .10);
          } else {
            tl.fromTo(title, { y: 60, rotationX: -48, autoAlpha: 0 },
              { y: 0, rotationX: 0, autoAlpha: 1, duration: 1,
                ease: "power1.inOut" }, .10);
          }

          if (note) tl.fromTo(note,
            {
              x: desktop ? 44 : 18, autoAlpha: 0,
              clipPath: "inset(0 100% 0 0)"
            },
            {
              x: 0, autoAlpha: 1,
              clipPath: "inset(0 0 0 0)",
              duration: .9, ease: "power1.inOut"
            }, .26);
          appendHold(tl);
        });

        // A true reversible entrance. A scroll range controls each card's GSAP
        // timeline in BOTH directions: scroll down -> fly in; scroll up -> fly out.
        // No pin, smooth-scroll hijack, lagged scrub, layout mutation, or once:true.
        const allCards = gsap.utils.toArray(".projects .project");
        const grid = document.querySelector(".projects");
        const flightDirections = [
          [-1, -1], [1, -1],   // northwest, northeast
          [-1, 1],  [1, 1],    // southwest, southeast
          [-1, 0],  [1, 0],    // west, east
          [0, -1],  [0, 1]    // north, south
        ];
        if (grid && allCards.length) {
          const rowSize = desktop ? 2 : 1;
          const rowTimelines = [];
          gsap.set(allCards, { autoAlpha: 0 });

          for (let index = 0; index < allCards.length; index += rowSize) {
            const group = allCards.slice(index, index + rowSize);
            const rowIndex = index / rowSize;
            const tl = gsap.timeline({
              defaults: { ease: "power2.out" },
              scrollTrigger: {
                // Trigger the stable grid, not an animated card. offsetTop
                // is the actual row position inside the untransformed grid.
                trigger: grid,
                ...groupRange(
                  grid, group[0],
                  rowIndex === 0 ? .78 : .75,
                  desktop ? .70 : .67
                ),
                scrub: true, // frame-accurate, NO 0.7s catch-up delay
                invalidateOnRefresh: true,
                fastScrollEnd: false
              }
            });

            group.forEach((card, withinRow) => {
              const cardIndex = index + withinRow;
              const [directionX, directionY] =
                flightDirections[cardIndex % flightDirections.length];
              const spin = (cardIndex % 2 ? 1 : -1) * (desktop ? 13 : 8);

              const x = () => directionX * (window.innerWidth + card.offsetWidth + 80);
              const y = () => directionY * (window.innerHeight + card.offsetHeight + 50);
              const begin = withinRow * .10;
              // 60%+ of the scene is a legible approach from beyond the edge.
              tl.fromTo(card, {
                x, y, rotation: spin,
                scale: desktop ? .72 : .84,
                autoAlpha: 0,
                force3D: true,
                transformOrigin: "50% 50%"
              }, {
                x: () => x() * .07,
                y: () => y() * .07,
                rotation: spin * .13,
                scale: .96,
                autoAlpha: 1,
                duration: .68,
                ease: "power1.inOut",
                immediateRender: true
              }, begin);
              // A separate short settling movement, not a sudden hard stop.
              tl.to(card, {
                x: 0, y: 0, rotation: 0, scale: 1,
                duration: .22, ease: "power2.out"
              }, begin + .68);
            });

            // Last ~15% is a stable composition before the next row.
            // Keep transforms for a perfect reverse on upward scroll.
            appendHold(tl);
            rowTimelines.push(tl);
          }
          cleanups.push(() => {
            rowTimelines.forEach(tl => {
              tl.scrollTrigger?.kill();
              tl.kill();
            });
            gsap.set(allCards, {
              clearProps: "transform,opacity,visibility,transformOrigin,willChange"
            });
          });
        }

        // Reversible timeline milestones: clipping and node rotation move with
        // scroll position. Offset is measured in the stable, untransformed grid.
        const timelineGrid = document.querySelector(".timeline");
        const phases = gsap.utils.toArray(".timeline .phase");
        if (timelineGrid && phases.length) {
          const groupSize = desktop ? phases.length : 1;
          for (let index = 0; index < phases.length; index += groupSize) {
            const group = phases.slice(index, index + groupSize);
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: timelineGrid,
                ...groupRange(timelineGrid, group[0], .74, desktop ? .46 : .45),
                scrub: true,
                invalidateOnRefresh: true
              }
            });
            group.forEach((phase, withinRow) => {
              const ordinal = index + withinRow;
              const marker = phase.querySelector(".phase-dot");
              const at = withinRow * .1;
              tl.fromTo(phase,
                {
                  clipPath: ordinal % 2
                    ? "inset(0 0 100% 0)"
                    : "inset(100% 0 0 0)",
                  y: ordinal % 2 ? -42 : 42,
                  autoAlpha: 0
                },
                {
                  clipPath: "inset(0 0 0 0)",
                  y: 0, autoAlpha: 1,
                  duration: .9, ease: "power2.inOut"
                }, at);
              if (marker) tl.fromTo(marker,
                { rotation: -100, scale: .24 },
                { rotation: 0, scale: 1, duration: .75,
                  ease: "back.out(1.5)" }, at + .17);
            });
            appendHold(tl);
          }
        }

        // The three principles fold in AND unfold out when direction reverses.
        // The parent grid stays static so scroll trigger positions don't drift.
        const principlesGrid = document.querySelector(".principles");
        const principles = gsap.utils.toArray(".principles .principle");
        if (principlesGrid && principles.length) {
          const groupSize = desktop ? principles.length : 1;
          for (let index = 0; index < principles.length; index += groupSize) {
            const group = principles.slice(index, index + groupSize);
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: principlesGrid,
                ...groupRange(principlesGrid, group[0], .75, desktop ? .59 : .55),
                scrub: true,
                invalidateOnRefresh: true
              }
            });
            group.forEach((card, withinRow) => {
              const ordinal = index + withinRow;
              tl.fromTo(card,
                {
                  transformPerspective: 1100,
                  transformOrigin: ordinal % 2 ? "100% 50%" : "0% 50%",
                  rotationY: ordinal % 2 ? 78 : -78,
                  scale: .78, autoAlpha: 0
                },
                {
                  rotationY: 0, scale: 1, autoAlpha: 1,
                  duration: 1.18, ease: "power1.inOut"
                }, withinRow * .1);
            });
            appendHold(tl);
          }
        }

        // The small footer also participates, while its links remain clickable
        // once in view. The short range is reachable near the bottom of the page.
        const footer = document.querySelector(".site-footer");
        const footerParts = [
          footer?.querySelector(".footer-brand"),
          footer?.querySelector(".footer-links"),
          footer?.querySelector(".footer-note")
        ].filter(Boolean);
        if (footer && footerParts.length) {
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: footer,
              // Footer has little available scroll space: use a shorter,
              // reachable range but only AFTER its top enters the viewport.
              ...createRange(footer, .94, .17, 20),
              scrub: true,
              invalidateOnRefresh: true
            }
          });
          footerParts.forEach((part, index) => {
            tl.fromTo(part,
              { y: 38, rotationX: -24, autoAlpha: 0 },
              { y: 0, rotationX: 0, autoAlpha: 1,
                duration: .75, ease: "power1.inOut" }, index * .14);
          });
          appendHold(tl);
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
