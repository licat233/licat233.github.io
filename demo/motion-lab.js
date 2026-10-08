/* Licat motion study · isolated progressive enhancement for /demo/. */
(() => {
  "use strict";
  const story = document.querySelector(".lab-story");
  if (!story) return;

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  const replay = document.getElementById("lab-replay");
  const jumpToScene = () => story.scrollIntoView({
    behavior: reduced.matches ? "instant" : "smooth",
    block: "start"
  });

  // Browsing must always work without the animation engine or on reduced motion.
  if (!gsap || !ScrollTrigger || reduced.matches) {
    replay?.addEventListener("click", jumpToScene);
    document.documentElement.dataset.motionLabState = "static";
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  const mm = gsap.matchMedia();
  mm.add("(min-width: 900px) and (prefers-reduced-motion: no-preference)", () => {
    const tiles = gsap.utils.toArray(".lab-tile");
    const lines = gsap.utils.toArray(".lab-network-path");
    const core = document.querySelector(".lab-core");
    const first = document.querySelector(".lab-state-1");
    const second = document.querySelector(".lab-state-2");
    const third = document.querySelector(".lab-state-3");
    const meter = document.querySelector(".lab-meter-fill");
    if (!core || !first || !second || !third || tiles.length !== 4) return;

    // A subtle, prepared starting composition — not an off-screen scatter.
    const initial = [
      { x: -16, y: -10, rotation: -2.5 },
      { x: 16, y: -10, rotation: 2.5 },
      { x: -16, y: 10, rotation: 2 },
      { x: 16, y: 10, rotation: -2 }
    ];
    const final = [
      { x: -28, y: -18, rotation: -1.5 },
      { x: 28, y: -18, rotation: 1.5 },
      { x: -28, y: 18, rotation: 1 },
      { x: 28, y: 18, rotation: -1 }
    ];

    tiles.forEach((tile, i) => gsap.set(tile, { ...initial[i], scale: .96 }));
    gsap.set(core, { autoAlpha: 0, scale: .86, y: 12, transformOrigin: "50% 50%" });
    gsap.set([second, third], { autoAlpha: 0, y: 8 });
    gsap.set(lines, { strokeDashoffset: 650, opacity: .08 });
    gsap.set(meter, { scaleX: 0, transformOrigin: "left center" });

    const scene = gsap.timeline({ paused: true });
    // Phase 1: the pieces find alignment as the connecting paths appear.
    scene.to(tiles, {
      x: 0, y: 0, rotation: 0, scale: 1,
      duration: .62, stagger: .055, ease: "power3.out"
    }, 0);
    scene.to(lines, {
      strokeDashoffset: 0, opacity: .50,
      duration: .82, stagger: .055, ease: "power2.inOut"
    }, .05);
    scene.to(first, { autoAlpha: 0, y: -8, duration: .21, ease: "power1.out" }, .52);
    scene.to(second, { autoAlpha: 1, y: 0, duration: .34, ease: "power2.out" }, .7);

    // Phase 2: keep the four sources visible as satellites of the new whole.
    tiles.forEach((tile, i) => scene.to(tile, {
      ...final[i], scale: .79, opacity: .68,
      duration: .69, ease: "power2.inOut"
    }, .96 + i * .035));
    scene.to(lines, { opacity: .14, duration: .38 }, 1.04);
    scene.to(core, {
      autoAlpha: 1, scale: 1, y: 0,
      duration: .65, ease: "power3.out"
    }, 1.13);
    scene.to(second, { autoAlpha: 0, y: -8, duration: .21 }, 1.47);
    scene.to(third, { autoAlpha: 1, y: 0, duration: .36, ease: "power2.out" }, 1.65);
    scene.to(meter, { scaleX: 1, duration: 2.06, ease: "none" }, 0);

    // No pin, no forced extra scroll, and no 0.7s catch-up lag.
    // The page scrolls normally; the animation runs when the story becomes visible.
    const trigger = ScrollTrigger.create({
      trigger: story,
      start: "top 74%",
      onEnter: () => scene.play(),
      onEnterBack: () => scene.play(),
      onLeaveBack: () => scene.reverse()
    });

    const onReplay = () => { jumpToScene(); scene.restart(); };
    replay?.addEventListener("click", onReplay);
    return () => {
      replay?.removeEventListener("click", onReplay);
      trigger.kill();
      scene.kill();
      gsap.set(
        [...tiles, ...lines, core, first, second, third, meter],
        { clearProps: "all" }
      );
    };
  });

  // A non-blocking progress indicator for the existing journey timeline.
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
            trigger: timeline, start: "top 80%", end: "bottom 38%",
            scrub: .12, invalidateOnRefresh: true
          }
        }
      );
      return () => tween.kill();
    });
  }

  window.addEventListener("load", () => ScrollTrigger.refresh(), { once: true });
})();
