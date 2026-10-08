/*
  Official GSAP pattern: "show cursor image on hover"
  Source: https://codepen.io/GreenSock/pen/PwqrzeG
  GSAP Demo Hub: https://demos.gsap.com/demo/cursor-tracking-image-preview/
  The CSS/DOM are adapted for Licat's portfolio; no new animation engine or timeline.
*/
(() => {
  "use strict";
  const gsap = window.gsap;
  const selector = ".demo-project-index > .demo-project-row";
  const query = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)");
  if (!gsap || !query.matches) return; // CSS keeps screenshots visible on touch/reduced motion/failure.
  const rows = gsap.utils.toArray(selector);
  if (!rows.length) return;

  // JS enhancement is opt-in. Hide static images only after GSAP is confirmed available.
  document.documentElement.classList.add("demo-hover-ready");
  const cleanups = [];
  rows.forEach((row) => {
    const image = row.querySelector("img.demo-project-preview");
    if (!image) return;
    // Glass cards create a containing block for fixed descendants. Reparent the
    // preview to body so the official pointer coordinates stay viewport-relative.
    const originalNextSibling = image.nextSibling;
    image.loading = "eager";
    image.classList.add("demo-follow-preview");
    document.body.appendChild(image);
    gsap.set(image, { xPercent: -50, yPercent: -50, autoAlpha: 0 });
    let firstEnter = true;
    // Exact GSAP official quickTo / paused fade follow pattern.
    const setX = gsap.quickTo(image, "x", { duration: .4, ease: "power3" });
    const setY = gsap.quickTo(image, "y", { duration: .4, ease: "power3" });
    const align = (event) => {
      // Keep the preview within the viewport without changing its motion character.
      const boxWidth = Math.min(400, Math.max(272, window.innerWidth * .25));
      const boxHeight = boxWidth * (7 / 11);
      const x = gsap.utils.clamp(boxWidth / 2 + 12, innerWidth - boxWidth / 2 - 12, event.clientX);
      const y = gsap.utils.clamp(boxHeight / 2 + 12, innerHeight - boxHeight / 2 - 12, event.clientY);
      if (firstEnter) {
        setX(x, x);
        setY(y, y);
        firstEnter = false;
      } else {
        setX(x);
        setY(y);
      }
    };
    const startFollow = () => document.addEventListener("pointermove", align);
    const stopFollow = () => document.removeEventListener("pointermove", align);
    const fade = gsap.to(image, {
      autoAlpha: 1, ease: "none", paused: true, duration: .1,
      onReverseComplete: stopFollow
    });
    const enter = (event) => {
      if (event.pointerType && event.pointerType !== "mouse") return;
      firstEnter = true;
      fade.play();
      startFollow();
      align(event);
    };
    const leave = () => fade.reverse();
    row.addEventListener("pointerenter", enter);
    row.addEventListener("pointerleave", leave);
    cleanups.push(() => {
      row.removeEventListener("pointerenter", enter);
      row.removeEventListener("pointerleave", leave);
      stopFollow();
      fade.kill();
      gsap.killTweensOf(image);
      image.classList.remove("demo-follow-preview");
      row.insertBefore(image, originalNextSibling);
    });
  });

  // When desktop pointer or reduced-motion preference changes, reveal the static content.
  query.addEventListener?.("change", () => {
    cleanups.forEach((cleanup) => cleanup());
    document.documentElement.classList.remove("demo-hover-ready");
    gsap.set(".demo-project-preview", {clearProps:"all"});
  }, { once: true });
})();
