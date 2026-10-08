/* Portable GSAP controller for the reversible-scroll-motion Agent Skill.
 * No layout mutation, pin, scroll lock, heavy framework or extra runtime.
 * Content is fully visible if GSAP is absent or reduced motion is requested.
 * Adapt [data-motion-*] selectors to the actual site's natural layout. */
(() => {
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);

  const SplitText = window.SplitText || null;
  if (SplitText) gsap.registerPlugin(SplitText);
  const media = gsap.matchMedia();

  media.add({
    desktop: "(min-width: 761px)",
    motion: "(prefers-reduced-motion: no-preference)"
  }, (ctx) => {
    if (!ctx.conditions.motion) return;
    const desktop = ctx.conditions.desktop;
    const scenes = [];
    const byTrigger = new WeakMap();
    const cleanups = [];
    const clamp = gsap.utils.clamp(0, 1);
    const absTop = el => el.getBoundingClientRect().top + window.scrollY;
    let idleTimer = null;
    let alive = true;

    // The range is defined by a NATURAL element position, not animated boxes.
    function rangeAt(naturalTop, startViewportRatio, travelViewportRatio, reserve = 24) {
      const max = Math.max(1, ScrollTrigger.maxScroll(window) - reserve);
      const travel = Math.max(36, Math.round(window.innerHeight * travelViewportRatio));
      const desiredStart = Math.max(0, naturalTop - window.innerHeight * startViewportRatio);
      const end = Math.min(max, desiredStart + travel);
      const start = Math.max(0, Math.min(desiredStart, end - travel));
      return [start, Math.max(start + 1, end)];
    }

    function holdLastFrame(tl, fraction = .15) {
      const active = tl.duration();
      if (active > 0) {
        tl.to({ state: 0 }, {
          state: 1,
          duration: active * fraction / (1 - fraction),
          ease: "none"
        }, ">");
      }
    }

    function visible(scene) {
      const top = scene.naturalTop() - window.scrollY;
      const bottom = top + scene.height();
      const header = document.querySelector(".site-header");
      const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
      const threshold = scene.isFooter ? .985 : .94;
      return top < window.innerHeight * threshold &&
        bottom > Math.max(headerBottom + 32, window.innerHeight * .14);
    }

    function syncLatched(trigger) {
      const scene = byTrigger.get(trigger);
      if (!scene || !scene.latched) return;
      if (scene.idleTween) {
        // Re-anchor from the CURRENT frame if the user resumes during settling.
        scene.base = scene.tl.progress();
        scene.anchorY = window.scrollY;
        scene.idleTween.kill();
        scene.idleTween = null;
      }
      const travel = Math.max(1, trigger.end - trigger.start);
      const progress = clamp(scene.base +
        (window.scrollY - scene.anchorY) / travel);
      scene.tl.progress(progress);

      // A scene completed early may lack enough upward scroll to reach 0.
      // When its natural slot is out of view, reset without leaving a ghost.
      if (window.scrollY < trigger.start && !visible(scene)) {
        scene.tl.progress(0);
        scene.latched = false;
      }
    }

    function createScene(parent, naturalTarget, { entry, travel, footer = false }) {
      if (!parent || !naturalTarget) return null;
      const naturalTop = () => absTop(parent) +
        (parent === naturalTarget ? 0 : naturalTarget.offsetTop);
      const bounds = () => rangeAt(naturalTop(), entry, travel, footer ? 16 : 24);
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: parent,
          start: () => bounds()[0],
          end: () => bounds()[1],
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: syncLatched
        }
      });
      const scene = {
        tl, naturalTop, height: () => naturalTarget.offsetHeight,
        isFooter: footer, latched: false, anchorY: 0, base: 0,
        idleTween: null
      };
      scenes.push(scene);
      byTrigger.set(tl.scrollTrigger, scene);
      return tl;
    }

    function settleVisible() {
      idleTimer = null;
      if (!alive) return;
      scenes.forEach(scene => {
        if (scene.latched || !visible(scene) || scene.tl.progress() >= .999) return;
        scene.latched = true;
        scene.anchorY = window.scrollY;
        scene.base = 1;
        scene.idleTween = gsap.to(scene.tl, {
          progress: 1, duration: .6, ease: "power2.out", overwrite: "auto",
          onComplete: () => { scene.idleTween = null; }
        });
      });
    }

    function onScroll() {
      // ScrollTrigger onUpdate does not fire for every wheel event outside
      // its active range; also synchronize completed scenes here.
      scenes.forEach(scene => syncLatched(scene.tl.scrollTrigger));
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      idleTimer = window.setTimeout(settleVisible, 480);
    }

    // A readable title scene; SplitText is optional.
    document.querySelectorAll('[data-motion-scene="heading"]').forEach(head => {
      const title = head.querySelector("[data-motion-heading]");
      if (!title) return;
      const tl = createScene(head, head, { entry: .87, travel: .40 });
      if (!tl) return;

      const kicker = head.querySelector("[data-motion-kicker]");
      const note = head.querySelector("[data-motion-note]");
      if (kicker) tl.fromTo(kicker, { x: -32, autoAlpha: 0 },
        { x: 0, autoAlpha: 1, duration: .6, ease: "power1.inOut" }, 0);

      if (SplitText && typeof SplitText.create === "function") {
        const split = SplitText.create(title, { type: "chars", mask: "chars" });
        gsap.set(split.chars, {
          yPercent: i => i % 2 ? -120 : 130,
          rotationX: i => i % 2 ? 60 : -60, autoAlpha: 0
        });
        tl.to(split.chars, {
          yPercent: 0, rotationX: 0, autoAlpha: 1, duration: 1.05,
          ease: "power1.inOut", stagger: .035
        }, .1);
        cleanups.push(() => split.revert());
      } else {
        tl.fromTo(title, { y: 60, rotationX: -45, autoAlpha: 0 },
          { y: 0, rotationX: 0, autoAlpha: 1,
            duration: 1.1, ease: "power1.inOut" }, .1);
      }
      if (note) tl.fromTo(note,
        { x: 22, autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
        { x: 0, autoAlpha: 1, clipPath: "inset(0 0 0 0)",
          duration: .85, ease: "power1.inOut" }, .27);
      holdLastFrame(tl);
    });

    // Eight directional flights, preserving actual CSS Grid positions.
    const directions = [
      [-1, -1], [1, -1], [-1, 1], [1, 1],
      [-1, 0], [1, 0], [0, -1], [0, 1]
    ];
    document.querySelectorAll('[data-motion-scene="cards"]').forEach(grid => {
      const cards = Array.from(grid.querySelectorAll("[data-motion-item]"));
      const rowSize = desktop ? 2 : 1;
      gsap.set(cards, { autoAlpha: 0 });
      for (let i = 0; i < cards.length; i += rowSize) {
        const group = cards.slice(i, i + rowSize);
        const tl = createScene(grid, group[0], { entry: .89, travel: desktop ? .53 : .51 });
        if (!tl) continue;

        group.forEach((card, inRow) => {
          const ordinal = i + inRow;
          const [dx, dy] = directions[ordinal % directions.length];
          const rotation = (ordinal % 2 ? 1 : -1) * (desktop ? 12 : 8);
          const x = () => dx * (window.innerWidth + card.offsetWidth + 70);
          const y = () => {
            const distance = window.innerHeight + card.offsetHeight + 50;
            if (dy <= 0) return dy * distance;
            // Do not let an initially transformed card inflate scrollHeight.
            const naturalBottom = absTop(grid) + card.offsetTop + card.offsetHeight;
            const room = Math.max(0, document.body.offsetHeight - naturalBottom - 100);
            return Math.min(distance, room);
          };
          const start = inRow * .1;
          tl.fromTo(card, {
            x, y, scale: desktop ? .72 : .84, rotation,
            autoAlpha: 0, force3D: true
          }, {
            x: () => x() * .07, y: () => y() * .07,
            rotation: rotation * .13, scale: .96, autoAlpha: 1,
            duration: .68, ease: "power1.inOut",
            immediateRender: true
          }, start);
          tl.to(card, {
            x: 0, y: 0, rotation: 0, scale: 1,
            duration: .22, ease: "power2.out"
          }, start + .68);
        });
        holdLastFrame(tl);
      }
    });

    document.querySelectorAll('[data-motion-scene="timeline"]').forEach(grid => {
      const entries = Array.from(grid.querySelectorAll("[data-motion-item]"));
      const rowSize = desktop ? entries.length : 1;
      for (let i = 0; i < entries.length; i += rowSize) {
        const group = entries.slice(i, i + rowSize);
        const tl = createScene(grid, group[0], { entry: .88, travel: .44 });
        if (!tl) continue;
        group.forEach((entry, offset) => {
          tl.fromTo(entry, {
            clipPath: (i + offset) % 2 ? "inset(0 0 100% 0)" : "inset(100% 0 0 0)",
            y: (i + offset) % 2 ? -30 : 30, autoAlpha: 0
          }, {
            clipPath: "inset(0 0 0 0)", y: 0, autoAlpha: 1,
            duration: .9, ease: "power1.inOut"
          }, offset * .1);
        });
        holdLastFrame(tl);
      }
    });

    document.querySelectorAll('[data-motion-scene="principles"]').forEach(grid => {
      const cards = Array.from(grid.querySelectorAll("[data-motion-item]"));
      const rowSize = desktop ? cards.length : 1;
      for (let i = 0; i < cards.length; i += rowSize) {
        const group = cards.slice(i, i + rowSize);
        const tl = createScene(grid, group[0], { entry: .89, travel: .47 });
        if (!tl) continue;
        group.forEach((card, offset) => {
          tl.fromTo(card, {
            transformPerspective: 1100,
            transformOrigin: (i + offset) % 2 ? "100% 50%" : "0% 50%",
            rotationY: (i + offset) % 2 ? 75 : -75,
            scale: .8, autoAlpha: 0
          }, {
            rotationY: 0, scale: 1, autoAlpha: 1,
            duration: 1.05, ease: "power1.inOut"
          }, offset * .1);
        });
        holdLastFrame(tl);
      }
    });

    document.querySelectorAll('[data-motion-scene="footer"]').forEach(footer => {
      const parts = Array.from(footer.querySelectorAll("[data-motion-item]"));
      if (!parts.length) return;
      const tl = createScene(footer, footer, {
        entry: .94, travel: .17, footer: true
      });
      if (!tl) return;
      parts.forEach((part, i) => tl.fromTo(part,
        { y: 25, rotationX: -20, autoAlpha: 0 },
        { y: 0, rotationX: 0, autoAlpha: 1,
          duration: .8, ease: "power1.inOut" }, i * .12));
      holdLastFrame(tl);
    });

    window.addEventListener("scroll", onScroll, { passive: true });
    const frame = window.requestAnimationFrame(() => {
      if (alive && idleTimer === null) idleTimer = window.setTimeout(settleVisible, 480);
    });
    function refreshWhenLoaded() {
      if (alive) ScrollTrigger.refresh();
    }
    window.addEventListener("load", refreshWhenLoaded, { once: true });

    return () => {
      alive = false;
      window.cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("load", refreshWhenLoaded);
      if (idleTimer !== null) window.clearTimeout(idleTimer);
      scenes.forEach(scene => scene.idleTween?.kill());
      cleanups.forEach(fn => fn());
    };
  });
})();
