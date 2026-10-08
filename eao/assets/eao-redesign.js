(() => {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    const root = document.documentElement;
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");

    /* ───────────────────────── Theme */
    const themeToggle = document.querySelector(".theme-toggle");
    const themeColorMeta = document.querySelector("#eao-theme-color");

    const storedTheme = () => {
      try {
        const value = localStorage.getItem("eao-theme");
        return value === "light" || value === "dark" ? value : null;
      } catch (_) {
        return null;
      }
    };

    const currentTheme = () =>
      root.dataset.theme === "dark" ? "dark" : "light";

    const updateThemeUI = () => {
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
      if (themeColorMeta) {
        themeColorMeta.setAttribute("content", dark ? "#0d1514" : "#f7f9f8");
      }
    };

    const applyTheme = (theme, { persist = false, animate = false } = {}) => {
      const commit = () => {
        root.dataset.theme = theme;
        root.style.colorScheme = theme;
        if (persist) {
          try {
            localStorage.setItem("eao-theme", theme);
          } catch (_) {}
        }
        updateThemeUI();
      };

      if (
        animate &&
        !reduceMotionQuery.matches &&
        typeof document.startViewTransition === "function"
      ) {
        document.startViewTransition(commit);
      } else {
        commit();
      }

      if (animate && window.gsap && themeToggle && !reduceMotionQuery.matches) {
        window.gsap.fromTo(
          themeToggle.querySelector(".theme-toggle-track"),
          { rotation: -24, scale: 0.82 },
          { rotation: 0, scale: 1, duration: 0.46, ease: "back.out(1.8)" }
        );
      }
    };

    updateThemeUI();

    themeToggle?.addEventListener("click", () => {
      applyTheme(currentTheme() === "dark" ? "light" : "dark", {
        persist: true,
        animate: true
      });
    });

    const onSystemThemeChange = (event) => {
      if (storedTheme()) return;
      applyTheme(event.matches ? "dark" : "light", {
        persist: false,
        animate: true
      });
    };

    if (systemThemeQuery.addEventListener) {
      systemThemeQuery.addEventListener("change", onSystemThemeChange);
    } else if (systemThemeQuery.addListener) {
      systemThemeQuery.addListener(onSystemThemeChange);
    }

    /* ───────────────────────── Navigation */
    const navSections = document.querySelector(".nav-sections");
    const navLinks = Array.from(document.querySelectorAll(".nav-section-link"));
    const sections = navLinks
      .map((link) => {
        const id = link.dataset.navTarget;
        const target = id ? document.getElementById(id) : null;
        return target ? { link, target } : null;
      })
      .filter(Boolean);

    const centerNavLink = (link, smooth = true) => {
      if (!navSections || !link) return;
      if (navSections.scrollWidth <= navSections.clientWidth + 2) return;

      const left =
        link.offsetLeft -
        (navSections.clientWidth - link.offsetWidth) / 2;

      navSections.scrollTo({
        left: Math.max(0, left),
        behavior: smooth && !reduceMotionQuery.matches ? "smooth" : "auto"
      });
    };

    const moveIndicator = (link, { instant = false, center = false } = {}) => {
      if (!navSections || !link) return;

      if (instant) navSections.classList.add("nav-instant");

      navSections.style.setProperty("--nav-x", `${link.offsetLeft}px`);
      navSections.style.setProperty("--nav-w", `${link.offsetWidth}px`);
      navSections.classList.add("nav-ready");

      if (center) centerNavLink(link, !instant);

      if (instant) {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            navSections.classList.remove("nav-instant");
          });
        });
      }
    };

    const setActive = (link, options = {}) => {
      if (!link) return;
      navLinks.forEach((item) => {
        const active = item === link;
        item.classList.toggle("is-active", active);
        if (active) item.setAttribute("aria-current", "page");
        else item.removeAttribute("aria-current");
      });
      moveIndicator(link, options);
    };

    navLinks.forEach((link) => {
      link.addEventListener("click", (event) => {
        const item = sections.find(({ link: navLink }) => navLink === link);
        if (!item) return;

        event.preventDefault();
        setActive(link, { center: true });

        const top = window.scrollY + item.target.getBoundingClientRect().top -
          (document.querySelector("nav")?.offsetHeight || 0) - 24;
        window.scrollTo({
          top: Math.max(0, top),
          behavior: reduceMotionQuery.matches ? "auto" : "smooth"
        });

        const hash = link.getAttribute("href");
        if (hash && history.replaceState) {
          history.replaceState(null, "", hash);
        }
      });
    });

    const firstActive =
      navLinks.find((link) => link.classList.contains("is-active")) || navLinks[0];

    requestAnimationFrame(() => {
      moveIndicator(firstActive, { instant: true, center: true });
    });

    let resizeFrame = 0;
    window.addEventListener("resize", () => {
      cancelAnimationFrame(resizeFrame);
      resizeFrame = requestAnimationFrame(() => {
        const active =
          navLinks.find((link) => link.classList.contains("is-active")) || navLinks[0];
        moveIndicator(active, { instant: true });
      });
    });

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;

    if (gsap && ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      sections.forEach(({ link, target }) => {
        ScrollTrigger.create({
          trigger: target,
          start: "top 48%",
          end: "bottom 48%",
          onEnter: () => setActive(link, { center: true }),
          onEnterBack: () => setActive(link, { center: true })
        });
      });
    } else if ("IntersectionObserver" in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const item = sections.find(({ target }) => target === visible.target);
          if (item) setActive(item.link, { center: true });
        },
        {
          rootMargin: "-28% 0px -58% 0px",
          threshold: [0, 0.1, 0.25, 0.5]
        }
      );
      sections.forEach(({ target }) => observer.observe(target));
    }

    /* ───────────────────────── Reading progress (nonblocking) */
    const nav = document.querySelector("nav");
    let progressFrame = 0;
    const updateProgress = () => {
      const maximum = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      const percent = Math.min(100, Math.max(0, window.scrollY / maximum * 100));
      nav?.style.setProperty("--scroll-progress", `${percent.toFixed(2)}%`);
    };
    const scheduleProgress = () => {
      if (progressFrame) return;
      progressFrame = requestAnimationFrame(() => {
        progressFrame = 0;
        updateProgress();
      });
    };
    window.addEventListener("scroll", scheduleProgress, { passive: true });
    window.addEventListener("resize", scheduleProgress);
    requestAnimationFrame(updateProgress);

    /* ───────────────────────── One purposeful motion system
       Never animate the grid items themselves: transforms can cause misaligned
       department cards, especially with responsive layouts. */
    if (gsap && ScrollTrigger && !reduceMotionQuery.matches) {
      const heroItems = [
        document.querySelector(".hero h1"),
        document.querySelector(".hero .lead"),
        document.querySelector(".hero .actions")
      ].filter(Boolean);
      if (heroItems.length) {
        gsap.fromTo(heroItems,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1, y: 0, duration: .72, stagger: .095,
            ease: "power2.out", clearProps: "all"
          }
        );
      }
      gsap.utils.toArray("main section").forEach((section) => {
        const elements = [
          section.querySelector(".kicker"),
          section.querySelector(".section-title")
        ].filter(Boolean);
        if (!elements.length) return;
        gsap.fromTo(elements,
          { autoAlpha: 0, y: 18 },
          {
            autoAlpha: 1, y: 0, duration: .7,
            stagger: .08, ease: "power2.out", clearProps: "all",
            scrollTrigger: { trigger: section, start: "top 84%", once: true }
          }
        );
      });
      gsap.utils.toArray(".story-visual").forEach((element) => {
        gsap.fromTo(element, { y: 16 }, {
          y: 0, duration: .8, ease: "power2.out",
          clearProps: "transform",
          scrollTrigger: { trigger: element, start: "top 90%", once: true }
        });
      });
    }

    window.addEventListener("load", () => {
      const active = navLinks.find((link) => link.classList.contains("is-active")) || navLinks[0];
      moveIndicator(active, { instant: true });
      updateProgress();
      if (ScrollTrigger) ScrollTrigger.refresh();
    }, { once: true });
  });
})();
