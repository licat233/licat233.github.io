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

      // Hero L4: kinetic typography and spatial assembly; never fade to zero.
      gsap.set(".site-header", { y: -65, rotationX: -16, transformOrigin: "50% 0%" });
      gsap.set(".system-flow", { x: 300, rotation: -8, scale: 1.15 });
      gsap.set(".flow-glow", { scale: .45, x: 140 });
      gsap.set(".hero-ghost", { x: -155, rotation: -7, scale: 1.22 });
      gsap.set(".hero-scene", { x: 140, y: 80, rotationY: -20, scale: .86 });
      gsap.set(".eyebrow", { x: -90, clipPath: "inset(0 100% 0 0)" });
      gsap.set(".hero-word", { yPercent: 145, rotationX: -67, transformOrigin: "50% 100%" });
      gsap.set(".hero-inline-note", { x: -105, rotationY: -35 });
      gsap.set(".hero-paren", { x: 45, rotation: 100, scale: .55 });
      gsap.set(".hero-logo-token", { x: -80, rotation: -155, scale: .65 });
      gsap.set(".hero-signal", { x: 100, rotationY: -70, scale: .72 });
      gsap.set(".hero-badge", { y: -110, rotation: -160, scale: .53 });
      gsap.set(".hero-actions", { x: -95, rotationY: -23 });
      gsap.set(".hero-resource", { x: 105, rotationY: -36 });
      const intro = gsap.timeline({ defaults: { ease: "power3.out" }, delay: .06 });
      intro
        .to(".site-header", { y: 0, rotationX: 0, duration: .95 })
        .to(".system-flow", { x: 0, rotation: 0, scale: 1, duration: 2, ease: "expo.out" }, .18)
        .to(".flow-glow", { x: 0, scale: 1, duration: 1.8, stagger: .15 }, .2)
        .to(".hero-ghost", { x: 0, rotation: 0, scale: 1, duration: 1.55 }, .29)
        .to(".hero-scene", { x: 0, y: 0, rotationY: 0, scale: 1, duration: 1.55 }, .42)
        .to(".eyebrow", { x: 0, clipPath: "inset(0 0 0 0)", duration: .86 }, .35)
        .to(".hero-word", { yPercent: 0, rotationX: 0, duration: 1.28,
            stagger: .17, ease: "back.out(1.12)" }, .57)
        .to(".hero-inline-note", { x: 0, rotationY: 0, duration: .86 }, 1.0)
        .to(".hero-paren", { x: 0, rotation: 0, scale: 1, duration: .8, stagger: .12 }, 1.12)
        .to(".hero-logo-token", { x: 0, rotation: 0, scale: 1, duration: 1 }, 1.17)
        .to(".hero-signal", { x: 0, rotationY: 0, scale: 1, duration: .98 }, 1.29)
        .to(".hero-badge", { y: 0, rotation: 0, scale: 1, duration: 1.1 }, 1.31)
        .to(".hero-actions", { x: 0, rotationY: 0, duration: .9 }, 1.54)
        .to(".hero-resource", { x: 0, rotationY: 0, duration: .96, stagger: .13 }, 1.66);

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

        // A scrubbed animation is constrained by the space in which its target
        // is VISIBLE, not merely the page's maxScroll value. Finish each
        // element near the middle of the viewport, well before it scrolls
        // behind the fixed header. Reserve the last 15% for a settled view.
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
        // Use layout geometry, not transformed rects: large reversible entrances
        // must never change the scroll trigger's own position.
        const layoutTop = (node) => {
          let total = 0;
          for (let current = node; current; current = current.offsetParent) {
            total += current.offsetTop || 0;
          }
          return total;
        };
        const absTop = layoutTop;
        const createRange = (element, startRatio, travelFactor, reserve = 35) => {
          const range = () => visibleScrollRange(
            layoutTop(element), startRatio, travelFactor, reserve
          );
          return { start: () => range()[0], end: () => range()[1] };
        };
        const groupRange = (_parent, child, startRatio, travelFactor, reserve = 35) =>
          createRange(child, startRatio, travelFactor, reserve);
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

        // Visibility first. Scrub cannot finish when someone stops scrolling.
        // An idle timeout settles content that's actually visible; when scrolling
        // resumes, its new scroll anchor yields a continuous reverse trajectory.
        const idleScenes = [];
        const sceneByTrigger = new WeakMap();
        let idleRevealTimer = null;
        let idleSceneActive = true;
        const sceneVisible = (scene) => {
          const top = scene.top();
          const bottom = top + scene.height();
          const nav = document.querySelector(".site-header");
          const navBottom = nav ? nav.getBoundingClientRect().bottom : 0;
          // A footer rarely reaches the viewport center; an element visible
          // near the bottom must still be readable when scrolling stops.
          const threshold = scene.timeline.scrollTrigger?.trigger
            .classList.contains("site-footer") ? .985 : .94;
          return top < window.innerHeight * threshold &&
                 bottom > Math.max(navBottom + 32, window.innerHeight * .14);
        };
        const clampProgress = gsap.utils.clamp(0, 1);
        const synchronizeScene = (trigger) => {
          const scene = sceneByTrigger.get(trigger);
          if (!scene || !scene.latched) return;
          if (scene.idleTween) {
            scene.baseProgress = scene.timeline.progress();
            scene.latchY = window.scrollY;
            scene.idleTween.kill();
            scene.idleTween = null;
          }
          const travel = Math.max(1, trigger.end - trigger.start);
          const progress = clampProgress(
            scene.baseProgress + (window.scrollY - scene.latchY) / travel
          );
          scene.timeline.progress(progress);
          // An early idle completion may need more upward travel than the
          // page has available (e.g. the first row settled at scrollY=400).
          // Once its natural slot has left the viewport, reset fully instead
          // of leaving a ghosted card at 8% progress at the top of the page.
          if (window.scrollY < trigger.start && !sceneVisible(scene)) {
            scene.timeline.progress(0);
            scene.latched = false;
          }
        };
        const registerIdleScene = (timeline, top, height, finishSeconds = .75) => {
          const scene = {
            timeline, top, height, finishSeconds,
            latched: false, latchY: 0, baseProgress: 0,
            idleTween: null
          };
          idleScenes.push(scene);
          sceneByTrigger.set(timeline.scrollTrigger, scene);
        };
        const settleVisibleScenes = () => {
          idleRevealTimer = null;
          idleScenes.forEach((scene) => {
            const trigger = scene.timeline.scrollTrigger;
            if (!trigger || scene.latched || !sceneVisible(scene) ||
                scene.timeline.progress() >= .999) return;
            scene.latched = true;
            scene.latchY = window.scrollY;
            scene.baseProgress = 1;
            scene.idleTween = gsap.to(scene.timeline, {
              progress: 1, duration: scene.finishSeconds, ease: "power2.out",
              overwrite: "auto",
              onComplete: () => { scene.idleTween = null; }
            });
          });
        };
        const onScrollIdleCheck = () => {
          idleScenes.forEach((scene) => {
            if (scene.latched && scene.timeline.scrollTrigger) {
              synchronizeScene(scene.timeline.scrollTrigger);
            }
          });
          if (idleRevealTimer !== null) window.clearTimeout(idleRevealTimer);
          idleRevealTimer = window.setTimeout(settleVisibleScenes, 480);
        };
        window.addEventListener("scroll", onScrollIdleCheck, { passive: true });
        cleanups.push(() => {
          window.removeEventListener("scroll", onScrollIdleCheck);
          if (idleRevealTimer !== null) window.clearTimeout(idleRevealTimer);
          idleSceneActive = false;
          idleScenes.forEach(scene => scene.idleTween?.kill());
        });

        // V1.4 L3/L4: each chapter title hinges into place as visible type;
        // spatial movement, not opacity, is the defining transition.
        gsap.utils.toArray(".section-head").forEach((head) => {
          const title = head.querySelector("h2");
          const eyebrow = head.querySelector(".kicker");
          const note = head.querySelector(".section-note");
          if (!title) return;
          const Split = window.SplitText;
          let split = null;
          if (Split) {
            split = Split.create(title, { type: "chars", mask: "chars" });
            gsap.set(split.chars, {
              yPercent: -135, rotationX: -95, transformOrigin: "50% 0%"
            });
            cleanups.push(() => split.revert());
          }
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: head, ...createRange(head, .9, desktop ? .49 : .46),
              scrub: true, onUpdate: synchronizeScene,
              invalidateOnRefresh: true
            }
          });
          if (eyebrow) tl.fromTo(eyebrow,
            { x: -90, clipPath: "inset(0 100% 0 0)" },
            { x: 0, clipPath: "inset(0 0 0 0)", duration: .74 }, 0);
          if (split) tl.to(split.chars,
            { yPercent: 0, rotationX: 0, duration: 1.10,
              stagger: .043, ease: "back.out(1.1)" }, .17);
          else tl.fromTo(title,
            { y: -110, rotationX: -80, transformOrigin: "50% 0%" },
            { y: 0, rotationX: 0, duration: 1.15 }, .17);
          if (note) tl.fromTo(note,
            { x: desktop ? 130 : 55, clipPath: "inset(0 0 0 100%)" },
            { x: 0, clipPath: "inset(0 0 0 0)", duration: .93 }, .4);
          appendHold(tl, .12);
          registerIdleScene(tl,
            () => layoutTop(head) - window.scrollY,
            () => head.offsetHeight, .98);
        });

        // Bento assembly: the frame travels from its actual grid-side; icon
        // and arrow orbit inward, title drops as 3D type, tags form a row.
        const projectGrid = document.querySelector(".projects");
        const projectCards = gsap.utils.toArray(".projects .project");
        if (projectGrid && projectCards.length) {
          const rowSize = desktop ? 2 : 1;
          for (let index = 0; index < projectCards.length; index += rowSize) {
            const group = projectCards.slice(index, index + rowSize);
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: projectGrid,
                ...groupRange(projectGrid, group[0], .92, desktop ? .65 : .57),
                scrub: true, onUpdate: synchronizeScene,
                invalidateOnRefresh: true
              }
            });
            group.forEach((card, column) => {
              const side = desktop ? (column === 0 ? -1 : 1) : -1;
              const at = column * .55;
              const icon = card.querySelector(".project-icon");
              const arrow = card.querySelector(".project-arrow");
              const heading = card.querySelector("h3");
              const summary = card.querySelector("p");
              const tags = gsap.utils.toArray(card.querySelectorAll(".tag"));
              const metadata = gsap.utils.toArray(card.querySelectorAll(".project-meta span"));
              tl.fromTo(card,
                { x: side * (desktop ? 245 : 95), y: desktop ? -32 : -25,
                  rotationY: side * -37, rotationZ: side * 5,
                  scale: .77, transformPerspective: 1300,
                  transformOrigin: side < 0 ? "0% 50%" : "100% 50%" },
                { x: 0, y: 0, rotationY: 0, rotationZ: 0, scale: 1,
                  duration: 2.46, ease: "sine.inOut" }, at);
              if (icon) tl.fromTo(icon,
                { x: side * -100, y: 58, rotation: side * -170, scale: .45 },
                { x: 0, y: 0, rotation: 0, scale: 1,
                  duration: .84, ease: "back.out(1.5)" }, at + .24);
              if (arrow) tl.fromTo(arrow,
                { x: -side * 100, y: -54, rotation: side * -100, scale: 1.6 },
                { x: 0, y: 0, rotation: 0, scale: 1,
                  duration: .78, ease: "power3.out" }, at + .30);
              if (heading) tl.fromTo(heading,
                { y: -90, rotationX: -82, transformOrigin: "50% 0%" },
                { y: 0, rotationX: 0, duration: 1.03,
                  ease: "back.out(1.12)" }, at + .48);
              if (summary) tl.fromTo(summary,
                { x: side * 96, clipPath: "inset(0 100% 0 0)" },
                { x: 0, clipPath: "inset(0 0 0 0)", duration: .91 }, at + .80);
              if (tags.length) tl.fromTo(tags,
                { x: side * 80, y: 35, rotationY: side * -55, scale: .65 },
                { x: 0, y: 0, rotationY: 0, scale: 1,
                  duration: .7, stagger: .15, ease: "back.out(1.2)" }, at + 1.02);
              if (metadata.length) tl.fromTo(metadata,
                { x: -65, clipPath: "inset(0 100% 0 0)" },
                { x: 0, clipPath: "inset(0 0 0 0)",
                  duration: .66, stagger: .12 }, at + 1.43);
            });
            appendHold(tl, .13);
            registerIdleScene(tl,
              () => layoutTop(group[0]) - window.scrollY,
              () => group[0].offsetHeight, 1.42);
          }
        }

        // A skill is a handbook: the frame hinges into the grid, the index
        // establishes its source, and use-cases unfold as a knowledge fan.
        const skillsGrid = document.querySelector("#skills .skills-grid");
        if (skillsGrid) {
          const registered = new WeakSet();
          const skillTimelines = [];
          const registerSkills = () => {
            let count = 0;
            Array.from(skillsGrid.querySelectorAll(".skill-card")).forEach((card, index) => {
              if (registered.has(card)) return;
              registered.add(card);
              count++;
              const side = desktop ? (index % 2 ? 1 : -1) : -1;
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: skillsGrid,
                  ...createRange(card, .92, desktop ? .69 : .62),
                  scrub: true, onUpdate: synchronizeScene,
                  invalidateOnRefresh: true
                }
              });
              const idx = card.querySelector(".skill-index");
              const domain = card.querySelector(".skill-domain");
              const heading = card.querySelector("h3");
              const summary = card.querySelector(".skill-summary");
              const usageTitle = card.querySelector(".skill-usage h4");
              const usages = gsap.utils.toArray(card.querySelectorAll(".skill-usage li"));
              const actions = card.querySelector(".skill-actions");
              tl.fromTo(card,
                { x: side * (desktop ? 205 : 85), y: -36,
                  rotationY: side * -49, scale: .83,
                  transformPerspective: 1300,
                  transformOrigin: side < 0 ? "0% 50%" : "100% 50%" },
                { x: 0, y: 0, rotationY: 0, scale: 1,
                  duration: 2.36, ease: "sine.inOut" }, 0);
              if (idx) tl.fromTo(idx,
                { x: side * 95, y: -56, rotation: side * -115, scale: 1.9 },
                { x: 0, y: 0, rotation: 0, scale: 1,
                  duration: .8, ease: "back.out(1.35)" }, .24);
              if (domain) tl.fromTo(domain,
                { x: -side * 95, rotationY: -side * 75 },
                { x: 0, rotationY: 0, duration: .72 }, .36);
              if (heading) tl.fromTo(heading,
                { y: -105, rotationX: -78, transformOrigin: "50% 0%" },
                { y: 0, rotationX: 0, duration: .96,
                  ease: "back.out(1.2)" }, .52);
              if (summary) tl.fromTo(summary,
                { x: side * 90, clipPath: "inset(0 100% 0 0)" },
                { x: 0, clipPath: "inset(0 0 0 0)", duration: .9 }, .77);
              if (usageTitle) tl.fromTo(usageTitle,
                { y: -48, rotationX: -62 },
                { y: 0, rotationX: 0, duration: .68 }, .95);
              if (usages.length) tl.fromTo(usages,
                { x: side * 92, rotationY: side * -48, scale: .83 },
                { x: 0, rotationY: 0, scale: 1,
                  duration: .78, stagger: .20, ease: "power3.out" }, 1.12);
              if (actions) tl.fromTo(actions,
                { x: side * 70, y: 36, rotationY: side * -27 },
                { x: 0, y: 0, rotationY: 0, duration: .73 }, 1.65);
              appendHold(tl, .13);
              skillTimelines.push(tl);
              registerIdleScene(tl,
                () => layoutTop(card) - window.scrollY,
                () => card.offsetHeight, 1.40);
            });
            if (count) ScrollTrigger.refresh();
          };
          registerSkills();
          let skillsFrame = 0;
          const skillsObserver = new MutationObserver(() => {
            cancelAnimationFrame(skillsFrame);
            skillsFrame = requestAnimationFrame(registerSkills);
          });
          skillsObserver.observe(skillsGrid, { childList: true });
          cleanups.push(() => {
            skillsObserver.disconnect();
            cancelAnimationFrame(skillsFrame);
            skillTimelines.forEach((tl) => {
              tl.scrollTrigger?.kill();
              tl.kill();
            });
            gsap.set(skillsGrid.querySelectorAll(
              ".skill-card, .skill-index, .skill-domain, .skill-card h3, .skill-summary, .skill-usage h4, .skill-usage li, .skill-actions"
            ), { clearProps: "transform,opacity,visibility,clipPath" });
          });
        }

        // Chronological, connected progress: marker -> glass step -> year
        // -> idea -> detail. Desktop line grows as source reaches destination.
        const timelineGrid = document.querySelector(".timeline");
        const phases = gsap.utils.toArray(".timeline .phase");
        if (timelineGrid && phases.length) {
          const makePhase = (tl, phase, at) => {
            const dot = phase.querySelector(".phase-dot");
            const glass = phase.querySelector(".phase-glass");
            const year = phase.querySelector("time");
            const heading = phase.querySelector("h3");
            const detail = phase.querySelector("p");
            if (dot) tl.fromTo(dot,
              { x: -85, y: 55, rotation: -180, scale: .40 },
              { x: 0, y: 0, rotation: 0, scale: 1,
                duration: .75, ease: "back.out(1.5)" }, at);
            if (glass) tl.fromTo(glass,
              { x: desktop ? -160 : -75, y: -44,
                rotationY: -62, scale: .78,
                transformPerspective: 1200, transformOrigin: "0% 50%" },
              { x: 0, y: 0, rotationY: 0, scale: 1,
                duration: 1.65, ease: "sine.inOut" }, at + .18);
            if (year) tl.fromTo(year,
              { x: 96, rotationY: -65 },
              { x: 0, rotationY: 0, duration: .65 }, at + .42);
            if (heading) tl.fromTo(heading,
              { y: -80, rotationX: -78, transformOrigin: "50% 0%" },
              { y: 0, rotationX: 0,
                duration: .76, ease: "power3.out" }, at + .55);
            if (detail) tl.fromTo(detail,
              { x: 75, clipPath: "inset(0 100% 0 0)" },
              { x: 0, clipPath: "inset(0 0 0 0)", duration: .72 }, at + .74);
          };
          if (desktop) {
            timelineGrid.classList.add("motion-line");
            gsap.set(timelineGrid, { "--motion-line": 0 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: timelineGrid,
                ...createRange(timelineGrid, .93, .68),
                scrub: true, onUpdate: synchronizeScene,
                invalidateOnRefresh: true
              }
            });
            phases.forEach((phase, index) => makePhase(tl, phase, index * 1.28));
            tl.fromTo(timelineGrid, { "--motion-line": 0 },
              { "--motion-line": 1, duration: 3.35, ease: "none" }, .12);
            appendHold(tl, .10);
            registerIdleScene(tl,
              () => layoutTop(timelineGrid) - window.scrollY,
              () => timelineGrid.offsetHeight, 1.75);
            cleanups.push(() => {
              timelineGrid.classList.remove("motion-line");
              timelineGrid.style.removeProperty("--motion-line");
            });
          } else {
            phases.forEach((phase) => {
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: timelineGrid,
                  ...createRange(phase, .92, .50),
                  scrub: true, onUpdate: synchronizeScene,
                  invalidateOnRefresh: true
                }
              });
              makePhase(tl, phase, 0);
              appendHold(tl, .12);
              registerIdleScene(tl,
                () => layoutTop(phase) - window.scrollY,
                () => phase.offsetHeight, 1.08);
            });
          }
        }

        // Philosophical principles are panels unfolding from a hinge:
        // frame -> symbol -> number -> proposition -> explanation.
        const principlesGrid = document.querySelector(".principles");
        const principles = gsap.utils.toArray(".principles .principle");
        if (principlesGrid && principles.length) {
          const rowSize = desktop ? principles.length : 1;
          for (let index = 0; index < principles.length; index += rowSize) {
            const group = principles.slice(index, index + rowSize);
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: principlesGrid,
                ...createRange(group[0], .92, desktop ? .38 : .42),
                scrub: true, onUpdate: synchronizeScene,
                invalidateOnRefresh: true
              }
            });
            group.forEach((card, column) => {
              const at = column * .58;
              const icon = card.querySelector(".principle-icon");
              const number = card.querySelector(".principle-no");
              const heading = card.querySelector("h3");
              const description = card.querySelector("p");
              tl.fromTo(card,
                { rotationY: -72, x: -125, scale: .80,
                  transformPerspective: 1200, transformOrigin: "0% 50%" },
                { rotationY: 0, x: 0, scale: 1,
                  duration: 1.65, ease: "sine.inOut" }, at);
              if (icon) tl.fromTo(icon,
                { x: -68, y: 35, rotation: -160, scale: .42 },
                { x: 0, y: 0, rotation: 0, scale: 1,
                  duration: .88, ease: "back.out(1.4)" }, at + .29);
              if (number) tl.fromTo(number,
                { x: 60, y: -65, rotationY: -68 },
                { x: 0, y: 0, rotationY: 0, duration: .78 }, at + .38);
              if (heading) tl.fromTo(heading,
                { y: -80, rotationX: -82 },
                { y: 0, rotationX: 0,
                  duration: .86, ease: "back.out(1.12)" }, at + .60);
              if (description) tl.fromTo(description,
                { x: -68, clipPath: "inset(0 100% 0 0)" },
                { x: 0, clipPath: "inset(0 0 0 0)", duration: .74 }, at + .92);
            });
            appendHold(tl, .12);
            registerIdleScene(tl,
              () => layoutTop(group[0]) - window.scrollY,
              () => group[0].offsetHeight, desktop ? 1.45 : 1.10);
          }
        }

        // Footer stays still, visible, readable and clickable.
        // A token fade-in would violate the anti-microanimation Skill v1.4.
        // Cover restored positions when no wheel event occurred after loading.
        // Schedule only while this responsive animation context is alive.
        requestAnimationFrame(() => {
          if (idleSceneActive && idleRevealTimer === null) {
            idleRevealTimer = window.setTimeout(settleVisibleScenes, 480);
          }
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
