import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "@studio-freight/lenis";

gsap.registerPlugin(ScrollTrigger);

/**
 * useScrollReveal - Premium Global Scroll Reveal & Depth System
 * Targets: [data-reveal], [data-reveal-group], [data-parallax], [data-reveal-text]
 */
export default function useScrollReveal() {
  useEffect(() => {
    // 1. Initialize Lenis (Buttery Smooth Scroll)
    const lenis = new Lenis({
      duration: 1.4,
      lerp: 0.08,
      smooth: true,
      wheelMultiplier: 1,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on("scroll", ScrollTrigger.update);

    // 2. Global Reveal (Fade + Slide + Scale + Blur)
    const revealElements = document.querySelectorAll("[data-reveal]");
    revealElements.forEach((el) => {
      gsap.fromTo(el,
        { 
          opacity: 0, 
          y: 70, 
          scale: 0.94, 
          filter: "blur(15px)" 
        },
        {
          opacity: 1, 
          y: 0, 
          scale: 1, 
          filter: "blur(0px)",
          duration: 1.5,
          ease: "expo.out",
          scrollTrigger: {
            trigger: el,
            start: "top 88%",
            toggleActions: "play none none none",
          },
        }
      );
    });

    // 3. Staggered Text / List Animation
    const revealText = document.querySelectorAll("[data-reveal-text]");
    revealText.forEach((container) => {
      const children = container.children;
      if (children.length > 0) {
        gsap.fromTo(children,
          { 
            opacity: 0, 
            y: 30, 
            rotateX: 10,
            filter: "blur(5px)" 
          },
          {
            opacity: 1, 
            y: 0, 
            rotateX: 0,
            filter: "blur(0px)",
            stagger: 0.1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: container,
              start: "top 90%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    // 4. Subtle Parallax (Depth)
    const parallaxElements = document.querySelectorAll("[data-parallax]");
    parallaxElements.forEach((el) => {
      const speed = parseFloat(el.getAttribute("data-parallax")) || 0.1;
      gsap.to(el, {
        y: (i, target) => - (ScrollTrigger.maxScroll(window) * speed * 0.05),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });

    // 5. Group Reveal (Standard Stagger)
    const revealGroups = document.querySelectorAll("[data-reveal-group]");
    revealGroups.forEach((group) => {
      const items = group.querySelectorAll("[data-reveal-item]");
      if (items.length > 0) {
        gsap.fromTo(items,
          { 
            opacity: 0, 
            y: 50, 
            scale: 0.97, 
            filter: "blur(10px)" 
          },
          {
            opacity: 1, 
            y: 0, 
            scale: 1, 
            filter: "blur(0px)",
            stagger: 0.12,
            duration: 1.2,
            ease: "power4.out",
            scrollTrigger: {
              trigger: group,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          }
        );
      }
    });

    ScrollTrigger.refresh();

    return () => {
      lenis.destroy();
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);
}
