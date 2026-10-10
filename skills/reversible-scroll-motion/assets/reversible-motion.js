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
        // A coherent top-down letter assembly; no random alternating flips.
        gsap.set(split.chars, {
          yPercent: -125, rotationX: -65, autoAlpha: .75
        });
        tl.to(split.chars, {
          yPercent: 0, rotationX: 0, autoAlpha: 1, duration: 1.16,
          ease: "power2.out", stagger: .042
        }, .1);
        cleanups.push(() => split.revert());
      } else {
        tl.fromTo(title, { y: -80, rotationX: -65, autoAlpha: .7 },
          { y: 0, rotationX: 0, autoAlpha: 1,
            duration: 1.1, ease: "power1.inOut" }, .1);
      }
      if (note) tl.fromTo(note,
        { x: 22, autoAlpha: 0, clipPath: "inset(0 100% 0 0)" },
        { x: 0, autoAlpha: 1, clipPath: "inset(0 0 0 0)",
          duration: .85, ease: "power1.inOut" }, .27);
      holdLastFrame(tl);
    });

    // Layout-grounded composition, not eight arbitrary flights.
    // The card establishes a spatial frame; heading and summary then
    // physically unfold as meaningful children. Opacity is secondary.
    document.querySelectorAll('[data-motion-scene="cards"]').forEach(grid => {
      const cards = Array.from(grid.querySelectorAll("[data-motion-item]"));
      const rowSize = desktop ? 2 : 1;
      for (let i = 0; i < cards.length; i += rowSize) {
        const group = cards.slice(i, i + rowSize);
        const tl = createScene(grid, group[0], {
          entry: .9, travel: desktop ? .62 : .56
        });
        if (!tl) continue;
        group.forEach((card, inRow) => {
          // Desktop direction follows real column, not ordinal roulette.
          const side = desktop ? (inRow === 0 ? -1 : 1) : -1;
          const at = inRow * .42;
          tl.fromTo(card,
            {
              x: side * (desktop ? 200 : 85),
              y: desktop ? 55 : 30,
              rotationY: side * -20, scale: .84, autoAlpha: .65,
              transformPerspective: 1200
            },
            {
              x: 0, y: 0, rotationY: 0, scale: 1, autoAlpha: 1,
              duration: 1.05, ease: "power2.out"
            }, at);
          const heading = card.querySelector("h3");
          const detail = card.querySelector("p");
          if (heading) tl.fromTo(heading,
            { y: -50, rotationX: -62, transformOrigin: "50% 0%", autoAlpha: .7 },
            { y: 0, rotationX: 0, autoAlpha: 1,
              duration: .72, ease: "power2.out" }, at + .39);
          if (detail) tl.fromTo(detail,
            { x: side * 45, clipPath: "inset(0 100% 0 0)" },
            { x: 0, clipPath: "inset(0 0 0 0)",
              duration: .68, ease: "power2.inOut" }, at + .68);
        });
        holdLastFrame(tl);
      }
    });

    // Timeline stages must be sequential and legible, not one row of
    // independent fades. Each stage leads with its marker then its facts.
    document.querySelectorAll('[data-motion-scene="timeline"]').forEach(grid => {
      const entries = Array.from(grid.querySelectorAll("[data-motion-item]"));
      const rowSize = desktop ? entries.length : 1;
      for (let i = 0; i < entries.length; i += rowSize) {
        const group = entries.slice(i, i + rowSize);
        const tl = createScene(grid, group[0], {
          entry: .9, travel: desktop ? .65 : .49
        });
        if (!tl) continue;
        group.forEach((entry, offset) => {
          const at = offset * .82;
          const marker = entry.querySelector(".step");
          const heading = entry.querySelector("h3");
          const detail = entry.querySelector("p");
          tl.fromTo(entry,
            { x: desktop ? -96 : -68, y: 38, scale: .85,
              rotationY: -30, autoAlpha: .72 },
            { x: 0, y: 0, scale: 1, rotationY: 0, autoAlpha: 1,
              duration: .85, ease: "power2.out" }, at);
          if (marker) tl.fromTo(marker,
            { scale: .55, rotation: -85, autoAlpha: .7 },
            { scale: 1, rotation: 0, autoAlpha: 1,
              duration: .5, ease: "back.out(1.4)" }, at + .2);
          if (heading) tl.fromTo(heading,
            { y: -40, rotationX: -55 },
            { y: 0, rotationX: 0,
              duration: .63, ease: "power2.out" }, at + .39);
          if (detail) tl.fromTo(detail,
            { x: -32, clipPath: "inset(0 65% 0 0)" },
            { x: 0, clipPath: "inset(0 0 0 0)",
              duration: .56, ease: "power2.inOut" }, at + .56);
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
          const at = offset * .38;
          // Unfold a solid spatial plane, then assemble its idea and details.
          tl.fromTo(card,
            { transformPerspective: 1100, transformOrigin: "0% 50%",
              rotationY: -64, scale: .85, autoAlpha: .75 },
            { rotationY: 0, scale: 1, autoAlpha: 1,
              duration: .96, ease: "power2.out" }, at);
          const heading = card.querySelector("h3");
          const description = card.querySelector("p");
          if (heading) tl.fromTo(heading,
            { rotationX: -62, y: -40 },
            { rotationX: 0, y: 0, duration: .65 }, at + .34);
          if (description) tl.fromTo(description,
            { x: -35, clipPath: "inset(0 65% 0 0)" },
            { x: 0, clipPath: "inset(0 0 0 0)",
              duration: .62, ease: "power2.inOut" }, at + .56);
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
