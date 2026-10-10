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
          // Interactive SVG glass refraction resumes only after scrolling
          // settles; routine backdrop blur and edge optics stay active.
          root.classList.remove("portfolio-is-scrolling");
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
          root.classList.add("portfolio-is-scrolling");
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
          root.classList.remove("portfolio-is-scrolling");
          window.removeEventListener("scroll", onScrollIdleCheck);
          if (idleRevealTimer !== null) window.clearTimeout(idleRevealTimer);
          idleSceneActive = false;
          idleScenes.forEach(scene => scene.idleTween?.kill());
        });

        // Storyboard:
        // Section title = reading order; projects = frame -> identity -> explanation
        // -> tags -> metadata; Skills = index -> name -> use -> actions;
        // journey = chronological cause -> next milestone; principles = structure
        // -> idea -> explanation. Every visible child shares the parent's timeline.
        gsap.utils.toArray(".section-head").forEach((head) => {
          const title = head.querySelector("h2");
          const eyebrow = head.querySelector(".kicker");
          const note = head.querySelector(".section-note");
          if (!title) return;
          const Split = window.SplitText;
          let split = null;
          if (Split) {
            split = Split.create(title, { type: "chars", mask: "chars" });
            // Pre-initialize ALL characters. No alternating random directions,
            // no first/last glyph flash on a reverse or restored scroll.
            gsap.set(split.chars, {
              yPercent: -115, rotationX: -55, scale: .89, autoAlpha: 0
            });
            cleanups.push(() => split.revert());
          }
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: head,
              ...createRange(head, .88, desktop ? .41 : .39),
              scrub: true, onUpdate: synchronizeScene,
              invalidateOnRefresh: true
            }
          });
          if (eyebrow) tl.fromTo(eyebrow,
            { y: 20, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: .42, ease: "power2.out" }, 0);
          if (split) tl.fromTo(split.chars,
            { yPercent: -115, rotationX: -55, scale: .89, autoAlpha: 0 },
            { yPercent: 0, rotationX: 0, scale: 1, autoAlpha: 1,
              stagger: .045, duration: .84, ease: "power2.out" }, .13);
          else tl.fromTo(title,
            { y: -45, rotationX: -35, autoAlpha: 0 },
            { y: 0, rotationX: 0, autoAlpha: 1, duration: .85 }, .13);
          if (note) tl.fromTo(note,
            { y: 26, autoAlpha: 0 },
            { y: 0, autoAlpha: 1, duration: .58, ease: "power2.out" }, .42);
          appendHold(tl);
          registerIdleScene(tl,
            () => layoutTop(head) - window.scrollY, () => head.offsetHeight, .85);
        });

        // Project pairs enter from the side where they actually sit in the
        // composition. Within each glass frame, meaningful information arrives
        // in reading order; optical filter / tint / rim layers are never animated.
        const projectGrid = document.querySelector(".projects");
        const projectCards = gsap.utils.toArray(".projects .project");
        if (projectGrid && projectCards.length) {
          const rowSize = desktop ? 2 : 1;
          for (let index = 0; index < projectCards.length; index += rowSize) {
            const group = projectCards.slice(index, index + rowSize);
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: projectGrid,
                ...groupRange(projectGrid, group[0], .91, desktop ? .58 : .54),
                scrub: true, onUpdate: synchronizeScene,
                invalidateOnRefresh: true
              }
            });
            group.forEach((card, column) => {
              const side = desktop ? (column === 0 ? -1 : 1) : (index % 2 ? 1 : -1);
              const at = column * .46;
              const top = card.querySelector(".project-top");
              const heading = card.querySelector("h3");
              const summary = card.querySelector("p");
              const tags = gsap.utils.toArray(card.querySelectorAll(".tag"));
              const metadata = gsap.utils.toArray(card.querySelectorAll(".project-meta span"));
              tl.fromTo(card,
                { x: side * (desktop ? 190 : 76), y: desktop ? 46 : 34,
                  rotationY: side * -19, scale: .91, autoAlpha: 0 },
                { x: 0, y: 0, rotationY: 0, scale: 1, autoAlpha: 1,
                  duration: .95, ease: "power2.out" }, at);
              if (top) tl.fromTo(top,
                { y: 30, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .4 }, at + .43);
              if (heading) tl.fromTo(heading,
                { y: 35, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .47 }, at + .57);
              if (summary) tl.fromTo(summary,
                { y: 22, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .51 }, at + .79);
              if (tags.length) tl.fromTo(tags,
                { y: 19, scale: .88, autoAlpha: 0 },
                { y: 0, scale: 1, autoAlpha: 1, duration: .35, stagger: .085 },
                at + 1.03);
              if (metadata.length) tl.fromTo(metadata,
                { y: 13, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .32, stagger: .07 },
                at + 1.32);
            });
            appendHold(tl);
            registerIdleScene(tl,
              () => layoutTop(group[0]) - window.scrollY,
              () => group[0].offsetHeight, 1.18);
          }
        }

        // Skills can be appended after page load by portfolio-skills.js.
        // Register each newly discovered card exactly once. No extra library,
        // no independent scroll listeners/timers and no animation of glass layers.
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
                  ...createRange(card, .91, desktop ? .61 : .55),
                  scrub: true, onUpdate: synchronizeScene,
                  invalidateOnRefresh: true
                }
              });
              const top = card.querySelector(".skill-card-top");
              const title = card.querySelector("h3");
              const summary = card.querySelector(".skill-summary");
              const usageTitle = card.querySelector(".skill-usage h4");
              const usages = gsap.utils.toArray(card.querySelectorAll(".skill-usage li"));
              const actions = card.querySelector(".skill-actions");
              tl.fromTo(card,
                { x: side * (desktop ? 132 : 50), y: 42,
                  rotationY: side * -12, scale: .94, autoAlpha: 0 },
                { x: 0, y: 0, rotationY: 0, scale: 1, autoAlpha: 1,
                  duration: .86, ease: "power2.out" }, 0);
              if (top) tl.fromTo(top,
                { y: 25, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .38 }, .4);
              if (title) tl.fromTo(title,
                { y: 32, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .48 }, .55);
              if (summary) tl.fromTo(summary,
                { y: 20, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .46 }, .78);
              if (usageTitle) tl.fromTo(usageTitle,
                { y: 16, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .36 }, .95);
              if (usages.length) tl.fromTo(usages,
                { x: -22, autoAlpha: 0 },
                { x: 0, autoAlpha: 1, duration: .37, stagger: .12 }, 1.11);
              if (actions) tl.fromTo(actions,
                { y: 22, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .4 }, 1.55);
              appendHold(tl);
              skillTimelines.push(tl);
              registerIdleScene(tl,
                () => layoutTop(card) - window.scrollY, () => card.offsetHeight, 1.10);
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
            gsap.set(skillsGrid.querySelectorAll(".skill-card, .skill-card-top, .skill-card h3, .skill-summary, .skill-usage h4, .skill-usage li, .skill-actions"),
              { clearProps: "transform,opacity,visibility" });
          });
        }

        // Journey is chronological, not three unrelated simultaneous reveals.
        // On narrow screens each milestone receives its own visible row trigger.
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
              { scale: .4, rotation: -55, autoAlpha: 0 },
              { scale: 1, rotation: 0, autoAlpha: 1,
                duration: .4, ease: "back.out(1.4)" }, at);
            if (glass) tl.fromTo(glass,
              { x: desktop ? -28 : -20, y: 25, scale: .96, autoAlpha: 0 },
              { x: 0, y: 0, scale: 1, autoAlpha: 1,
                duration: .64, ease: "power2.out" }, at + .11);
            if (year) tl.fromTo(year,
              { y: 15, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: .3 }, at + .32);
            if (heading) tl.fromTo(heading,
              { y: 19, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: .37 }, at + .45);
            if (detail) tl.fromTo(detail,
              { y: 17, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: .42 }, at + .56);
          };
          if (desktop) {
            timelineGrid.classList.add("motion-line");
            gsap.set(timelineGrid, { "--motion-line": 0 });
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: timelineGrid,
                ...createRange(timelineGrid, .91, .66),
                scrub: true, onUpdate: synchronizeScene,
                invalidateOnRefresh: true
              }
            });
            phases.forEach((phase, index) => makePhase(tl, phase, index * 1.02));
            tl.fromTo(timelineGrid, { "--motion-line": 0 },
              { "--motion-line": 1, duration: 2.4, ease: "none" }, .27);
            appendHold(tl);
            registerIdleScene(tl,
              () => layoutTop(timelineGrid) - window.scrollY,
              () => timelineGrid.offsetHeight, 1.50);
            cleanups.push(() => {
              timelineGrid.classList.remove("motion-line");
              timelineGrid.style.removeProperty("--motion-line");
            });
          } else {
            phases.forEach((phase) => {
              const tl = gsap.timeline({
                scrollTrigger: {
                  trigger: timelineGrid,
                  ...createRange(phase, .91, .47),
                  scrub: true, onUpdate: synchronizeScene,
                  invalidateOnRefresh: true
                }
              });
              makePhase(tl, phase, 0);
              appendHold(tl);
              registerIdleScene(tl,
                () => layoutTop(phase) - window.scrollY,
                () => phase.offsetHeight, .90);
            });
          }
        }

        // Three principles explain a philosophy: icon / identifier gives a
        // structure, followed by statement and explanatory text in reading order.
        const principlesGrid = document.querySelector(".principles");
        const principles = gsap.utils.toArray(".principles .principle");
        if (principlesGrid && principles.length) {
          const rowSize = desktop ? principles.length : 1;
          for (let index = 0; index < principles.length; index += rowSize) {
            const group = principles.slice(index, index + rowSize);
            const tl = gsap.timeline({
              scrollTrigger: {
                trigger: principlesGrid,
                ...createRange(group[0], .90, desktop ? .58 : .47),
                scrub: true, onUpdate: synchronizeScene,
                invalidateOnRefresh: true
              }
            });
            group.forEach((card, column) => {
              const at = column * .35;
              const icon = card.querySelector(".principle-icon");
              const number = card.querySelector(".principle-no");
              const heading = card.querySelector("h3");
              const description = card.querySelector("p");
              tl.fromTo(card,
                { rotationY: desktop ? -37 : -20, x: -37,
                  scale: .93, autoAlpha: 0, transformOrigin: "0% 50%" },
                { rotationY: 0, x: 0, scale: 1, autoAlpha: 1,
                  duration: .79, ease: "power2.out" }, at);
              if (icon) tl.fromTo(icon,
                { rotation: -50, scale: .57, autoAlpha: 0 },
                { rotation: 0, scale: 1, autoAlpha: 1,
                  duration: .44, ease: "back.out(1.5)" }, at + .35);
              if (number) tl.fromTo(number,
                { y: -18, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .32 }, at + .42);
              if (heading) tl.fromTo(heading,
                { y: 24, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .47 }, at + .55);
              if (description) tl.fromTo(description,
                { y: 16, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: .43 }, at + .76);
            });
            appendHold(tl);
            registerIdleScene(tl,
              () => layoutTop(group[0]) - window.scrollY,
              () => group[0].offsetHeight, desktop ? 1.18 : .90);
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
              onUpdate: synchronizeScene,
              invalidateOnRefresh: true
            }
          });
          footerParts.forEach((part, index) => {
            tl.fromTo(part,
              { y: -18, rotationX: -24, autoAlpha: 0 },
              { y: 0, rotationX: 0, autoAlpha: 1,
                duration: .75, ease: "power1.inOut" }, index * .14);
          });
          appendHold(tl);
          registerIdleScene(tl,
            () => absTop(footer) - window.scrollY,
            () => footer.offsetHeight);
        }
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
