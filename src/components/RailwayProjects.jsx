import React, { useLayoutEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  { 
    title: "Abhipsha Traders", 
    desc: "Luxury e-commerce ecosystem with high-fidelity transitions and seamless user flow.", 
    img: "https://images.unsplash.com/photo-1557821552-17105176677c?q=80&w=2064&auto=format&fit=crop",
    link: "https://abhipsatraders.netlify.app/"
  },
  { 
    title: "Attendance", 
    desc: "Next-gen biometric dashboard designed for enterprise scale and precision.", 
    img: "https://images.unsplash.com/photo-1507925921958-8a62f3d1a50d?q=80&w=2076&auto=format&fit=crop",
    link: "https://thriving-moxie-238c91.netlify.app/login"
  },
  { 
    title: "Portfolio", 
    desc: "A digital masterpiece showcasing the intersection of art and engineering.", 
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015&auto=format&fit=crop",
    link: "https://chanchalmandal.netlify.app/"
  },
  { 
    title: "The Creative Office", 
    desc: "Architectural digital twin for high-performance creative environments.", 
    img: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop",
    link: "https://chanchalmandalv2.netlify.app/"
  },
];

const RailwayProjects = () => {
  const triggerRef = useRef(null);
  const trainRef = useRef(null);
  const trackRef = useRef(null);
  const titleRef = useRef(null);

  useLayoutEffect(() => {
    if (!triggerRef.current || !trainRef.current) return;

    let mm = gsap.matchMedia();
    let ctx = gsap.context(() => {

      mm.add("(min-width: 1024px)", () => {
        const train = trainRef.current;
        if (!train) return;

        const totalWidth = train.scrollWidth;
        const amountToScroll = totalWidth - window.innerWidth + (window.innerWidth * 0.3);

        const railwayTl = gsap.timeline({
          scrollTrigger: {
            trigger: triggerRef.current,
            start: "top top",
            end: () => `+=${amountToScroll}`,
            pin: true,
            scrub: 1,
            invalidateOnRefresh: true,
          },
        });

        railwayTl.to(train, { x: -amountToScroll, ease: "none" }, 0);
        if (trackRef.current) {
          railwayTl.to(trackRef.current, { x: -amountToScroll * 0.3, ease: "none" }, 0);
        }

        gsap.utils.toArray('.project-card').forEach((card) => {
          const image = card.querySelector('.project-image');
          gsap.timeline({
            scrollTrigger: {
              trigger: card,
              containerAnimation: railwayTl,
              start: "left 95%",
              end: "left 5%",
              scrub: true,
            }
          })
          .fromTo(card, 
            { scale: 0.8, rotate: 3, filter: "blur(10px)", opacity: 0.4 },
            { scale: 1, rotate: 0, filter: "blur(0px)", opacity: 1, ease: "power2.out" }
          )
          .fromTo(image, { scale: 1.3 }, { scale: 1, ease: "none" }, 0);
        });

        gsap.to('.bg-parallax-text', {
          x: -amountToScroll * 0.15,
          scrollTrigger: { trigger: triggerRef.current, scrub: true }
        });
      });

      mm.add("(max-width: 1023px)", () => {
        gsap.utils.toArray('.project-card').forEach((card) => {
          gsap.fromTo(card, 
            { opacity: 0, y: 100, scale: 0.9, filter: "blur(10px)" },
            { 
              opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
              duration: 1.2,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        });
      });

      if (titleRef.current) {
        gsap.from(titleRef.current, {
          y: 100, opacity: 0, duration: 1.5, ease: "expo.out",
          scrollTrigger: { trigger: triggerRef.current, start: "top 80%" }
        });
      }

    }, triggerRef);

    const timer = setTimeout(() => ScrollTrigger.refresh(), 100);
    return () => {
      mm.revert();
      ctx.revert();
      clearTimeout(timer);
    };
  }, []);

  return (
    <div ref={triggerRef} className="relative min-h-screen w-full overflow-hidden bg-[var(--bg-color)] z-[10]">
      {/* 🎭 Cinematic Grain */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.04] z-[999] bg-[url('data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E')]"></div>

      {/* 🌌 Background Parallax Text */}
      <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none z-[10001]">
        <h1 className="bg-parallax-text text-[25vw] font-black text-[var(--heading-color)] whitespace-nowrap tracking-tighter leading-none select-none uppercase lg:block hidden" style={{ opacity: 0.1 }}>
          SELECTED SELECTED SELECTED
        </h1>
      </div>

      {/* 🛤️ Railway Track */}
      <div ref={trackRef} className="absolute bottom-[12vh] left-0 w-[500vw] h-[2px] bg-gradient-to-r from-[var(--heading-color)]/0 via-[var(--heading-color)]/20 to-[var(--heading-color)]/0 z-0 lg:block hidden">
        <div className="absolute inset-0 flex justify-around items-center h-6 -top-2">
          {Array.from({ length: 100 }).map((_, i) => (
            <div key={i} className="w-[1px] h-full bg-[var(--heading-color)]/10"></div>
          ))}
        </div>
      </div>

      {/* 🏷️ Cinematic Header */}
      <div className="absolute top-[4vh] left-[6vw] lg:left-[10vw] z-[10001] pointer-events-none" ref={titleRef}>

        <h2 className="font-['OriginTech'] text-[var(--heading-color)] text-2xl sm:text-4xl lg:text-6xl 2xl:text-8xl font-black tracking-tighter leading-none uppercase pointer-events-auto cursor-hover-text">
          <span className="text-3xl sm:text-5xl lg:text-8xl 2xl:text-[11rem]" style={{ color: 'var(--heading-color)' }}>Project</span> <br /> <span style={{ WebkitTextStroke: '0px' }}>Showcase</span>
        </h2>
      </div>

      {/* 🚄 Train Container */}
      <div className="min-h-screen flex flex-col lg:flex-row items-center relative z-30 px-6 lg:px-[15vw] pt-[35vh] lg:pt-0">
        <div ref={trainRef} className="flex flex-col lg:flex-row gap-16 lg:gap-[15vw] items-center w-full lg:w-auto pb-20 lg:pb-0">
          {projects.map((project, index) => {
            const CardComponent = project.link ? 'a' : 'div';
            const extraProps = project.link ? {
              href: project.link,
              target: "_blank",
              rel: "noopener noreferrer"
            } : {};

            return (
              <div 
                key={index} 
                className="project-card group relative flex-shrink-0 w-full lg:w-[42vw] aspect-[4/5] sm:aspect-[16/10] lg:aspect-[16/9] perspective-1000"
              >
                <CardComponent 
                  {...extraProps}
                  className={`block relative w-full h-full rounded-3xl overflow-hidden bg-[var(--bg-color)] border border-[var(--heading-color)]/10 transition-all duration-700 group-hover:border-[var(--heading-color)]/30 group-hover:shadow-[0_0_80px_rgba(255,255,255,0.05)] ${project.link ? 'cursor-pointer' : ''}`}
                >
                  <div className="absolute inset-0 project-image-container overflow-hidden">
                    <img src={project.img} alt={project.title} className="project-image w-full h-full object-cover transition-transform duration-1000 scale-110 group-hover:scale-100 grayscale" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-90"></div>
                  </div>
                  <div className="absolute inset-0 p-6 sm:p-8 lg:p-16 flex flex-col justify-end z-[10001] universa-font-container">
                    <span className="text-[var(--text-color)] font-mono tracking-[0.5em] uppercase mb-3 text-[10px]" style={{ opacity: 0.8 }}>Index / 0{index + 1}</span>
                    <h3 className="font-['Poppins'] text-3xl lg:text-6xl font-black text-[var(--heading-color)] mb-6 tracking-tighter leading-none uppercase transition-transform duration-700">
                      {project.title}
                    </h3>
                    <p className="text-[var(--text-color)] text-sm lg:text-lg max-w-md font-light leading-relaxed transition-all duration-1000">
                      {project.desc}
                    </p>
                  </div>
                </CardComponent>
                <div className="absolute -top-10 -right-10 text-[15vw] font-black text-[var(--heading-color)] select-none pointer-events-none transition-all duration-1000 lg:block hidden" style={{ opacity: 0.05 }}>
                  0{index + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .universa-font-container * {
           font-family: 'UniversaNew', sans-serif !important;
        }
        .text-outline {
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          color: transparent;
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp {
          animation: fadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
};

export default RailwayProjects;
