/* EAO reversible entrance choreography.
 * Adapted from skills/reversible-scroll-motion (same repository).
 * DOM/content/layout stay untouched; no pin, spacer, scroll lock or CSS hiding.
 * If GSAP is unavailable or reduced motion is enabled, all content remains visible.
 */
(() => {
  document.addEventListener("DOMContentLoaded", () => {
    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    if (!gsap || !ScrollTrigger) return;
    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();
    media.add({
      motion: "(prefers-reduced-motion: no-preference)",
      wide: "(min-width: 1041px)",
      tablet: "(min-width: 701px) and (max-width: 1040px)",
      compact: "(max-width: 700px)"
    }, (ctx) => {
      if (!ctx.conditions.motion) return;

      const compact = ctx.conditions.compact;
      const scenes = [];
      const cleanups = [];
      const clamp = gsap.utils.clamp(0, 1);
      let idleTimer = null;
      let alive = true;

      // offsetTop/offsetParent measure the untransformed, natural document slot.
      // Never measure animated card bounding rectangles for trigger positions.
      const naturalY = (el) => {
        let top = 0;
        for (let node = el; node; node = node.offsetParent) top += node.offsetTop;
        return top;
      };
      const naturalX = (el) => {
        let left = 0;
        for (let node = el; node; node = node.offsetParent) left += node.offsetLeft;
        return left;
      };

      function scrollRange(top, entry = .89, travel = .4, footer = false) {
        const max = Math.max(1, ScrollTrigger.maxScroll(window));
        const desired = Math.max(0, top - innerHeight * entry);
        const distance = Math.max(54, innerHeight * travel);
        const reserve = footer ? 54 : 70;
        const start = Math.min(desired, Math.max(0, max - reserve));
        const end = Math.max(start + 1, Math.min(max, desired + distance));
        return [start, end];
      }

      function isVisible(scene) {
        const top = scene.top() - scrollY;
        const bottom = top + scene.height();
        const header = document.querySelector("nav");
        const headerBottom = header ? header.getBoundingClientRect().bottom : 0;
        return top < innerHeight * (scene.footer ? .995 : .965)
          && bottom > Math.max(headerBottom + 8, innerHeight * .09);
      }

      function sync(scene) {
        if (!scene.latched) return;
        if (scene.idleTween) {
          // Wheel/touch resumed mid-settle: re-anchor to this *actual* frame.
          scene.base = scene.tl.progress();
          scene.anchor = scrollY;
          scene.idleTween.kill();
          scene.idleTween = null;
        }
        const distance = Math.max(1, scene.trigger.end - scene.trigger.start);
        scene.tl.progress(clamp(scene.base + (scrollY - scene.anchor) / distance));

        // If scrolling back above the natural scene has hidden it, reset it.
        if (scrollY < scene.trigger.start && !isVisible(scene)) {
          scene.tl.progress(0);
          scene.latched = false;
        }
      }

      function sceneFor(parent, focus, { entry = .89, travel = .4, footer = false } = {}) {
        if (!parent || !focus) return null;
        const top = () => naturalY(focus);
        const range = () => scrollRange(top(), entry, travel, footer);
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: parent,
            start: () => range()[0],
            end: () => range()[1],
            scrub: true,
            invalidateOnRefresh: true,
            onUpdate: () => { if (scene.latched) sync(scene); }
          }
        });
        const scene = {
          tl,
          trigger: tl.scrollTrigger,
          top,
          height: () => focus.offsetHeight,
          footer,
          latched: false,
          anchor: 0,
          base: 0,
          idleTween: null
        };
        scenes.push(scene);
        return tl;
      }

      function hold(tl) {
        const duration = tl.duration();
        if (duration) tl.to({ t: 0 }, { t: 1, duration: duration * .12 / .88, ease: "none" }, ">");
      }

      function settleVisible() {
        idleTimer = null;
        if (!alive) return;
        scenes.forEach((scene) => {
          if (!isVisible(scene) || scene.tl.progress() > .998) return;
          if (scene.idleTween) scene.idleTween.kill();
          scene.latched = true;
          scene.anchor = scrollY;
          scene.base = 1;
          scene.idleTween = gsap.to(scene.tl, {
            progress: 1, duration: .58, ease: "power2.out",
            overwrite: "auto",
            onComplete: () => { scene.idleTween = null; }
          });
        });
      }

      function scheduleSettle() {
        if (idleTimer !== null) clearTimeout(idleTimer);
        idleTimer = setTimeout(settleVisible, 480);
      }

      function onScroll() {
        scenes.forEach(sync);
        scheduleSettle();
      }

      // One-time opening for the hero copy. Never animate the sticky nav.
      // Avoid transforming .hero-visual: the existing pointer/tilt owns it.
      if (scrollY < innerHeight * .35) {
        const hero = gsap.timeline({ defaults: { ease: "power2.out" } });
        [
          [".hero .eyebrow", 16, .53],
          [".hero h1", 32, .78],
          [".hero .lead", 24, .64],
          [".hero .actions", 20, .59],
          [".hero .meta", 14, .53]
        ].forEach(([selector, y, duration], i) => {
          const target = document.querySelector(selector);
          if (!target) return;
          hero.fromTo(target, { y, autoAlpha: 0 }, {
            y: 0, autoAlpha: 1, duration,
            clearProps: "transform,opacity,visibility"
          }, i * .12);
        });
      }

      // Chapter headings: controlled at their natural position, readable on idle.
      document.querySelectorAll("main section:not(.hero)").forEach((section) => {
        const title = section.querySelector(".section-title, .cta h2");
        if (!title) return;
        const kicker = section.querySelector(".kicker");
        const intro = section.querySelector(".intro");
        const tl = sceneFor(section, title, { entry: .90, travel: compact ? .33 : .39 });
        if (!tl) return;
        if (kicker) tl.fromTo(kicker, { x: -24, autoAlpha: 0 }, {
          x: 0, autoAlpha: 1, duration: .66, ease: "power1.inOut"
        }, 0);
        tl.fromTo(title, {
          y: compact ? 27 : 43, rotationX: compact ? -8 : -13,
          autoAlpha: 0, transformPerspective: 1000
        }, {
          y: 0, rotationX: 0, autoAlpha: 1,
          duration: 1, ease: "power1.inOut"
        }, .08);
        if (intro) tl.fromTo(intro, { y: 15, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: .67, ease: "power1.inOut"
        }, .3);
        hold(tl);
      });

      // Illustrations and comparison surfaces keep their layout and crop.
      document.querySelectorAll(".story-visual, .contrast-card, .compare-work, .real").forEach((surface) => {
        const tl = sceneFor(surface, surface, { entry: .9, travel: compact ? .35 : .43 });
        if (!tl) return;
        if (surface.matches(".compare-work")) {
          const cols = surface.querySelectorAll(".work-col");
          cols.forEach((col, i) => {
            const direction = i ? 1 : -1;
            const room = direction > 0
              ? innerWidth - naturalX(col) - col.offsetWidth - 8
              : naturalX(col) - 8;
            const x = direction * Math.min(compact ? 20 : 38, Math.max(0, room));
            tl.fromTo(col, {
              x, y: 12, autoAlpha: 0
            }, {
            x: 0, y: 0, autoAlpha: 1, duration: .92, ease: "power1.inOut"
            }, i * .1);
          });
        } else {
          tl.fromTo(surface, { y: compact ? 29 : 42, scale: .978, autoAlpha: 0 }, {
            y: 0, scale: 1, autoAlpha: 1,
            duration: 1, ease: "power1.inOut"
          }, 0);
        }
        hold(tl);
      });

      // Respect the ACTUAL CSS grid rows: desktop 3+2 departments,
      // tablet 2+2+1, phone 1 per row, without reparenting or FLIP layouts.
      const directions = [[-1, 1], [1, -1], [0, 1], [-1, -1],
        [1, 1], [0, -1], [1, 0], [-1, 0]];
      [
        [".dept-grid", ".dept-card", "cards"],
        [".pain-grid", ".pain-card", "cards"],
        [".value-grid", ".value-card", "cards"],
        [".control-grid", ".control-card", "fold"],
        [".tech-grid", ":scope > div", "fold"]
      ].forEach(([gridSelector, cardSelector, style]) => {
        const grid = document.querySelector(gridSelector);
        if (!grid) return;
        const cards = Array.from(grid.querySelectorAll(cardSelector));
        const rows = [];
        cards.forEach((card) => {
          const y = naturalY(card);
          const row = rows.find((group) => Math.abs(group.y - y) < 5);
          if (row) row.cards.push(card);
          else rows.push({ y, cards: [card] });
        });

        rows.forEach((row, rowIndex) => {
          const tl = sceneFor(grid, row.cards[0], {
            entry: .91, travel: compact ? .36 : .43
          });
          if (!tl) return;
          row.cards.forEach((card, i) => {
            const index = cards.indexOf(card);
            if (style === "fold") {
              tl.fromTo(card, {
                rotationY: (index % 2 ? 1 : -1) * (compact ? 8 : 32),
                transformPerspective: 1200,
                transformOrigin: index % 2 ? "100% 50%" : "0% 50%",
                y: 18, autoAlpha: 0
              }, {
                rotationY: 0, y: 0, autoAlpha: 1,
                duration: .91, ease: "power1.inOut"
              }, i * .09);
            } else {
              const [dx, dy] = directions[index % directions.length];
              // Keep sideward flights inside the real viewport (especially 375px).
              const sideRoom = dx > 0
                ? innerWidth - naturalX(card) - card.offsetWidth - 8
                : naturalX(card) - 8;
              const flightX = dx * Math.min(compact ? 23 : 55, Math.max(0, sideRoom));
              tl.fromTo(card, {
                x: flightX,
                y: dy * (compact ? 21 : 37),
                rotation: (index % 2 ? 1 : -1) * (compact ? 2 : 4),
                scale: compact ? .975 : .955, autoAlpha: 0
              }, {
                x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1,
                duration: .93, ease: "power1.inOut"
              }, i * .11);
            }
          });
          hold(tl);
        });
      });

      // FAQ controls stay visible/focusable even before the scroll scene runs.
      // Animate the group heading only; never hide <summary> or its answers.
      document.querySelectorAll(".faq-group").forEach((group) => {
        const heading = group.querySelector("h3");
        const tl = sceneFor(group, heading, { entry: .92, travel: .25 });
        if (!tl) return;
        tl.fromTo(heading, { y: 18, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: .8, ease: "power1.inOut"
        });
        hold(tl);
      });

      // Footer is never required to reach the middle of the viewport.
      const footer = document.querySelector("footer");
      if (footer) {
        const tl = sceneFor(footer, footer, { entry: .985, travel: .13, footer: true });
        if (tl) {
          footer.querySelectorAll(".foot > *").forEach((part, i) => {
            tl.fromTo(part, { y: 16, autoAlpha: 0 }, {
              y: 0, autoAlpha: 1, duration: .8, ease: "power1.inOut"
            }, i * .11);
          });
          hold(tl);
        }
      }

      // Keep the existing FAQ-open microinteraction without duplicating tweens.
      document.querySelectorAll(".faq-item").forEach((item) => {
        const onToggle = () => {
          if (!item.open) return;
          const answer = item.querySelector(".faq-answer");
          if (answer) gsap.fromTo(answer, { y: -6 }, {
            y: 0, duration: .28, ease: "power2.out", clearProps: "transform"
          });
        };
        item.addEventListener("toggle", onToggle);
        cleanups.push(() => item.removeEventListener("toggle", onToggle));
      });

      window.addEventListener("scroll", onScroll, { passive: true });
      const initialFrame = requestAnimationFrame(scheduleSettle);
      const onLoad = () => { ScrollTrigger.refresh(); scheduleSettle(); };
      window.addEventListener("load", onLoad, { once: true });
      const onRefresh = () => scheduleSettle();
      ScrollTrigger.addEventListener("refresh", onRefresh);

      return () => {
        alive = false;
        cancelAnimationFrame(initialFrame);
        clearTimeout(idleTimer);
        window.removeEventListener("scroll", onScroll);
        window.removeEventListener("load", onLoad);
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        scenes.forEach((scene) => scene.idleTween?.kill());
        cleanups.forEach((fn) => fn());
      };
    });
  }, { once: true });
})();
