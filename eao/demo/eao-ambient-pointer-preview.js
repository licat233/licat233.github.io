/* EAO /demo/ ambient pointer tracking. Bounded, throttled, opt-in. */
(() => {
  "use strict";
  const body = document.body;
  if (!body || !body.classList.contains("eao-v2")) return;
  const restrictions = [
    "(max-width: 700px)",
    "(pointer: coarse)",
    "(hover: none)",
    "(prefers-reduced-motion: reduce)",
    "(prefers-reduced-transparency: reduce)",
    "(prefers-contrast: more)",
    "(forced-colors: active)"
  ].map(query => window.matchMedia(query));
  let frame = 0, enabled = false, lastPaint = 0;
  let x = 0, y = 0, targetX = 0, targetY = 0;
  const set = () => {
    body.style.setProperty("--amb-x", x.toFixed(2) + "px");
    body.style.setProperty("--amb-y", y.toFixed(2) + "px");
  };
  const tick = (timestamp) => {
    frame = 0;
    if (!enabled || document.hidden) return;
    if (timestamp - lastPaint < 32) {
      frame = requestAnimationFrame(tick);
      return;
    }
    lastPaint = timestamp;
    const dx = targetX - x, dy = targetY - y;
    x += dx * .105;
    y += dy * .105;
    if (Math.abs(dx) < .16 && Math.abs(dy) < .16) {
      x = targetX; y = targetY;
      set();
      return;
    }
    set();
    frame = requestAnimationFrame(tick);
  };
  const schedule = () => {
    if (enabled && !frame && !document.hidden) frame = requestAnimationFrame(tick);
  };
  const onMove = (e) => {
    if (!enabled || e.pointerType === "touch") return;
    const nx = Math.max(-1, Math.min(1, (e.clientX / innerWidth - .5) * 2));
    const ny = Math.max(-1, Math.min(1, (e.clientY / innerHeight - .5) * 2));
    targetX = nx * Math.min(285, innerWidth * .24);
    targetY = ny * Math.min(165, innerHeight * .20);
    schedule();
  };
  const onLeave = () => { targetX = 0; targetY = 0; schedule(); };
  const onVisibility = () => {
    if (document.hidden && frame) { cancelAnimationFrame(frame); frame = 0; }
    if (!document.hidden) schedule();
  };
  const refresh = () => {
    const next = restrictions.every(m => !m.matches);
    if (enabled === next) return;
    enabled = next;
    if (next) {
      document.addEventListener("pointermove", onMove, {passive:true});
      document.addEventListener("pointerleave", onLeave, {passive:true});
    } else {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      if (frame) { cancelAnimationFrame(frame); frame = 0; }
      x = y = targetX = targetY = 0;
      set();
    }
  };
  restrictions.forEach(m => m.addEventListener?.("change", refresh));
  document.addEventListener("visibilitychange", onVisibility);
  refresh();
})();
