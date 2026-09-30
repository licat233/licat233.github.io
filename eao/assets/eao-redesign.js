(() => {
  const ready = (fn) => {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  };

  ready(() => {
    const nav = document.querySelector("nav");
    const navLinks = Array.from(
      document.querySelectorAll(".links a[href^='#']")
    ).filter((link) => link.getAttribute("href") !== "#");

    const sections = navLinks
      .map((link) => {
        const target = document.querySelector(link.getAttribute("href"));
        return target ? { link, target } : null;
      })
      .filter(Boolean);

    const setActive = (link) => {
      navLinks.forEach((item) => item.classList.toggle("is-active", item === link));
    };

    if ("IntersectionObserver" in window && sections.length) {
      const observer = new IntersectionObserver(
        (entries) => {
          const visible = entries
            .filter((entry) => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
          if (!visible) return;
          const item = sections.find(({ target }) => target === visible.target);
          if (item) setActive(item.link);
        },
        {
          rootMargin: "-22% 0px -62% 0px",
          threshold: [0, 0.08, 0.2, 0.45]
        }
      );
      sections.forEach(({ target }) => observer.observe(target));
    }

    navLinks.forEach((link) => {
      link.addEventListener("click", () => setActive(link));
    });

    const gsap = window.gsap;
    const ScrollTrigger = window.ScrollTrigger;
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(pointer: fine)").matches;

    if (!gsap || reduceMotion) return;
    if (ScrollTrigger) gsap.registerPlugin(ScrollTrigger);

    const heroVisual = document.querySelector(".hero-visual");
    const heroShot = document.querySelector(".hero-shot");

    if (finePointer && heroVisual) {
      const rotateX = gsap.quickTo(heroVisual, "rotationX", {
        duration: 0.55,
        ease: "power3.out"
      });
      const rotateY = gsap.quickTo(heroVisual, "rotationY", {
        duration: 0.55,
        ease: "power3.out"
      });
      const yTo = gsap.quickTo(heroVisual, "y", {
        duration: 0.55,
        ease: "power3.out"
      });

      const move = (event) => {
        const rect = heroVisual.getBoundingClientRect();
        const px = (event.clientX - rect.left) / rect.width - 0.5;
        const py = (event.clientY - rect.top) / rect.height - 0.5;
        rotateX(py * -2.2);
        rotateY(px * 3.2 - 5);
        yTo(-4);
      };

      const leave = () => {
        rotateX(1.5);
        rotateY(-5);
        yTo(0);
      };

      heroVisual.addEventListener("pointermove", move);
      heroVisual.addEventListener("pointerleave", leave);
    }

    if (ScrollTrigger && heroShot) {
      gsap.to(heroShot, {
        yPercent: 4,
        scale: 1.02,
        ease: "none",
        scrollTrigger: {
          trigger: ".hero",
          start: "top top",
          end: "bottom top",
          scrub: 1.05
        }
      });
    }

    if (ScrollTrigger) {
      ScrollTrigger.batch(".dept-card", {
        start: "top 90%",
        once: true,
        onEnter: (batch) => {
          gsap.fromTo(
            batch,
            { y: 22, autoAlpha: 0 },
            {
              y: 0,
              autoAlpha: 1,
              duration: 0.56,
              stagger: 0.07,
              ease: "power3.out",
              clearProps: "opacity,visibility"
            }
          );
        }
      });
    }

    window.addEventListener(
      "load",
      () => {
        if (ScrollTrigger) ScrollTrigger.refresh();
      },
      { once: true }
    );
  });
})();
