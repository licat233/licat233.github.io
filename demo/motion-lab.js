/* Isolated progressive enhancement for /demo/. Original portfolio.js remains unchanged. */
(() => {
  "use strict";
  const story = document.querySelector(".lab-story");
  if (!story) return;
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const replay = document.getElementById("lab-replay");
  replay?.addEventListener("click", () => {
    const top = window.scrollY + story.getBoundingClientRect().top;
    window.scrollTo({ top: Math.max(0, top), behavior: reduced.matches ? "instant" : "smooth" });
  });

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (!gsap || !ScrollTrigger || reduced.matches) {
    document.documentElement.dataset.motionLabState = "static";
    return; // All essential content and links remain available without JavaScript/GSAP.
  }
  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();

  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
    const tiles = gsap.utils.toArray(".lab-tile");
    const canvas = document.querySelector(".lab-canvas");
    const core = document.querySelector(".lab-core");
    if (!canvas || !core || tiles.length !== 4) return;

    gsap.set(tiles, { transformOrigin: "50% 50%" });
    gsap.set(core, { autoAlpha: 0, transformOrigin: "50% 50%" });

    // Four independent ideas move into a precise composition, then converge.
    // All stages are bound to user scroll progress, not elapsed wall-clock time.
    const offsets = [
      { x: -84, y: -62, rotation: -8, scale: .78 },
      { x: 74, y: -78, rotation: 7, scale: .78 },
      { x: -66, y: 76, rotation: 5, scale: .78 },
      { x: 85, y: 64, rotation: -7, scale: .78 }
    ];
    const centerDelta = (element, axis) => {
      const box = element.getBoundingClientRect();
      const target = core.getBoundingClientRect();
      return axis === "x"
        ? (target.left + target.width / 2) - (box.left + box.width / 2)
        : (target.top + target.height / 2) - (box.top + box.height / 2);
    };

    const timeline = gsap.timeline({ defaults: { ease: "none" } });

    tiles.forEach((tile, index) => {
      timeline.fromTo(tile,
        { ...offsets[index], opacity: .32 },
        { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1, duration: 1.05, ease: "power2.inOut" },
        index * .075
      );
    });

    timeline.fromTo(".lab-network-path",
      { strokeDashoffset: 650, opacity: .08 },
      { strokeDashoffset: 0, opacity: .55, duration: 1.25, stagger: .08, ease: "power1.inOut" },
      .15
    );
    timeline.to(".lab-state-1", { opacity: 0, y: -10, duration: .25 }, .9);
    timeline.fromTo(".lab-state-2", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .4 }, 1.08);

    // Compute destinations on invalidation/resize to avoid hard-coded viewport assumptions.
    tiles.forEach((tile, index) => {
      timeline.to(tile, {
        x: () => centerDelta(tile, "x"),
        y: () => centerDelta(tile, "y"),
        rotation: index % 2 === 0 ? -4 : 4,
        scale: .23,
        autoAlpha: 0,
        duration: .95,
        ease: "power2.inOut"
      }, 1.58 + index * .045);
    });
    timeline.to(".lab-network-path", { opacity: 0, duration: .52 }, 1.6);
    timeline.fromTo(core,
      { autoAlpha: 0, scale: .68, y: 20 },
      { autoAlpha: 1, scale: 1, y: 0, duration: .95, ease: "power3.out" },
      1.95
    );
    timeline.to(".lab-state-2", { opacity: 0, y: -10, duration: .28 }, 1.82);
    timeline.fromTo(".lab-state-3", { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: .45 }, 2.1);
    timeline.fromTo(".lab-meter-fill", { scaleX: 0 }, { scaleX: 1, duration: 2.95, ease: "none" }, 0);

    const st = ScrollTrigger.create({
      trigger: story,
      pin: story.querySelector(".lab-pin"),
      start: "top top",
      end: () => "+=" + Math.round(window.innerHeight * 1.85),
      animation: timeline,
      scrub: .7,
      anticipatePin: 1,
      invalidateOnRefresh: true,
      refreshPriority: 10
    });

    return () => {
      st.kill();
      timeline.kill();
      gsap.set([...tiles, core, ...document.querySelectorAll(".lab-network-path, .lab-reading p, .lab-meter-fill")], { clearProps: "all" });
    };
  });

  // An additional, non-pinned chapter progress treatment. On narrow screens
  // it follows the original vertical timeline; on wide screens it is horizontal.
  const timeline = document.querySelector(".journey .timeline");
  if (timeline) {
    const rail = document.createElement("span");
    rail.className = "lab-timeline-rail";
    rail.setAttribute("aria-hidden", "true");
    timeline.prepend(rail);
    mm.add("(prefers-reduced-motion: no-preference)", () => {
      const compact = window.matchMedia("(max-width: 760px)");
      const tween = gsap.fromTo(rail,
        { scaleX: compact.matches ? 1 : 0, scaleY: compact.matches ? 0 : 1 },
        {
          scaleX: 1, scaleY: 1, ease: "none",
          scrollTrigger: {
            trigger: timeline,
            start: "top 80%",
            end: "bottom 38%",
            scrub: .6,
            invalidateOnRefresh: true
          }
        }
      );
      return () => tween.kill();
    });
  }
  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();
