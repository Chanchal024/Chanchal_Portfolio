import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const educationData = [
  {
    title: "Saraswati Shishu Vidya Mandir, Tulsipur, Cuttack",
    sub: "School",
    desc: "Foundational education with a focus on holistic development and cultural values."
  },
  {
    title: "Saraswati Vidya Mandir, Kesavdham, Gatiroutpatna",
    sub: "Higher Secondary School",
    desc: "Advanced science curriculum with a strong emphasis on analytical thinking and disciplined learning."
  },
  {
    title: "Ravenshaw University Mahanadi Campus, Cuttack, Odisha",
    sub: "BCA 2nd Year",
    desc: "Pursuing Bachelor's in Computer Applications at a premier institution, focusing on modern software engineering."
  }
];

const AboutMe = () => {
  const containerRef = useRef(null);
  const pathRef = useRef(null);
  const nodeRef = useRef(null);

  useLayoutEffect(() => {
    if (!containerRef.current) return;
    
    let ctx = gsap.context(() => {
      const path = pathRef.current;
      if (!path) return;
      
      const pathLength = path.getTotalLength();
      gsap.set(path, { strokeDasharray: pathLength, strokeDashoffset: pathLength });

      // ─── TIMELINE: PATH DRAWING ───
      gsap.to(path, {
        strokeDashoffset: 0,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1
        }
      });

      // Node follows the path
      const nodePos = { distance: 0 };
      gsap.to(nodePos, {
        distance: pathLength,
        ease: "none",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top center",
          end: "bottom center",
          scrub: 1,
          onUpdate: (self) => {
             const point = path.getPointAtLength(pathLength * self.progress);
             if (nodeRef.current) gsap.set(nodeRef.current, { x: point.x, y: point.y });
          }
        }
      });

      // ─── SECTION REVEALS ───
      gsap.utils.toArray('.about-point').forEach((point) => {
        const content = point.querySelector('.point-content');
        if (content) {
          gsap.fromTo(content, 
            { opacity: 0, y: 100, filter: "blur(20px)", scale: 0.9 },
            { 
              opacity: 1, y: 0, filter: "blur(0px)", scale: 1,
              duration: 1.5,
              ease: "power3.out",
              scrollTrigger: {
                trigger: point,
                start: "top 70%",
                end: "top 20%",
                toggleActions: "play none none reverse",
                scrub: 1
              }
            }
          );
        }
      });

    }, containerRef);
    return () => ctx.revert();
  }, []);

  return (
    <div id="about" ref={containerRef} className="relative w-full bg-[var(--bg-color)] selection:bg-[var(--heading-color)] selection:text-[var(--bg-color)] h-[400vh]">
      
      {/* 🧩 STICKY BACKGROUND LAYER */}
      <div className="sticky top-0 h-screen w-full pointer-events-none z-0 overflow-hidden bg-[var(--bg-color)]">
        {/* Background texture removed */}
      </div>

      {/* 🛤️ CONNECTING SVG PATH */}
      <div className="absolute inset-0 flex justify-center pointer-events-none z-[2] top-0 bottom-0 hidden md:flex">
        <svg viewBox="0 0 400 2000" fill="none" preserveAspectRatio="none" className="h-full w-auto max-w-full">
          <path d="M200 0 C 200 400, 350 600, 200 1000 C 50 1400, 350 1700, 320 2000" stroke="currentColor" strokeWidth="1" strokeOpacity="0.1" className="text-[var(--heading-color)]" />
          <path ref={pathRef} d="M200 0 C 200 400, 350 600, 200 1000 C 50 1400, 350 1700, 320 2000" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-[var(--heading-color)]" />
          <g ref={nodeRef}>
            <circle r="10" fill="currentColor" className="text-[var(--heading-color)]" />
            <circle r="25" fill="currentColor" fillOpacity="0.1" className="animate-pulse text-[var(--heading-color)]" />
          </g>
        </svg>
      </div>

      {/* 🏷️ FULL-SCREEN STOP POINTS */}
      <div className="absolute inset-0 z-[10] w-full">
        
        {/* PAGE 1: TITLE + STORY (First Point) */}
        <section className="about-point h-screen w-full flex flex-col p-4 sm:p-6 md:p-10 lg:p-20 relative">
          <div className="text-left pl-2 sm:pl-4 md:pl-12 lg:pl-24">
            <h2 className="font-[chan1] text-[var(--heading-color)] text-2xl sm:text-4xl lg:text-7xl 2xl:text-[11rem] font-black tracking-tighter leading-none uppercase sm:whitespace-nowrap 2xl:whitespace-normal" style={{ color: 'var(--heading-color)' }}>
              ABOUT <span className="ml-[2vw] 2xl:ml-0 2xl:block 2xl:text-8xl">ME</span>
            </h2>
          </div>
          
          <div className="point-content flex-1 flex items-center justify-between pl-4 sm:pl-8 md:pl-24 lg:pl-40 pr-4 sm:pr-8 md:pr-24 lg:pr-40 mt-10 md:mt-0 w-full">
            <div className="w-full universa-font-container flex flex-col lg:flex-row items-center justify-between gap-8 lg:gap-16">
              <div className="flex-1 max-w-4xl">
                <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl 2xl:text-5xl font-light leading-tight text-[var(--text-color)] font-['Inter'] tracking-tight">
                  I'm <span className="font-bold">Chanchal Mandal</span>, a frontend developer who crafts pixel-perfect, high-performance web experiences.
                </p>
                <p className="text-xs sm:text-sm md:text-base lg:text-xl font-light leading-relaxed text-[var(--text-color)]/60 mt-4 sm:mt-6 md:mt-10 font-['Inter']">
                  I specialize in turning designs into fluid, responsive interfaces using React, JavaScript, and modern CSS — obsessing over every animation, layout, and interaction to deliver experiences that feel alive.
                </p>
              </div>
              <div className="flex-shrink-0 w-full max-w-[160px] sm:max-w-xs md:max-w-[400px] lg:max-w-[550px] 2xl:max-w-[1000px] no-hover-effect ml-auto lg:ml-24 translate-x-2 lg:translate-x-8">
                {/* Dark mode image */}
                <img 
                  src="/fron.png" 
                  alt="Chanchal Mandal" 
                  className="w-full h-auto no-hover-effect block dark-img"
                />
                {/* Light mode image */}
                <img 
                  src="/piccc.png" 
                  alt="Chanchal Mandal" 
                  className="w-full h-auto no-hover-effect hidden light-img"
                />
              </div>
            </div>
          </div>
        </section>

        {educationData.map((edu, i) => (
          <section key={i} className={`about-point h-screen w-full flex items-center px-4 sm:px-6 md:px-12 lg:px-24 xl:px-32 relative ${
            i === 0 ? 'justify-start 2xl:justify-between 2xl:flex-row-reverse' : i === 1 ? 'justify-center md:justify-end md:pr-0 lg:pr-0 xl:pr-0 translate-x-4 md:translate-x-12 lg:translate-x-20 2xl:justify-start 2xl:translate-x-0' : 'justify-center md:justify-start 2xl:justify-between'
          }`}>
            {i !== 0 && i === 1 && (
              <div className="absolute -left-4 md:-left-12 lg:-left-24 xl:-left-32 2xl:left-auto 2xl:right-0 2xl:mr-24 2xl:-translate-x-12 top-1/2 -translate-y-1/2 school-logo-responsive no-hover-effect">
                {/* Light mode logo */}
                <img src="/e4.png" alt="Saraswati Vidya Mandir" className="w-56 h-56 md:w-[380px] md:h-[380px] lg:w-[600px] lg:h-[600px] xl:w-[750px] xl:h-[750px] 2xl:w-[1150px] 2xl:h-[1150px] object-contain no-hover-effect light-img" style={{ opacity: 1 }} />
                {/* Dark mode logo */}
                <img src="/e3.png" alt="Saraswati Vidya Mandir" className="w-56 h-56 md:w-[380px] md:h-[380px] lg:w-[600px] lg:h-[600px] xl:w-[750px] xl:h-[750px] 2xl:w-[1150px] 2xl:h-[1150px] object-contain no-hover-effect dark-img" style={{ opacity: 1 }} />
              </div>
            )}

            
            <div className={`point-content relative group p-4 sm:p-6 md:p-8 lg:p-12 2xl:p-16 flex gap-4 sm:gap-6 md:gap-8 2xl:gap-12 items-start ${i === 0 || i === 2 ? 'flex-1 max-w-4xl 2xl:flex-none' : 'max-w-4xl'} 2xl:max-w-5xl universa-font-container ${i === 2 ? 'lg:translate-x-8 xl:translate-x-12 2xl:translate-x-64' : ''}`}
                 style={i === 1 ? { marginLeft: '5px' } : undefined}>
              <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-16 md:h-16 2xl:w-24 2xl:h-24 rounded-full bg-[var(--heading-color)] flex items-center justify-center text-[var(--bg-color)] font-black text-base sm:text-xl md:text-2xl 2xl:text-4xl flex-shrink-0">0{i+1}</div>
              <div>
                <h4 className="font-black text-base sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl 2xl:text-6xl text-[var(--heading-color)] uppercase leading-tight mb-2 sm:mb-3 2xl:mb-6">{edu.title}</h4>
                <span className="text-[var(--text-color)]/40 font-mono text-[10px] sm:text-xs md:text-sm 2xl:text-xl tracking-wider sm:tracking-widest uppercase mb-3 sm:mb-5 2xl:mb-8 block">{edu.sub}</span>
                <p className="text-[var(--text-color)]/60 font-light leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-3xl">{edu.desc}</p>
              </div>
            </div>

            {i === 0 && (
              <div className="flex-shrink-0 w-[150px] sm:w-[200px] md:w-[300px] lg:w-[450px] xl:w-[600px] 2xl:w-[1000px] ml-4 md:ml-8 2xl:ml-12 2xl:translate-x-12 no-hover-effect">
                {/* Light mode logo */}
                <img src="/e1.png" alt="Saraswati Shishu Vidya Mandir" className="w-full h-auto object-contain no-hover-effect light-img" />
                {/* Dark mode logo */}
                <img src="/e2.png" alt="Saraswati Shishu Vidya Mandir" className="w-full h-auto object-contain no-hover-effect dark-img" />
              </div>
            )}

            {i === 2 && (
              <div className="flex-shrink-0 w-[150px] sm:w-[200px] md:w-[300px] lg:w-[450px] xl:w-[600px] 2xl:w-[1000px] 2xl:translate-x-12 ml-4 md:ml-8 2xl:ml-0 no-hover-effect">
                {/* Light mode logo */}
                <img src="/e6.png" alt="Ravenshaw University" className="w-full h-auto object-contain no-hover-effect light-img" style={{ opacity: 1 }} />
                {/* Dark mode logo */}
                <img src="/e5.png" alt="Ravenshaw University" className="w-full h-auto object-contain no-hover-effect dark-img" style={{ opacity: 1 }} />
              </div>
            )}
          </section>
        ))}
      </div>

      <style>{`
        .universa-font-container * {
           font-family: 'UniversaNew', sans-serif !important;
         }
         .about-point h2, .about-point h4, .about-point h3 {
           mix-blend-mode: normal !important;
           color: var(--heading-color) !important;
         }
         .about-point p, .about-point span {
           color: var(--text-color) !important;
         }
         .text-outline {
           -webkit-text-stroke: 1px var(--text-color);
           opacity: 0.3;
           color: transparent;
         }
         .light-img {
            display: none !important;
         }
         :root.light .light-img {
            display: block !important;
         }
         .dark-img {
            display: block !important;
         }
         :root.light .dark-img {
            display: none !important;
         }
         .dark-img, .light-img {
            animation: logo-float 6s ease-in-out infinite;
         }
         .school-logo-responsive {
            display: none !important;
         }
         @media (min-width: 768px) {
            .school-logo-responsive {
               display: block !important;
            }
         }
         .school-logo-responsive img {
            animation: logo-float 6s ease-in-out infinite;
            opacity: 0.12;
         }
         @keyframes logo-float {
            0%, 100% {
               transform: translateY(0);
            }
            50% {
               transform: translateY(-20px);
            }
         }
      `}</style>
    </div>
  );
};

export default AboutMe;
