(() => {
  const timeline = document.querySelector('#journey .timeline');
  if (!timeline || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const phases = [...timeline.querySelectorAll('.phase')];
  const { gsap, ScrollTrigger, DrawSVGPlugin, MotionPathPlugin } = window;
  if (!phases.length || !gsap || !ScrollTrigger || !DrawSVGPlugin || !MotionPathPlugin) return;
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MotionPathPlugin);

  const ns = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(ns, 'svg');
  svg.classList.add('journey-svg');
  svg.setAttribute('aria-hidden', 'true');
  const add = (host, tag, cls) => {
    const node = document.createElementNS(ns, tag);
    node.setAttribute('class', cls);
    host.append(node);
    return node;
  };
  const rail = add(svg, 'path', 'journey-rail-base');
  const path = add(svg, 'path', 'journey-rail-draw');
  const dot = add(svg, 'circle', 'journey-traveler');
  dot.setAttribute('r', '8');
  timeline.prepend(svg);

  const outlines = phases.map(phase => {
    const card = phase.querySelector('.phase-glass');
    const overlay = document.createElementNS(ns, 'svg');
    overlay.classList.add('journey-card-svg');
    overlay.setAttribute('aria-hidden', 'true');
    const outline = add(overlay, 'rect', 'journey-card-outline');
    outline.setAttribute('rx', '18');
    card.append(overlay);
    return { card, overlay, outline };
  });

  const measure = () => {
    const rect = timeline.getBoundingClientRect();
    const points = phases.map(phase => {
      const r = phase.querySelector('.phase-dot').getBoundingClientRect();
      return { x: r.left - rect.left + r.width / 2,
               y: r.top - rect.top + r.height / 2 };
    });
    // All three milestones align on the same rail in both responsive modes.
    const first = points[0], middle = points[1], last = points[points.length - 1];
    const d = `M ${first.x} ${first.y} L ${middle.x} ${middle.y} L ${last.x} ${last.y}`;
    const length = Math.hypot(last.x - first.x, last.y - first.y);
    const middleRatio = length ? Math.hypot(middle.x - first.x, middle.y - first.y) / length : .5;
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);
    rail.setAttribute('d', d);
    path.setAttribute('d', d);
    outlines.forEach(({ card, overlay, outline }) => {
      const w = card.clientWidth, h = card.clientHeight;
      overlay.setAttribute('viewBox', `0 0 ${w} ${h}`);
      outline.setAttribute('x', '1.5');
      outline.setAttribute('y', '1.5');
      outline.setAttribute('width', String(Math.max(0, w - 3)));
      outline.setAttribute('height', String(Math.max(0, h - 3)));
    });
    return middleRatio;
  };

  let tl = null, raf = 0, disposed = false, buildCount = 0;
  let lastSize = null;
  const build = () => {
    if (disposed) return;
    // GSAP MotionPath caches element coordinates when the tween is built.
    // Changing only the SVG path on resize leaves the traveler on the OLD route.
    // Recreate official tweens at the new breakpoint; do not hand-roll motion.
    tl?.scrollTrigger?.kill();
    tl?.kill();
    gsap.set(dot, { clearProps: 'transform' });
    outlines.forEach(({ outline }) => {
      gsap.set(outline, { clearProps: 'strokeDasharray,strokeDashoffset' });
    });
    const middleRatio = measure();
    const midDraw = `${(100 * middleRatio).toFixed(4)}%`;
    tl = gsap.timeline({
      scrollTrigger: {
        trigger: timeline,
        start: 'top 84%',
        end: 'bottom 45%',
        scrub: 0.6,
        invalidateOnRefresh: true
      }
    });
    // Two equal-duration chapters, so the traveler reaches milestone 02
    // at precisely 50%, even when mobile card heights are unequal.
    tl.fromTo(path, { drawSVG: '0%' },
      { drawSVG: midDraw, duration: 1.5, ease: 'none' }, 0);
    tl.to(path, { drawSVG: '100%', duration: 1.5, ease: 'none' }, 1.5);
    tl.fromTo(dot,
      { motionPath: { path, align: path, alignOrigin: [.5, .5], start: 0, end: 0 } },
      { motionPath: { path, align: path, alignOrigin: [.5, .5], start: 0, end: middleRatio },
        duration: 1.5, ease: 'none' }, 0);
    tl.to(dot, { motionPath: {
        path, align: path, alignOrigin: [.5, .5], start: middleRatio, end: 1
      }, duration: 1.5, ease: 'none' }, 1.5);
    outlines.forEach(({ outline }, i) => {
      tl.fromTo(outline, { drawSVG: '0%' },
        { drawSVG: '100%', duration: .82, ease: 'power1.inOut' }, i + .04);
    });
    buildCount++;
    ScrollTrigger.refresh();
  };
  const scheduleResize = () => {
    if (raf || disposed) return;
    raf = requestAnimationFrame(() => {
      raf = 0;
      const r = timeline.getBoundingClientRect();
      const size = `${r.width.toFixed(2)}:${r.height.toFixed(2)}`;
      if (size !== lastSize) {
        lastSize = size;
        build();
      }
    });
  };
  build();
  const rect = timeline.getBoundingClientRect();
  lastSize = `${rect.width.toFixed(2)}:${rect.height.toFixed(2)}`;
  timeline.classList.add('journey-ready');
  const resize = new ResizeObserver(scheduleResize);
  resize.observe(timeline);
  window.addEventListener('resize', scheduleResize, { passive: true });

  window.__journeyPreview = {
    get tl() { return tl; },
    get buildCount() { return buildCount; },
    path, dot, svg, measure,
    teardown() {
      disposed = true;
      cancelAnimationFrame(raf);
      resize.disconnect();
      window.removeEventListener('resize', scheduleResize);
      tl?.scrollTrigger?.kill();
      tl?.kill();
      timeline.classList.remove('journey-ready');
      outlines.forEach(({ overlay }) => overlay.remove());
      svg.remove();
    }
  };
})();
