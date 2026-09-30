(() => {
  if (!window.gsap) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;

  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: "(min-width: 761px)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      const { desktop, reduceMotion } = context.conditions;
      const cleanup = [];

      if (reduceMotion) {
        gsap.set(
          ".site-header, .eyebrow, .hero h1, .lead, .hero-actions .btn, .profile-card, .project, .phase, .principle, .section-head",
          { clearProps: "all" }
        );
        return;
      }

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" }
      });

      intro
        .from(".site-header", { y: -14, autoAlpha: 0, duration: 0.5 })
        .from(".eyebrow", { y: 14, autoAlpha: 0, duration: 0.42 }, "-=0.15")
        .from(".hero h1", { y: 30, autoAlpha: 0, duration: 0.78 }, "-=0.12")
        .from(".lead", { y: 18, autoAlpha: 0, duration: 0.55 }, "-=0.43")
        .from(
          ".hero-actions .btn",
          { y: 14, autoAlpha: 0, duration: 0.42, stagger: 0.08 },
          "-=0.35"
        )
        .from(
          ".profile-card",
          {
            x: desktop ? 48 : 0,
            y: 20,
            rotationY: desktop ? -5 : 0,
            autoAlpha: 0,
            duration: 0.82
          },
          "-=0.62"
        );

      gsap.to(".orb-one", {
        x: 26,
        y: -18,
        duration: 6,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".orb-two", {
        x: -22,
        y: 16,
        duration: 7.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      if (desktop && ScrollTrigger) {
        gsap.to(".hero-media img", {
          scale: 1.075,
          yPercent: 3.5,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero-wrap",
            start: "top top",
            end: "bottom top",
            scrub: 1.15
          }
        });
      }

      if (ScrollTrigger) {
        ScrollTrigger.batch(".project", {
          start: "top 88%",
          once: true,
          interval: 0.08,
          batchMax: desktop ? 4 : 2,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 34, autoAlpha: 0, scale: 0.985 },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.68,
                stagger: 0.08,
                ease: "power3.out",
                clearProps: "transform"
              }
            );
          }
        });

        gsap.utils.toArray(".section-head").forEach((heading) => {
          gsap.from(heading, {
            y: 24,
            autoAlpha: 0,
            duration: 0.65,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 90%",
              once: true
            }
          });
        });

        ScrollTrigger.batch(".phase", {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 26, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.62,
                stagger: 0.12,
                ease: "power3.out",
                clearProps: "transform"
              }
            );
          }
        });

        ScrollTrigger.batch(".principle", {
          start: "top 90%",
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 28, autoAlpha: 0, scale: 0.985 },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.62,
                stagger: 0.1,
                ease: "power3.out",
                clearProps: "transform"
              }
            );
          }
        });
      }

      if (desktop) {
        const tiltTargets = document.querySelectorAll(".project, .profile-card, .principle");

        tiltTargets.forEach((card) => {
          const rotateXTo = gsap.quickTo(card, "rotationX", {
            duration: 0.36,
            ease: "power3.out"
          });
          const rotateYTo = gsap.quickTo(card, "rotationY", {
            duration: 0.36,
            ease: "power3.out"
          });
          const yTo = gsap.quickTo(card, "y", {
            duration: 0.36,
            ease: "power3.out"
          });

          const onMove = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;

            rotateXTo(py * -3.2);
            rotateYTo(px * 4.2);
            yTo(-4);
          };

          const onLeave = () => {
            rotateXTo(0);
            rotateYTo(0);
            yTo(0);
          };

          card.addEventListener("pointermove", onMove);
          card.addEventListener("pointerleave", onLeave);
          cleanup.push(() => {
            card.removeEventListener("pointermove", onMove);
            card.removeEventListener("pointerleave", onLeave);
          });
        });
      }

      return () => cleanup.forEach((fn) => fn());
    }
  );

  window.addEventListener(
    "load",
    () => {
      if (ScrollTrigger) ScrollTrigger.refresh();
    },
    { once: true }
  );
})();
