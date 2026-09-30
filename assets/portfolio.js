(() => {
  if (!window.gsap) return;

  const gsap = window.gsap;
  const ScrollTrigger = window.ScrollTrigger;
  if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

  const mm = gsap.matchMedia();

  mm.add(
    {
      desktop: "(min-width: 761px)",
      finePointer: "(pointer: fine)",
      reduceMotion: "(prefers-reduced-motion: reduce)"
    },
    (context) => {
      const { desktop, finePointer, reduceMotion } = context.conditions;
      const cleanups = [];

      if (reduceMotion) {
        gsap.set(
          ".site-header, .system-flow, .flow-glow, .hero-ghost, .hero-scene, .eyebrow, .hero-word, .hero-inline-note, .hero-paren, .hero-logo-token, .hero-signal, .hero-badge, .hero-actions, .hero-resource",
          { clearProps: "all" }
        );
        return;
      }

      // Initial states: different objects enter in different ways.
      gsap.set(".site-header", { y: -22, autoAlpha: 0 });
      gsap.set(".system-flow", { x: 150, autoAlpha: 0 });
      gsap.set(".flow-glow", { autoAlpha: 0 });
      gsap.set(".hero-ghost", { autoAlpha: 0, scale: 1.08 });
      gsap.set(".hero-scene", { autoAlpha: 0, scale: 1.08 });
      gsap.set(".eyebrow", { y: 12, autoAlpha: 0 });
      gsap.set(".hero-word", { yPercent: 112, autoAlpha: 0 });
      gsap.set(".hero-inline-note", { x: -14, autoAlpha: 0 });
      gsap.set(".hero-paren", { scale: 0, autoAlpha: 0 });
      gsap.set(".hero-logo-token", { scale: 0, rotation: -42, autoAlpha: 0 });
      gsap.set(".hero-signal", { scale: 0.78, rotation: 6, autoAlpha: 0 });
      gsap.set(".hero-badge", { scale: 0, rotation: -80, autoAlpha: 0 });
      gsap.set(".hero-actions", { y: 16, autoAlpha: 0 });
      gsap.set(".hero-resource", { y: 14, autoAlpha: 0 });

      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
        delay: 0.08
      });

      intro
        .to(".site-header", { y: 0, autoAlpha: 1, duration: 0.62 })
        .to(".flow-glow", { autoAlpha: 1, duration: 1.05, stagger: 0.12 }, "-=.38")
        .to(".system-flow", { x: 0, autoAlpha: 1, duration: 1.25 }, "-=.92")
        .to(".hero-ghost", { autoAlpha: 1, scale: 1, duration: 1.15 }, "-=1.02")
        .to(".hero-scene", { autoAlpha: 1, scale: 1, duration: 1.0 }, "-=.92")
        .to(".eyebrow", { y: 0, autoAlpha: 1, duration: 0.42 }, "-=.72")
        .to(
          ".hero-word",
          {
            yPercent: 0,
            autoAlpha: 1,
            duration: 0.82,
            stagger: 0.09,
            ease: "power4.out"
          },
          "-=.56"
        )
        .to(".hero-inline-note", { x: 0, autoAlpha: 1, duration: 0.48 }, "-=.44")
        .to(
          ".hero-paren",
          { scale: 1, autoAlpha: 1, duration: 0.46, stagger: 0.08, ease: "back.out(2)" },
          "-=.34"
        )
        .to(
          ".hero-logo-token",
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.56, ease: "back.out(1.7)" },
          "-=.33"
        )
        .to(
          ".hero-signal",
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.50, ease: "back.out(1.45)" },
          "-=.38"
        )
        .to(
          ".hero-badge",
          { scale: 1, rotation: 0, autoAlpha: 1, duration: 0.68, ease: "back.out(1.55)" },
          "-=.28"
        )
        .to(".hero-actions", { y: 0, autoAlpha: 1, duration: 0.44 }, "-=.33")
        .to(
          ".hero-resource",
          { y: 0, autoAlpha: 1, duration: 0.44, stagger: 0.08 },
          "-=.32"
        );

      // Ambient motion lives on child layers so it doesn't fight scroll transforms.
      gsap.to(".system-flow svg", {
        y: -13,
        rotation: -0.7,
        transformOrigin: "50% 50%",
        duration: 5.8,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".flow-glow-a", {
        scale: 1.07,
        duration: 6.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      gsap.to(".flow-glow-b", {
        scale: 0.94,
        duration: 7.1,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut"
      });

      if (ScrollTrigger) {
        if (desktop) {
          gsap.to(".system-flow", {
            y: -185,
            rotation: 5,
            scale: 1.07,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.25
            }
          });

          gsap.to(".hero-ghost", {
            yPercent: -8,
            autoAlpha: 0.42,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.2
            }
          });

          gsap.to(".hero-scene img", {
            yPercent: 8,
            scale: 1.08,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.1
            }
          });

          gsap.to(".hero-badge", {
            y: 72,
            rotation: 28,
            ease: "none",
            scrollTrigger: {
              trigger: ".hero-wrap",
              start: "top top",
              end: "bottom top",
              scrub: 1.35
            }
          });
        }

        gsap.utils.toArray(".section-head").forEach((heading) => {
          gsap.from(heading, {
            y: 26,
            autoAlpha: 0,
            duration: 0.68,
            ease: "power3.out",
            scrollTrigger: {
              trigger: heading,
              start: "top 90%",
              once: true
            }
          });
        });

        ScrollTrigger.batch(".project", {
          start: "top 88%",
          once: true,
          interval: 0.08,
          batchMax: desktop ? 2 : 1,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 42, autoAlpha: 0, scale: 0.982 },
              {
                y: 0,
                autoAlpha: 1,
                scale: 1,
                duration: 0.72,
                stagger: 0.10,
                ease: "power3.out",
                clearProps: "opacity,visibility"
              }
            );
          }
        });

        ScrollTrigger.batch(".phase", {
          start: "top 88%",
          once: true,
          onEnter: (batch) => {
            gsap.fromTo(
              batch,
              { y: 30, autoAlpha: 0 },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.64,
                stagger: 0.13,
                ease: "power3.out",
                clearProps: "opacity,visibility"
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
                stagger: 0.10,
                ease: "power3.out",
                clearProps: "opacity,visibility"
              }
            );
          }
        });
      }

      if (finePointer) {
        // Mouse parallax: quickTo reuses tweens instead of creating one per mouse event.
        const flowX = gsap.quickTo(".system-flow", "x", { duration: 1.15, ease: "power3.out" });
        const ghostX = gsap.quickTo(".hero-ghost", "x", { duration: 1.3, ease: "power3.out" });
        const sceneX = gsap.quickTo(".hero-scene", "x", { duration: 1.2, ease: "power3.out" });
        const glowAX = gsap.quickTo(".flow-glow-a", "x", { duration: 1.35, ease: "power3.out" });
        const glowAY = gsap.quickTo(".flow-glow-a", "y", { duration: 1.35, ease: "power3.out" });
        const glowBX = gsap.quickTo(".flow-glow-b", "x", { duration: 1.45, ease: "power3.out" });
        const glowBY = gsap.quickTo(".flow-glow-b", "y", { duration: 1.45, ease: "power3.out" });

        const onMouseMove = (event) => {
          const x = event.clientX / window.innerWidth - 0.5;
          const y = event.clientY / window.innerHeight - 0.5;
          flowX(x * 30);
          ghostX(x * -18);
          sceneX(x * -14);
          glowAX(x * 58);
          glowAY(y * 32);
          glowBX(x * -42);
          glowBY(y * -25);
        };
        document.addEventListener("mousemove", onMouseMove);
        cleanups.push(() => document.removeEventListener("mousemove", onMouseMove));

        document.querySelectorAll(".project, .principle").forEach((card) => {
          const rx = gsap.quickTo(card, "rotationX", { duration: 0.42, ease: "power3.out" });
          const ry = gsap.quickTo(card, "rotationY", { duration: 0.42, ease: "power3.out" });
          const yTo = gsap.quickTo(card, "y", { duration: 0.42, ease: "power3.out" });

          const move = (event) => {
            const rect = card.getBoundingClientRect();
            const px = (event.clientX - rect.left) / rect.width - 0.5;
            const py = (event.clientY - rect.top) / rect.height - 0.5;
            rx(py * -3.2);
            ry(px * 4.0);
            yTo(-4);
          };
          const leave = () => {
            rx(0);
            ry(0);
            yTo(0);
          };

          card.addEventListener("pointermove", move);
          card.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            card.removeEventListener("pointermove", move);
            card.removeEventListener("pointerleave", leave);
          });
        });

        const github = document.querySelector(".github-cta");
        if (github) {
          const gx = gsap.quickTo(github, "x", { duration: 0.34, ease: "power2.out" });
          const gy = gsap.quickTo(github, "y", { duration: 0.34, ease: "power2.out" });
          const move = (event) => {
            const r = github.getBoundingClientRect();
            gx(((event.clientX - r.left) / r.width - 0.5) * 8);
            gy(((event.clientY - r.top) / r.height - 0.5) * 8);
          };
          const leave = () => { gx(0); gy(0); };
          github.addEventListener("pointermove", move);
          github.addEventListener("pointerleave", leave);
          cleanups.push(() => {
            github.removeEventListener("pointermove", move);
            github.removeEventListener("pointerleave", leave);
          });
        }
      }

      const navPills = document.querySelectorAll(".nav-pill");
      navPills.forEach((pill) => {
        const click = () => {
          navPills.forEach((item) => item.classList.remove("active"));
          pill.classList.add("active");
        };
        pill.addEventListener("click", click);
        cleanups.push(() => pill.removeEventListener("click", click));
      });

      return () => cleanups.forEach((fn) => fn());
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
