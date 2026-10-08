/* Official Swiper Coverflow effect; this file contains no bespoke animation. */
(() => {
  "use strict";
  const grid = document.querySelector("#projects .projects");
  if (!grid || typeof window.Swiper !== "function") return;

  const cards = Array.from(grid.children).filter((node) => node.matches("a.project"));
  if (cards.length < 2) return;

  // Progressive enhancement: without Swiper, the original Bento grid stays intact.
  const wrapper = document.createElement("div");
  wrapper.className = "swiper-wrapper";
  cards.forEach((card) => {
    const slide = document.createElement("div");
    slide.className = "swiper-slide";
    slide.append(card);
    wrapper.append(slide);
  });
  grid.append(wrapper);
  grid.classList.add("swiper", "demo-projects");

  const controls = document.createElement("div");
  controls.className = "demo-carousel-controls";
  const isZh = document.documentElement.lang.toLowerCase().startsWith("zh");
  controls.innerHTML = `
    <span class="demo-hint">${isZh ? "拖动卡片或使用箭头浏览项目" : "Drag cards or use the arrows to browse projects"}</span>
    <div class="demo-nav">
      <button type="button" class="demo-prev" aria-label="${isZh ? "上一个项目" : "Previous project"}">←</button>
      <span class="demo-counter" aria-live="polite">01 / ${String(cards.length).padStart(2, "0")}</span>
      <button type="button" class="demo-next" aria-label="${isZh ? "下一个项目" : "Next project"}">→</button>
    </div>
  `;
  grid.after(controls);

  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const slider = new window.Swiper(grid, {
    effect: reduced ? "slide" : "coverflow", // built-in preset, not our own tweens
    slidesPerView: "auto",
    centeredSlides: true,
    initialSlide: 0,
    speed: reduced ? 0 : 520,
    grabCursor: true,
    watchOverflow: true,
    resistanceRatio: .7,
    coverflowEffect: {
      rotate: 24,
      stretch: 0,
      depth: 130,
      modifier: 1,
      slideShadows: false
    },
    keyboard: { enabled: true, onlyInViewport: true },
    navigation: { prevEl: controls.querySelector(".demo-prev"), nextEl: controls.querySelector(".demo-next") },
    a11y: {
      enabled: true,
      prevSlideMessage: isZh ? "上一个项目" : "Previous project",
      nextSlideMessage: isZh ? "下一个项目" : "Next project"
    },
    on: {
      slideChange(swiper) {
        controls.querySelector(".demo-counter").textContent =
          `${String(swiper.realIndex + 1).padStart(2, "0")} / ${String(cards.length).padStart(2, "0")}`;
      }
    }
  });
  if (!slider || slider.destroyed) return;
  grid.classList.add("demo-carousel-ready");

  // The existing site uses GSAP to reveal projects. Refresh their positions
  // after Swiper supplies the layout; no extra motion is registered here.
  if (window.ScrollTrigger) requestAnimationFrame(() => window.ScrollTrigger.refresh());
})();
