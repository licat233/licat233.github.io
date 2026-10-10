/* EAO demo-only reversible entrance choreography.
 * Source: eao/assets/eao-scroll-motion.js + skills/reversible-scroll-motion.
 * Only new diagram-specific scenes are added here; production JS is unchanged.
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
      tablet: "(min-width: 901px) and (max-width: 1040px)",
      tabletStack: "(min-width: 701px) and (max-width: 900px)",
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
        return top < innerHeight * scene.visibleThreshold
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

      function sceneFor(parent, focus, {
        entry = .89, travel = .4, footer = false,
        visibleThreshold = null, settleDuration = .58
      } = {}) {
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
          visibleThreshold: visibleThreshold ?? (footer ? .995 : .965),
          settleDuration,
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
            progress: 1, duration: scene.settleDuration, ease: "power1.inOut",
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

      // Split only after GSAP is present and motion has been accepted.
      // The heading retains one accessible name; visual glyph spans are
      // aria-hidden and reverted on matchMedia teardown.
      function splitHeadingGlyphs(title) {
        if (title.children.length || !title.textContent.trim()) return null;
        const original = title.textContent;
        const fragment = document.createDocumentFragment();
        const tokenize = /([A-Za-z0-9]+(?:[-'][A-Za-z0-9]+)*|\\s+|[^\\s])/gu;
        const glyphs = [];
        for (const match of original.matchAll(tokenize)) {
          const token = match[0];
          if (/^\\s+$/u.test(token)) {
            fragment.appendChild(document.createTextNode(token));
            continue;
          }
          const latin = /^[A-Za-z0-9]/.test(token);
          const word = latin ? document.createElement("span") : null;
          if (word) word.className = "eao-fall-word";
          for (const part of Array.from(token)) {
            const glyph = document.createElement("span");
            glyph.className = "eao-fall-char";
            glyph.textContent = part;
            glyphs.push(glyph);
            (word || fragment).appendChild(glyph);
          }
          if (word) fragment.appendChild(word);
        }
        if (!glyphs.length) return null;
        title.replaceChildren(fragment);
        title.setAttribute("aria-label", original);
        glyphs.forEach((g) => g.setAttribute("aria-hidden", "true"));
        cleanups.push(() => {
          title.textContent = original;
          title.removeAttribute("aria-label");
        });
        return glyphs;
      }

      // One-time opening for the hero copy. Never animate the sticky nav.
      // Avoid transforming .hero-visual: the existing pointer/tilt owns it.
      if (scrollY < innerHeight * .35) {
        const hero = gsap.timeline({ defaults: { ease: "power2.out" } });
        [
          [".hero .eyebrow", 16, .53],
          [".hero h1", 65, .85],
          [".hero .lead", 45, .72],
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
        const chars = splitHeadingGlyphs(title);
        if (chars) {
          // All glyphs are initialized together: none flashes while a
          // staggered tween waits to begin. Every glyph drops TOP -> DOWN.
          const each = Math.min(.042, .95 / Math.max(1, chars.length - 1));
          gsap.set(chars, {
            y: compact ? -46 : -92,
            rotationX: compact ? -34 : -63,
            scale: compact ? .94 : .85,
            autoAlpha: 0,
            transformPerspective: 900,
            transformOrigin: "50% 0%"
          });
          tl.to(chars, {
            y: 0, rotationX: 0, scale: 1, autoAlpha: 1,
            duration: .62,
            ease: "power1.inOut",
            stagger: { each, from: "start" }
          }, .08);
        } else {
          tl.fromTo(title, { y: -42, autoAlpha: 0 }, {
            y: 0, autoAlpha: 1, duration: .9, ease: "power1.inOut"
          }, .08);
        }
        if (intro) tl.fromTo(intro, { y: 15, autoAlpha: 0 }, {
          y: 0, autoAlpha: 1, duration: .67, ease: "power1.inOut"
        }, .3);
        hold(tl);
      });

      // Independent illustration scene: comparison panels have their own
      // narrative, and must NOT receive a second competing parent tween.
      document.querySelectorAll(".story-visual, .contrast-card, .real").forEach((surface) => {
        const tl = sceneFor(surface, surface, { entry: .9, travel: compact ? .35 : .43 });
        if (!tl) return;
        tl.fromTo(surface, { y: compact ? 39 : 100, scale: compact ? .96 : .91, autoAlpha: 0 }, {
          y: 0, scale: 1, autoAlpha: 1, duration: 1, ease: "power1.inOut"
        }, 0);
        hold(tl);
      });

      // Five real steps in EACH workflow (before/after), not five decorative
      // simultaneous fades. The card enters first; item 1 then item 2...
      // Within each step, icon and text appear in that order. Two separate
      // panel scenes respect stacked mobile viewports: a below-fold "after"
      // column must not play just because "before" entered.
      const workComparison = document.querySelector("#work .compare-work");
      if (workComparison && workComparison.offsetWidth) {
        const columns = [...workComparison.querySelectorAll(":scope > .work-col")];
        // Read the actual layout, not just the named breakpoint: at 768px
        // the columns stack although 'compact' is false.
        const stacked = columns.length === 2 &&
          Math.abs(naturalY(columns[0]) - naturalY(columns[1])) > 10;
        columns.forEach((column, colIndex) => {
          if (!column.offsetWidth) return;
          const items = [...column.querySelectorAll("ol > li")];
          if (items.length !== 5) return;
          const heading = column.querySelector(".work-head");
          const parts = items.map(item => ({
            item,
            icon: item.querySelector(".work-step-icon"),
            text: item.querySelector(".work-step-text")
          }));
          const tl = sceneFor(column, column, {
            entry: compact ? .90 : .89,
            travel: compact ? .64 : .82,
            // Give the 5 visibly different entries time to *read* as a
            // sequence after the wheel stops, while guaranteeing completion.
            settleDuration: stacked ? .68 : 1.36
          });
          if (!tl) return;

          // Initialize the full list NOW, not at the respective stagger start:
          // later stages must never flash before their own turn.
          // Expressive, visibly travelling workflow stages. Both workflows
          // share logical order but NOT one anonymous fade/slide preset:
          // legacy steps enter from the LEFT, deliberately weighty;
          // EAO steps sweep from the RIGHT with deeper perspective.
          // Mobile retains ~90px travel instead of collapsing to x:0.
          const stepSide = colIndex ? 1 : -1;
          const flightX = Math.min(
            compact ? 118 : 175,
            Math.max(compact ? 86 : 125, innerWidth * (compact ? .27 : .125))
          );
          gsap.set(items, {
            x: stepSide * flightX,
            y: colIndex ? (compact ? -53 : -77) : (compact ? 61 : 82),
            rotationY: stepSide * (compact ? 21 : 31),
            rotationX: colIndex ? -16 : 13,
            rotation: stepSide * (compact ? 4 : 7),
            scale: colIndex ? (compact ? .77 : .69) : (compact ? .82 : .77),
            autoAlpha: 0,
            transformPerspective: 1100,
            transformOrigin: colIndex ? "100% 50%" : "0% 50%"
          });
          parts.forEach(({ icon, text }) => {
            if (icon) gsap.set(icon, {
              scale: colIndex ? .23 : .32,
              rotation: stepSide * (compact ? 35 : 54),
              autoAlpha: 0,
              transformOrigin: "50% 50%"
            });
            if (text) gsap.set(text, {
              x: stepSide * (compact ? 27 : 55),
              y: colIndex ? -24 : 25,
              scale: .86,
              autoAlpha: 0
            });
          });
          // Contrasting yet coherent movements: legacy slides from left,
          // EAO arrives from right. The original glass panels remain intact.
          const dir = colIndex ? 1 : -1;
          const room = dir > 0
            ? innerWidth - naturalX(column) - column.offsetWidth - 36
            : naturalX(column) - 36;
          // The optical column travels too, but stays inside section bounds.
          // Prefer vertical perspective on narrow displays with little side room.
          const enteringX = compact ? dir * 24 : dir * Math.min(94, Math.max(0, room));
          tl.fromTo(column, {
            x: enteringX, y: compact ? 78 : 96,
            rotationY: compact ? 0 : dir * 15,
            rotationX: compact ? -12 : -6,
            scale: compact ? .89 : .85, autoAlpha: 0,
            transformPerspective: 1100
          }, {
            x: 0, y: 0, rotationY: 0, rotationX: 0, scale: 1,
            autoAlpha: 1, duration: 1.04, ease: "power2.out"
          }, 0);
          if (heading) {
            tl.fromTo(heading, { y: 18, autoAlpha: .3 }, {
              y: 0, autoAlpha: 1, duration: .42, ease: "power1.inOut"
            }, .56);
          }
          if (stacked) {
            // As each step reaches the viewport, animate it in-place.
            // A barely visible EAO card must NOT settle 5 below-fold rows.
            // Parent scene comes first; each real step owns a visibility
            // trigger but reuses the shared idle/reverse controller.
            hold(tl);
            parts.forEach(({ item, icon, text }) => {
              const stepTl = sceneFor(column, item, {
                entry: compact ? .88 : .86,
                travel: compact ? .25 : .31,
                // The final row can be only 20px visible at the bottom:
                // do not fast-forward it until it enters the reading area.
                visibleThreshold: .91,
                settleDuration: .78
              });
              if (!stepTl) return;
              stepTl.to(item, {
                x: 0, y: 0, rotationY: 0, rotationX: 0, rotation: 0, scale: 1,
                autoAlpha: 1, duration: .94,
                ease: colIndex ? "power3.out" : "power2.out"
              }, 0);
              if (icon) stepTl.to(icon, {
                scale: 1, rotation: 0, autoAlpha: 1,
                duration: .62, ease: "back.out(1.12)"
              }, .12);
              if (text) stepTl.to(text, {
                x: 0, y: 0, scale: 1, autoAlpha: 1, duration: .70,
                ease: "power2.out"
              }, .21);
              hold(stepTl);
            });
          } else {
            // Side-by-side desktop: the two 1→5 timelines read like a
            // comparison, with their own contrasting entry directions.
            parts.forEach(({ item, icon, text }, i) => {
              const at = 1.06 + i * 1.08;
              tl.to(item, {
                x: 0, y: 0, rotationY: 0, rotationX: 0, rotation: 0, scale: 1,
                autoAlpha: 1, duration: .94,
                ease: colIndex ? "power3.out" : "power2.out"
              }, at);
              if (icon) tl.to(icon, {
                scale: 1, rotation: 0, autoAlpha: 1,
                duration: .62, ease: "back.out(1.12)"
              }, at + .12);
              if (text) tl.to(text, {
                x: 0, y: 0, scale: 1, autoAlpha: 1, duration: .70,
                ease: "power2.out"
              }, at + .21);
            });
            hold(tl);
          }
        });
      }

      // Real-enterprise reference: the big glass container enters first;
      // its internal facts then settle individually, in the actual grid order.
      const realItems = document.querySelector(".real .real-items");
      if (realItems && realItems.offsetWidth) {
        const items = [...realItems.querySelectorAll(":scope > span")];
        const rows = [];
        items.forEach(item => {
          const top = naturalY(item);
          let row = rows.find(r => Math.abs(r.top - top) < 5);
          if (!row) { row = { top, items: [] }; rows.push(row); }
          row.items.push(item);
        });
        rows.forEach(row => {
          const tl = sceneFor(realItems, row.items[0], {
            entry: compact ? .93 : .86,
            travel: compact ? .33 : .38
          });
          if (!tl) return;
          row.items.forEach((item, i) => {
            tl.fromTo(item, {
              y: compact ? 27 : 48,
              rotationX: compact ? -12 : -35,
              scale: compact ? .96 : .89,
              autoAlpha: 0,
              transformPerspective: 950
            }, {
              y: 0, rotationX: 0, scale: 1,
              autoAlpha: 1, duration: .82,
              ease: "power1.inOut"
            }, i * .46);
          });
          hold(tl);
        });
      }

      // Parent and child movement MUST belong to the same timeline.
      // Separate triggers caused last-row facts to complete before their
      // parent card arrived. The shared idle completion then acts on both.
      function nestedParts(card) {
        const map = [
          [".dept-card", ":scope > h3, :scope > ul > li"],
          [".eao-org-card", ":scope > .eao-org-content > h3, :scope > .eao-org-content > ul > li"],
          [".value-card", ":scope > b, :scope > h3, :scope > p"],
          [".control-card", ":scope > h3, :scope > p"],
          [".eao-method-card", ":scope > .eao-method-card-content > .eao-method-card-heading, :scope > .eao-method-card-content > .eao-method-icon, :scope > .eao-method-card-content > p"]
        ];
        const type = map.find(([key]) => card.matches(key));
        if (!type) return [];
        return [...card.querySelectorAll(type[1])]
          .filter(el => el.offsetWidth && el.offsetHeight);
      }
      function addNestedArrival(tl, card, start, gap = .13) {
        nestedParts(card).forEach((part, i) => {
          tl.fromTo(part, {
            y: compact ? 15 : 30,
            rotationX: compact ? 0 : -16,
            scale: compact ? .97 : .93,
            autoAlpha: 0,
            transformPerspective: 850
          }, {
            y: 0, rotationX: 0, scale: 1, autoAlpha: 1,
            duration: .49, ease: "power1.inOut"
          }, start + i * (compact ? .11 : gap));
        });
      }

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
            entry: .91, travel: compact ? .45 : .56
          });
          if (!tl) return;
          row.cards.forEach((card, i) => {
            const index = cards.indexOf(card);
            if (style === "fold") {
              tl.fromTo(card, {
                rotationY: (index % 2 ? 1 : -1) * (compact ? 10 : 46),
                transformPerspective: 1200,
                transformOrigin: index % 2 ? "100% 50%" : "0% 50%",
                y: compact ? 32 : 72, scale: compact ? .975 : .90, autoAlpha: 0
              }, {
                rotationY: 0, y: 0, scale: 1, autoAlpha: 1,
                duration: .91, ease: "power1.inOut"
              }, i * .09);
            } else {
              const [dx, dy] = directions[index % directions.length];
              // Keep sideward flights inside the real viewport (especially 375px).
              // Natural offsetLeft ignores the visual viewport edge for some
              // CSS grid children. The untouched rectangle is a safe cap
              // *at setup*, before any GSAP tween on this card starts.
              // This also prevents offscreen row transforms inflating scrollWidth.
              const slot = card.getBoundingClientRect();
              // Leave headroom for the 4deg rotation: even zero X travel
              // expands a rotated rectangle beyond its untouched slot.
              const rim = compact ? 26 : 48;
              const visualRoom = dx > 0
                ? innerWidth - slot.right - rim
                : slot.left - rim;
              const logicalRoom = dx > 0
                ? innerWidth - naturalX(card) - card.offsetWidth - rim
                : naturalX(card) - rim;
              const sideRoom = Math.max(0, Math.min(visualRoom, logicalRoom));
              const flightX = dx * Math.min(compact ? 30 : 110, sideRoom);
              tl.fromTo(card, {
                x: flightX,
                y: dy * (compact ? 38 : 97),
                rotation: (index % 2 ? 1 : -1) * (compact ? 3 : 8),
                scale: compact ? .955 : .86, autoAlpha: 0
              }, {
                x: 0, y: 0, rotation: 0, scale: 1, autoAlpha: 1,
                duration: .93, ease: "power1.inOut"
              }, i * .11);
            }
            addNestedArrival(tl, card, (style === "fold" ? i * .09 : i * .11) + .68);
          });
          hold(tl);
        });
      });

      // Choreography for the two native glass diagrams in this demo.
      // All triggers use natural/untransformed positions. Transform only the
      // live glass card, never its optical layers or the section layout.
      const subtleReveal = (parent, target, options = {}) => {
        if (!target || !target.offsetWidth || !target.offsetHeight) return;
        const tl = sceneFor(parent, target, {
          entry: options.entry ?? .91,
          travel: options.travel ?? (compact ? .26 : .31)
        });
        if (!tl) return;
        tl.fromTo(target, {
          y: options.y ?? (compact ? 13 : 20), autoAlpha: 0
        }, {
          y: 0, autoAlpha: 1, duration: .86, ease: "power1.inOut"
        }, 0);
        hold(tl);
      };

      // Natural CSS grid row groups: 5 on wide desktop, 3+2 on tablet;
      // method steps: 4 wide, 2+2 on tablet, 1 each on phone.
      function animateGlassRows(grid, selector, kind) {
        if (!grid || !grid.offsetWidth) return;
        const cards = Array.from(grid.querySelectorAll(selector)).filter(card => card.offsetWidth);
        const rows = [];
        cards.forEach((card) => {
          const y = naturalY(card);
          const row = rows.find(group => Math.abs(group.y - y) < 5);
          if (row) row.cards.push(card);
          else rows.push({ y, cards: [card] });
        });
        rows.forEach((row) => {
          const tl = sceneFor(grid, row.cards[0], {
            entry: compact ? .93 : .91,
            travel: compact ? .36 : .51
          });
          if (!tl) return;
          row.cards.forEach((card, i) => {
            const order = cards.indexOf(card);
            // Small, deliberately bounded travel: no card escapes its grid cell
            // far enough to extend the document scrollHeight.
            tl.fromTo(card, {
              x: compact ? 0 : ((order % 2 ? -1 : 1) * (kind === 'methods' ? 94 : 75)),
              y: (compact ? 39 : (kind === 'methods' ? 105 : 115)) * (order % 2 ? 1 : .86),
              rotationY: compact ? 0 : (order % 2 ? 12 : -12),
              rotation: compact ? (order % 2 ? 2 : -2) : (order % 2 ? 5 : -5),
              scale: compact ? .96 : .85,
              autoAlpha: 0, transformPerspective: 1200
            }, {
              x: 0, y: 0, rotationY: 0, rotation: 0, scale: 1, autoAlpha: 1,
              duration: .92, ease: "power1.inOut"
            }, i * .115);
            addNestedArrival(tl, card, i * .115 + .70);
          });
          hold(tl);
        });
      }

      function animateMethodSequence(flow) {
        if (!flow || !flow.offsetWidth) return;
        const cards = [...flow.querySelectorAll(".eao-method-card")].filter(c => c.offsetWidth);
        const rows = [];
        cards.forEach(card => {
          const top = naturalY(card);
          let row = rows.find(r => Math.abs(r.top - top) < 5);
          if (!row) { row = { top, cards: [] }; rows.push(row); }
          row.cards.push(card);
        });
        rows.forEach(row => {
          const tl = sceneFor(flow, row.cards[0], {
            entry: compact ? .92 : .91,
            travel: compact ? .33 : (row.cards.length === 4 ? .83 : .52)
          });
          if (!tl) return;
          row.cards.forEach((card, index) => {
            const stage = index * 2.25;
            const order = cards.indexOf(card);
            const direction = (order % 2 ? 1 : -1);
            tl.fromTo(card, {
              x: compact ? 0 : direction * (row.cards.length === 4 ? 66 : 45),
              y: compact ? 57 : 94,
              rotationY: compact ? 0 : direction * 12,
              rotation: compact ? direction * 2 : direction * 4,
              scale: compact ? .94 : .86,
              autoAlpha: 0, transformPerspective: 1050
            }, {
              x: 0, y: 0, rotationY: 0, rotation: 0, scale: 1,
              autoAlpha: 1, duration: .82, ease: "power1.inOut"
            }, stage);
            addNestedArrival(tl, card, stage + .86, .21);
            const arrow = card.nextElementSibling;
            if (arrow && arrow.matches(".eao-method-arrow") &&
                getComputedStyle(arrow).display !== "none") {
              tl.fromTo(arrow, {
                autoAlpha: 0, scale: .6,
                x: compact ? 0 : -24,
                y: compact ? -12 : 0,
                transformOrigin: "50% 50%"
              }, {
                autoAlpha: 1, scale: 1, x: 0, y: 0,
                duration: .23, ease: "power1.inOut"
              }, stage + 1.98);
            }
          });
          // Keep final position once the complete row has settled.
          hold(tl);
        });
      }

      const org = document.querySelector(".eao-org-diagram");
      if (org && org.offsetWidth) {
        subtleReveal(org, org.querySelector(".eao-org-intro"), {
          entry: .90, travel: compact ? .22 : .28, y: 14
        });
        const center = org.querySelector(".eao-org-center");
        const wires = org.querySelector(".eao-org-wires");
        if (center && center.offsetWidth) {
          const tl = sceneFor(org, center, {
            entry: .90, travel: compact ? .34 : .48
          });
          if (tl) {
            tl.fromTo(center, {
              y: compact ? 34 : 122, rotationX: compact ? 0 : -11, scale: compact ? .96 : .86, autoAlpha: 0
            }, {
              y: 0, rotationX: 0, scale: 1, autoAlpha: 1,
              duration: .85, ease: "power1.inOut"
            }, 0);
            if (wires && wires.offsetWidth) {
              tl.fromTo(wires, {
                scaleY: .15, autoAlpha: 0, transformOrigin: "50% 0%"
              }, {
                scaleY: 1, autoAlpha: 1,
                duration: .68, ease: "power1.inOut"
              }, .26);
            }
            hold(tl);
          }
        }
        animateGlassRows(org.querySelector(".eao-org-grid"), ".eao-org-card", "org");
        subtleReveal(org, org.querySelector(".eao-org-summary"), {
          entry: .96, travel: compact ? .30 : .36, y: compact ? 30 : 75
        });
      }

      const methods = document.querySelector(".eao-method-diagram");
      if (methods && methods.offsetWidth) {
        subtleReveal(methods, methods.querySelector(".eao-method-intro"), {
          entry: .90, travel: compact ? .24 : .28, y: 14
        });
        animateMethodSequence(methods.querySelector(".eao-method-flow"));
        subtleReveal(methods, methods.querySelector(".eao-method-summary"), {
          entry: .96, travel: compact ? .30 : .36, y: compact ? 30 : 75
        });
      }

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

      // FAQ choreography includes the previously omitted About EAO list.
      // Keep interactive summaries visible and focusable from frame zero.
      document.querySelectorAll(".faq-group").forEach((group) => {
        const list = group.querySelector(".faq-list");
        if (!list || !list.offsetWidth) return;
        const items = [...list.querySelectorAll(":scope > .faq-item")];
        if (!items.length) return;
        const tl = sceneFor(group, list, {
          entry: compact ? .94 : .90,
          travel: compact ? .50 : .67
        });
        if (!tl) return;
        items.forEach((item, i) => {
          const sign = i % 2 ? 1 : -1;
          tl.fromTo(item, {
            x: sign * (compact ? 45 : 122),
            y: compact ? 5 : 0,
            rotationY: compact ? 0 : sign * 12,
            rotation: compact ? sign * .5 : sign * 1.25,
            scale: compact ? .965 : .91,
            opacity: compact ? .88 : .74,
            transformPerspective: 1050,
            transformOrigin: i % 2 ? "100% 50%" : "0% 50%"
          }, {
            x: 0, y: 0, rotationY: 0, rotation: 0,
            scale: 1, opacity: 1,
            duration: 1, ease: "power1.inOut"
          }, i * .12);
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
