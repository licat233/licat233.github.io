(() => {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  const iconSvgs = [
    '<circle cx="24" cy="24" r="7"/><circle cx="8" cy="13" r="4"/><circle cx="40" cy="13" r="4"/><circle cx="8" cy="35" r="4"/><circle cx="40" cy="35" r="4"/><path d="M18 20 11 15M30 20l7-5M18 28l-7 5M30 28l7 5"/>',
    '<path d="M12 5h24l10 10v34H12z"/><path d="M36 5v12h12M19 28h20M19 36h16"/>',
    '<circle cx="24" cy="23" r="15"/><path d="m35 34 12 12M18 23h12M24 17v12"/>',
    '<ellipse cx="28" cy="11" rx="18" ry="7"/><path d="M10 11v14c0 4 8 7 18 7s18-3 18-7V11M10 25v14c0 4 8 7 18 7s18-3 18-7V25"/>',
    '<path d="M8 10h40v27H27l-11 10V37H8z"/><path d="M18 21h20M18 28h14"/>',
    '<path d="M28 5 47 12v14c0 12-8 20-19 25C17 46 9 38 9 26V12z"/><path d="m19 27 6 6 12-14"/>',
    '<path d="M6 16h18l5 6h25v26H6z"/><path d="M6 16V9h17l5 7"/>',
    '<circle cx="15" cy="28" r="7"/><circle cx="43" cy="14" r="7"/><circle cx="43" cy="42" r="7"/><path d="m21 25 15-8M21 31l15 8"/>',
    '<rect x="11" y="23" width="34" height="25" rx="4"/><path d="M18 23v-8c0-7 5-11 10-11s10 4 10 11v8M28 33v7"/>',
    '<path d="m28 4 4 13 13 4-13 4-4 13-4-13-13-4 13-4zM47 35l2 6 6 2-6 2-2 6-2-6-6-2 6-2z"/>'
  ];

  const makeBackgroundIcon = (markup, index) => {
    const span = document.createElement("span");
    span.className = "eao-bg-icon";
    span.dataset.iconIndex = String(index);
    span.innerHTML =
      '<svg viewBox="0 0 56 56" aria-hidden="true" focusable="false"><g fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">' +
      markup +
      "</g></svg>";
    return span;
  };

  const buildMotionBackground = () => {
    const rows = document.querySelectorAll(".eao-motion-row");
    if (!rows.length) return [];

    const icons = [];
    const sequenceLength = iconSvgs.length * 3;

    rows.forEach((row, rowIndex) => {
      if (row.querySelector(".eao-motion-inner")) {
        icons.push(...row.querySelectorAll(".eao-bg-icon"));
        return;
      }

      const inner = document.createElement("div");
      inner.className = "eao-motion-inner";

      for (let copy = 0; copy < 2; copy += 1) {
        const track = document.createElement("div");
        track.className = "eao-motion-track";

        for (let index = 0; index < sequenceLength; index += 1) {
          const shifted = (index + rowIndex * 3) % iconSvgs.length;
          const icon = makeBackgroundIcon(iconSvgs[shifted], shifted);
          track.appendChild(icon);
          icons.push(icon);
        }

        inner.appendChild(track);
      }

      row.appendChild(inner);
    });

    return icons;
  };

  ready(() => {
    const root = document.documentElement;
    const reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const systemThemeQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const bgIcons = buildMotionBackground();

    const finePointerQuery = window.matchMedia("(pointer: fine)");
    if (bgIcons.length && finePointerQuery.matches && !reduceMotionQuery.matches) {
      let mouseX = -10000;
      let mouseY = -10000;
      let pointerInside = false;
      let lastPaint = 0;

      const paintIconGlow = (time) => {
        if (!pointerInside) return;

        if (time - lastPaint >= 72) {
          lastPaint = time;

          bgIcons.forEach((icon) => {
            const rect = icon.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;
            const distance = Math.hypot(mouseX - cx, mouseY - cy);

            icon.classList.toggle("is-hot", distance < 46);
            icon.classList.toggle("is-warm", distance >= 46 && distance < 94);
          });
        }

        requestAnimationFrame(paintIconGlow);
      };

      document.addEventListener(
        "pointermove",
        (event) => {
          mouseX = event.clientX;
          mouseY = event.clientY;

          if (!pointerInside) {
            pointerInside = true;
            requestAnimationFrame(paintIconGlow);
          }
        },
        { passive: true }
      );

      document.documentElement.addEventListener("pointerleave", () => {
        pointerInside = false;
        bgIcons.forEach((icon) => icon.classList.remove("is-hot", "is-warm"));
      });
    }

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

        item.target.scrollIntoView({
          behavior: reduceMotionQuery.matches ? "auto" : "smooth",
          block: "start"
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
    const finePointer = window.matchMedia("(pointer: fine)").matches;

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

    /* ───────────────────────── Existing GSAP presentation */
    if (!gsap || reduceMotionQuery.matches) return;

    const heroVisual = document.querySelector(".hero-visual");
    const heroShot = document.querySelector(".hero-shot");

    if (finePointer && heroVisual) {
      const rotateX = gsap.quickTo(heroVisual, "rotationX", {
        duration: 0.55,
        ease: "power3.out"
      });
      const rotateY = gsap.quickTo(heroVisual, "rotationY", {
        duration: 0.55,
        ease: "power3.out"
      });
      const yTo = gsap.quickTo(heroVisual, "y", {
        duration: 0.55,
        ease: "power3.out"
      });

      const move = (event) => {
        const rect = heroVisual.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateX(py * -2.2);
        rotateY(px * 3.2 - 5);
        yTo(-4);
      };

      const leave = () => {
        rotateX(1.5);
        rotateY(-5);
        yTo(0);
      };

      heroVisual.addEventListener("pointermove", move);
      heroVisual.addEventListener("pointerleave", leave);
    }

    if (ScrollTrigger && heroShot) {
      gsap.to(heroShot, {
        yPercent: 4,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.05
        }
      });
    }

    if (ScrollTrigger) {
      ScrollTrigger.batch(".dept-card", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 22, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.56,
              stagger: 0.07,
              ease: "power3.out",
              clearProps: "opacity,visibility"
            }
          );
        }
      });
    }

    window.addEventListener(
      "load",
      () => {
        const active =
          navLinks.find((link) => link.classList.contains("is-active")) || navLinks[0];
        moveIndicator(active, { instant: true });
        if (ScrollTrigger) ScrollTrigger.refresh();
      },
      { once: true }
    );
  });
})();
