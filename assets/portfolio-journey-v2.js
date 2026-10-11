(() => {
  'use strict';
  const story = document.getElementById('story');
  const frame = document.getElementById('stage-frame');
  const monitorIndex = document.getElementById('monitor-phase');
  const monitorName = document.getElementById('monitor-name');
  const fill = document.getElementById('progress-fill');
  const { gsap, ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin } = window;
  if (!story || !frame || !gsap || !ScrollTrigger || !DrawSVGPlugin || !MorphSVGPlugin || !MotionPathPlugin) {
    // The HTML and complete SVG form a readable static fallback when plugins are unavailable.
    document.documentElement.classList.add('static-story');
    return;
  }
  gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin, MorphSVGPlugin, MotionPathPlugin);
  const prefersReduced = matchMedia('(prefers-reduced-motion: reduce)');
  if (prefersReduced.matches) {
    gsap.set('#process-line', { drawSVG: '0%' });
    gsap.set('#process-traveler', { scale: 0, transformOrigin: '50% 50%' });
    gsap.set('#morph-core', { morphSVG: '#shape-network' });
    monitorIndex.textContent = '03';
    monitorName.textContent = 'ORCHESTRATE';
    return;
  }

  const core = '#node-core', tools = '#node-tools', delivery = '#node-delivery';
  const knowledge = '#node-knowledge', governance = '#node-governance';
  const mesh = gsap.utils.toArray('.mesh-wire');
  const processLine = document.getElementById('process-line');
  const traveler = document.getElementById('process-traveler');

  // Stage 1 is a functioning core. Future nodes emerge out of it, not from opacity 0.
  // The HTML without JS is the fully connected final network, so failure never hides content.
  gsap.set(core, { x: 0, y: 0, scale: 1, svgOrigin: '450 310' });
  gsap.set([tools, delivery, knowledge, governance], {
    x: 0, y: 0, scale: 0, transformOrigin: '50% 50%'
  });
  gsap.set(mesh, { drawSVG: '0%' });
  gsap.set(processLine, { drawSVG: '0%' });
  gsap.set(traveler, { scale: 0, transformOrigin: '50% 50%' });
  gsap.set(fill, { scaleX: 0, transformOrigin: 'left' });

  const updateMonitor = progress => {
    // Only informational text state changes; visible chapter text is never hidden.
    const index = progress < .28 ? 0 : progress < .64 ? 1 : 2;
    const stages = [['01', 'BUILD'], ['02', 'AUTOMATE'], ['03', 'ORCHESTRATE']];
    const [n, label] = stages[index];
    if (monitorIndex.textContent !== n) {
      monitorIndex.textContent = n;
      monitorName.textContent = label;
    }
  };
  const tl = gsap.timeline({
    defaults: { ease: 'power2.inOut' },
    scrollTrigger: {
      trigger: story,
      start: () => innerWidth <= 760 ? 'top 9%' : 'top 45%',
      end: 'bottom 65%',
      scrub: 0.45,
      invalidateOnRefresh: true,
      onUpdate: self => updateMonitor(self.progress)
    }
  });

  // Chapter 1 — foundational system forms from one coherent nucleus.
  tl.addLabel('build', 0);
  tl.fromTo('#node-core .node-primary',
    { drawSVG: '0%' },
    { drawSVG: '100%', duration: .88, ease: 'power1.inOut' }, 'build');
  tl.fromTo('#morph-core', { scale: .72, rotation: -24 },
    { scale: 1, rotation: 0, duration: .82, ease: 'power3.out',
      transformOrigin: '50% 50%' }, 'build');
  tl.to(fill, { scaleX: 1, duration: 3.15, ease: 'none' }, 'build');

  // Chapter 2 — one core grows into a linked automation chain.
  // MotionPath makes the packet follow the same real SVG route as DrawSVG.
  tl.addLabel('automate', 1.0);
  tl.to(core, { x: -220, y: 0, duration: .7 }, 'automate');
  tl.to(tools, { x: 0, y: 0, scale: 1, duration: .72, ease: 'back.out(1.25)' }, 'automate+=.12');
  tl.to(delivery, { x: 220, y: 0, scale: 1, duration: .72, ease: 'back.out(1.25)' }, 'automate+=.22');
  tl.to('#morph-core', { morphSVG: { shape: '#shape-flow', type: 'rotational' },
    duration: .72 }, 'automate+=.1');
  tl.fromTo(processLine, { drawSVG: '0%' },
    { drawSVG: '100%', duration: .78, ease: 'none' }, 'automate+=.35');
  tl.to(traveler, { scale: 1, duration: .2 }, 'automate+=.45');
  tl.fromTo(traveler,
    { motionPath: { path: processLine, align: processLine, alignOrigin: [.5, .5], start: 0, end: 0 } },
    { motionPath: { path: processLine, align: processLine, alignOrigin: [.5, .5], start: 0, end: 1 },
      duration: .75, ease: 'none' }, 'automate+=.47');

  // Chapter 3 — that same linked chain rearranges as an agent network.
  // No fake card entrances: source, tooling, delivery, knowledge and governance
  // move to meaningful spatial roles. The mesh is drawn only after repositioning.
  tl.addLabel('orchestrate', 2.22);
  tl.to(traveler, { scale: 0, duration: .18 }, 'orchestrate');
  tl.to(processLine, { drawSVG: '0%', duration: .28 }, 'orchestrate');
  tl.to(core, { x: 0, y: -155, duration: .80 }, 'orchestrate');
  tl.to(tools, { x: -240, y: 70, duration: .78 }, 'orchestrate+=.04');
  tl.to(delivery, { x: 240, y: 70, duration: .78 }, 'orchestrate+=.04');
  tl.to(knowledge, { x: -100, y: 230, scale: 1,
    duration: .78, ease: 'back.out(1.2)' }, 'orchestrate+=.22');
  tl.to(governance, { x: 100, y: 230, scale: 1,
    duration: .78, ease: 'back.out(1.2)' }, 'orchestrate+=.27');
  tl.to('#morph-core', { morphSVG: { shape: '#shape-network', type: 'rotational' },
    duration: .76 }, 'orchestrate+=.1');
  tl.to(mesh, { drawSVG: '100%', duration: .66, ease: 'power1.inOut',
    stagger: { each: .075 } }, 'orchestrate+=.41');

  // No ScrollTrigger on nested children, no custom requestAnimationFrame ticker,
  // no pinned spacer, no per-element scroll observer, no runtime layout writes.
  ScrollTrigger.refresh();
  window.__gsapJourneyV2 = {
    timeline: tl,
    stageLabels: ['build', 'automate', 'orchestrate'],
    staticFallback: false,
    destroy() {
      tl.scrollTrigger?.kill();
      tl.kill();
      gsap.set([core, tools, delivery, knowledge, governance], { clearProps: 'all' });
      gsap.set(mesh, { clearProps: 'all' });
      gsap.set(processLine, { clearProps: 'all' });
      gsap.set(traveler, { clearProps: 'all' });
    }
  };
})();
