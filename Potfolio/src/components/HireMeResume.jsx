import React, { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { jsPDF } from 'jspdf';

/**
 * HireMeResume — Premium cinematic resume showcase.
 * Opens with a diagonal clip-path reveal from top-right → bottom-left.
 * Closes with the reverse animation back to top-right.
 */
const HireMeResume = ({ isOpen, onClose, theme }) => {
  const isDark = theme !== 'light';
  // Color tokens: fg = text/borders on card, bg = card background
  const fg = isDark ? 'black' : 'white';
  const bg = isDark ? 'white' : 'black';
  const overlayBg = isDark ? 'rgba(0, 0, 0, 0.85)' : 'rgba(255, 255, 255, 0.85)';
  const fgHex = isDark ? '#000000' : '#ffffff';
  const overlayRef = useRef(null);
  const backdropRef = useRef(null);
  const cardRef = useRef(null);
  const contentRef = useRef(null);
  const closeRef = useRef(null);
  const timelineRef = useRef(null);
  const isAnimatingRef = useRef(false);

  // ── Open Animation ──
  useEffect(() => {
    if (!isOpen) return;
    if (!overlayRef.current || !backdropRef.current || !cardRef.current) return;

    isAnimatingRef.current = true;
    document.body.style.overflow = 'hidden';

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        // Stagger-in resume content sections
        if (contentRef.current) {
          gsap.fromTo(
            contentRef.current.querySelectorAll('.resume-section'),
            { opacity: 0, y: 30, filter: 'blur(6px)' },
            {
              opacity: 1, y: 0, filter: 'blur(0px)',
              duration: 0.7, stagger: 0.1, ease: 'power3.out'
            }
          );
        }
        // Animate close button
        if (closeRef.current) {
          gsap.fromTo(closeRef.current,
            { opacity: 0, scale: 0.5, rotate: -90 },
            { opacity: 1, scale: 1, rotate: 0, duration: 0.6, ease: 'back.out(1.7)' }
          );
        }
      }
    });

    timelineRef.current = tl;

    // Phase 1: Dim backdrop
    tl.fromTo(backdropRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5, ease: 'power2.inOut' },
      0
    );

    // Phase 2: Diagonal clip-path reveal from top-right
    tl.fromTo(overlayRef.current,
      {
        clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
        opacity: 1,
        visibility: 'visible'
      },
      {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)',
        duration: 1.4,
        ease: 'expo.inOut'
      },
      0.1
    );

    // Phase 3: Card scale + blur-in
    tl.fromTo(cardRef.current,
      { scale: 0.92, opacity: 0, filter: 'blur(20px)', y: 40 },
      { scale: 1, opacity: 1, filter: 'blur(0px)', y: 0, duration: 1.0, ease: 'power4.out' },
      0.6
    );

  }, [isOpen]);

  // ── Close Animation ──
  const handleClose = useCallback(() => {
    if (isAnimatingRef.current) return;
    if (!overlayRef.current || !backdropRef.current || !cardRef.current) return;

    isAnimatingRef.current = true;

    const tl = gsap.timeline({
      onComplete: () => {
        isAnimatingRef.current = false;
        document.body.style.overflow = 'auto';
        onClose();
      }
    });

    // Phase 1: Fade close button
    if (closeRef.current) {
      tl.to(closeRef.current,
        { opacity: 0, scale: 0.5, rotate: 90, duration: 0.3, ease: 'power2.in' },
        0
      );
    }

    // Phase 2: Content sections fade out
    if (contentRef.current) {
      tl.to(
        contentRef.current.querySelectorAll('.resume-section'),
        { opacity: 0, y: -20, filter: 'blur(4px)', duration: 0.3, stagger: 0.04, ease: 'power2.in' },
        0
      );
    }

    // Phase 3: Card shrink + blur out
    tl.to(cardRef.current,
      { scale: 0.92, opacity: 0, filter: 'blur(20px)', y: -30, duration: 0.6, ease: 'power3.in' },
      0.2
    );

    // Phase 4: Diagonal clip-path reverse to top-right
    tl.to(overlayRef.current,
      {
        clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
        duration: 1.2,
        ease: 'expo.inOut'
      },
      0.4
    );

    // Phase 5: Backdrop fade
    tl.to(backdropRef.current,
      { opacity: 0, duration: 0.5, ease: 'power2.inOut' },
      0.8
    );

  }, [onClose]);

  // ── ESC key listener ──
  useEffect(() => {
    if (!isOpen) return;
    const handleEsc = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, handleClose]);

  // ── Generate PDF Resume ──
  const generateResumePDF = useCallback(() => {
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const pageW = doc.internal.pageSize.getWidth();
    const margin = 20;
    const contentW = pageW - margin * 2;
    let y = 20;

    const addLine = () => { doc.setDrawColor(200); doc.line(margin, y, pageW - margin, y); y += 4; };
    const checkPage = (needed = 12) => { if (y + needed > 275) { doc.addPage(); y = 20; } };

    // ── Header ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.text('CHANCHAL MANDAL', pageW / 2, y, { align: 'center' });
    y += 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('+91-7606940215  |  EMAIL  |  LinkedIn  |  GitHub  |  Portfolio', pageW / 2, y, { align: 'center' });
    y += 6;
    addLine();

    // ── Summary ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('SUMMARY', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(
      'Frontend Developer crafting fast, interactive UIs with React, Tailwind CSS, GSAP, and modern JavaScript.',
      contentW
    );
    doc.text(summaryLines, margin, y);
    y += summaryLines.length * 5 + 4;
    addLine();

    // ── Technical Skills ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('TECHNICAL SKILLS', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.text('\u2022  FrontEnd: HTML, CSS, JavaScript', margin + 2, y); y += 5;
    doc.text('\u2022  Framework: Tailwind CSS, React, GSAP, Bootstrap', margin + 2, y); y += 6;
    addLine();

    // ── Experience ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('EXPERIENCE', margin, y);
    y += 7;
    doc.setFontSize(11);
    doc.text('Frontend Developer Intern \u2013 InternPe', margin, y);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.text('June 2025 \u2013 July 2025', pageW - margin, y, { align: 'right' });
    y += 6;
    doc.setFontSize(10);
    const expBullets = [
      'Worked on real-world projects using HTML, CSS, JavaScript, and React.js',
      'Built responsive and interactive web applications',
    ];
    expBullets.forEach((b) => {
      checkPage();
      doc.text(`\u2022  ${b}`, margin + 2, y);
      y += 5;
    });
    y += 2;
    addLine();

    // ── Projects ──
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('PROJECTS', margin, y);
    y += 7;

    // Project 1
    checkPage(35);
    doc.setFontSize(11);
    doc.text('Ecommerce Website \u2013 FrontEnd Development', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const proj1 = [
      'Built ABHIPSA TRADERS using React (TypeScript) and Vite',
      'Responsive UI with Tailwind CSS, shadcn/ui, and React Router',
      'Used React Hook Form, Zod, TanStack Query',
      'Backend with Node.js, Express, MongoDB, JWT',
      'Features: CRUD, analytics dashboard, customer management',
    ];
    proj1.forEach((b) => { checkPage(); doc.text(`\u2022  ${b}`, margin + 2, y); y += 5; });
    y += 4;

    // Project 2
    checkPage(35);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('Attendance Management \u2013 FrontEnd Development', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const proj2 = [
      'Face Recognition Attendance System frontend using React',
      'Dashboards for Admin, Teacher, Student',
      'Webcam face capture integration',
      'Component-based scalable architecture',
      'Responsive UI and real-time interaction',
    ];
    proj2.forEach((b) => { checkPage(); doc.text(`\u2022  ${b}`, margin + 2, y); y += 5; });
    y += 2;
    addLine();

    // ── Education ──
    checkPage(20);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('EDUCATION', margin, y);
    y += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    const eduLines = doc.splitTextToSize(
      'Motivated BCA 2nd-year student at Ravenshaw University with strong frontend development skills and passion for modern responsive web applications.',
      contentW
    );
    doc.text(eduLines, margin, y);

    doc.save('Chanchal_Mandal_Resume.pdf');
  }, []);

  if (!isOpen) return null;

  return (
    <>
      {/* ── Dim Backdrop ── */}
      <div
        ref={backdropRef}
        className={`fixed inset-0 z-[99990] backdrop-blur-md ${isDark ? 'bg-black/80' : 'bg-white/80'}`}
        onClick={handleClose}
        style={{ opacity: 0 }}
      />

      {/* ── Diagonal Reveal Container ── */}
      <div
        ref={overlayRef}
        data-lenis-prevent
        className="fixed inset-0 z-[99995] flex items-center justify-center p-4 sm:p-6 md:p-10 overflow-y-auto"
        style={{
          clipPath: 'polygon(100% 0%, 100% 0%, 100% 0%, 100% 0%)',
          background: overlayBg,
          backdropFilter: 'blur(30px)',
        }}
      >
        {/* ── Ambient Particles ── */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full"
              style={{
                width: `${Math.random() * 300 + 100}px`,
                height: `${Math.random() * 300 + 100}px`,
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                background: isDark
                  ? `radial-gradient(circle, rgba(255,255,255,${0.015 + Math.random() * 0.02}) 0%, transparent 70%)`
                  : `radial-gradient(circle, rgba(0,0,0,${0.015 + Math.random() * 0.02}) 0%, transparent 70%)`,
                animation: `hireMeFloat ${8 + Math.random() * 12}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* ── Film Grain Overlay ── */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03] z-[1]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`
          }}
        />

        {/* ── Close Button ── */}
        <button
          ref={closeRef}
          onClick={handleClose}
          className={`fixed top-6 right-6 sm:top-8 sm:right-8 z-[99999] w-12 h-12 sm:w-14 sm:h-14 rounded-full 
                     flex items-center justify-center backdrop-blur-xl
                     transition-all duration-300 hover:scale-110 active:scale-95 cursor-pointer
                     ${isDark
                       ? 'border border-white/15 bg-white/5 text-white/80 hover:text-white hover:bg-white/15 hover:border-white/30 shadow-[0_0_30px_rgba(255,255,255,0.05)]'
                       : 'border border-black/15 bg-black/5 text-black/80 hover:text-black hover:bg-black/15 hover:border-black/30 shadow-[0_0_30px_rgba(0,0,0,0.05)]'
                     }`}
          style={{ opacity: 0 }}
          aria-label="Close resume"
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <line x1="1" y1="1" x2="17" y2="17" />
            <line x1="17" y1="1" x2="1" y2="17" />
          </svg>
        </button>

        {/* ── Resume Card ── */}
        <div
          ref={cardRef}
          className="relative z-[2] w-full max-w-3xl my-8 sm:my-12"
          style={{ opacity: 0, '--text-color': fgHex, '--heading-color': fgHex }}
        >
          <div className={`
            relative rounded-[2rem] overflow-hidden
            ${isDark
              ? 'border border-black/[0.08] bg-white shadow-[0_32px_100px_rgba(0,0,0,0.3),_0_0_1px_rgba(0,0,0,0.1)]'
              : 'border border-white/[0.08] bg-black shadow-[0_32px_100px_rgba(0,0,0,0.5),_0_0_1px_rgba(255,255,255,0.1)]'
            }
          `}>
            {/* ── Card Inner Glow ── */}
            <div className={`absolute top-0 right-0 w-72 h-72 rounded-full blur-[100px] pointer-events-none ${isDark ? 'bg-black/[0.02]' : 'bg-white/[0.02]'}`} />
            <div className={`absolute bottom-0 left-0 w-60 h-60 rounded-full blur-[80px] pointer-events-none ${isDark ? 'bg-black/[0.015]' : 'bg-white/[0.015]'}`} />

            {/* ── Card Content ── */}
            <div ref={contentRef} data-lenis-prevent className="relative p-4 sm:p-8 md:p-12 lg:p-14 space-y-8 max-h-[80vh] overflow-y-auto"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: isDark ? 'rgba(0,0,0,0.15) transparent' : 'rgba(255,255,255,0.15) transparent',
              }}
            >

              {/* ── Name & Contact ── */}
              <div className={`resume-section text-center pb-6 border-b border-${fg}/[0.08]`} style={{ opacity: 0 }}>
                <h2 className={`font-['OriginTech'] text-3xl sm:text-4xl md:text-5xl font-black text-${fg} tracking-tight leading-none mb-4 uppercase`}>
                  Chanchal Mandal
                </h2>
                <div className={`flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-xs sm:text-sm text-${fg}/50 font-['UniversaNew'] tracking-wide`}>
                  <span className="flex items-center gap-1.5">
                    <span className="w-1 h-1 rounded-full bg-emerald-500 inline-block" />
                    +91-7606940215
                  </span>
                  <span className={`text-${fg}/20`}>|</span>
                  <a href="mailto:contact@example.com" className={`hover:text-${fg}/80 transition-colors`}>EMAIL</a>
                  <span className={`text-${fg}/20`}>|</span>
                  <a href="https://www.linkedin.com/in/mandal-chanchal" target="_blank" rel="noopener noreferrer" className={`hover:text-${fg}/80 transition-colors`}>LinkedIn</a>
                  <span className={`text-${fg}/20`}>|</span>
                  <a href="https://github.com/Chanchal024" target="_blank" rel="noopener noreferrer" className={`hover:text-${fg}/80 transition-colors`}>GitHub</a>
                  <span className={`text-${fg}/20`}>|</span>
                  <a href="#" className={`hover:text-${fg}/80 transition-colors`}>Portfolio</a>
                </div>
              </div>

              {/* ── Summary ── */}
              <div className="resume-section" style={{ opacity: 0 }}>
                <SectionTitle fg={fg}>Summary</SectionTitle>
                <p className={`text-${fg}/60 text-sm sm:text-base leading-relaxed font-light`}>
                  Frontend Developer crafting fast, interactive UIs with React, Tailwind CSS, GSAP, and modern JavaScript.
                </p>
              </div>

              {/* ── Technical Skills ── */}
              <div className="resume-section" style={{ opacity: 0 }}>
                <SectionTitle fg={fg}>Technical Skills</SectionTitle>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <SkillPill label="FrontEnd" value="HTML, CSS, JavaScript" fg={fg} />
                  <SkillPill label="Framework" value="Tailwind CSS, React, GSAP, Bootstrap" fg={fg} />
                </div>
              </div>

              {/* ── Experience ── */}
              <div className="resume-section" style={{ opacity: 0 }}>
                <SectionTitle fg={fg}>Experience</SectionTitle>
                <div className={`relative pl-5 border-l border-${fg}/[0.08]`}>
                  <div className={`absolute top-1 left-[-5px] w-2.5 h-2.5 rounded-full bg-${fg}/30 border-2 border-${fg}/10`} />
                  <h4 className={`text-${fg}/90 font-['UniversaNew'] font-bold text-sm sm:text-base tracking-wide uppercase`}>
                    Frontend Developer Intern
                    <span className={`text-${fg}/40 font-normal normal-case ml-2`}>– InternPe</span>
                  </h4>
                  <span className={`text-${fg}/30 text-xs tracking-widest uppercase font-mono block mb-3`}>
                    June 2025 – July 2025
                  </span>
                  <ul className={`space-y-1.5 text-${fg}/55 text-xs sm:text-sm font-light leading-relaxed`}>
                    <li className="flex gap-2">
                      <span className={`text-${fg}/25 mt-0.5 shrink-0`}>▸</span>
                      Worked on real-world projects using HTML, CSS, JavaScript, and React.js
                    </li>
                    <li className="flex gap-2">
                      <span className={`text-${fg}/25 mt-0.5 shrink-0`}>▸</span>
                      Built responsive and interactive web applications
                    </li>
                  </ul>
                </div>
              </div>

              {/* ── Projects ── */}
              <div className="resume-section" style={{ opacity: 0 }}>
                <SectionTitle fg={fg}>Projects</SectionTitle>
                <div className="space-y-6">
                  <ProjectBlock
                    fg={fg}
                    title="Ecommerce Website"
                    subtitle="FrontEnd Development"
                    bullets={[
                      'Built ABHIPSA TRADERS using React (TypeScript) and Vite',
                      'Responsive UI with Tailwind CSS, shadcn/ui, and React Router',
                      'Used React Hook Form, Zod, TanStack Query',
                      'Backend with Node.js, Express, MongoDB, JWT',
                      'Features: CRUD, analytics dashboard, customer management',
                    ]}
                  />
                  <ProjectBlock
                    fg={fg}
                    title="Attendance Management"
                    subtitle="FrontEnd Development"
                    bullets={[
                      'Face Recognition Attendance System frontend using React',
                      'Dashboards for Admin, Teacher, Student',
                      'Webcam face capture integration',
                      'Component-based scalable architecture',
                      'Responsive UI and real-time interaction',
                    ]}
                  />
                </div>
              </div>

              {/* ── Education ── */}
              <div className="resume-section" style={{ opacity: 0 }}>
                <SectionTitle fg={fg}>Education</SectionTitle>
                <p className={`text-${fg}/55 text-sm sm:text-base leading-relaxed font-light`}>
                  Motivated BCA 2nd-year student at <span className={`text-${fg}/80 font-medium`}>Ravenshaw University</span> with strong frontend development skills and passion for modern responsive web applications.
                </p>
              </div>

              {/* ── Download Resume Button ── */}
              <div className="resume-section flex justify-center pt-2" style={{ opacity: 0 }}>
                <button
                  onClick={generateResumePDF}
                  className={`group relative inline-flex items-center gap-3 px-8 py-4 rounded-full
                             bg-${fg}/[0.06] border border-${fg}/[0.1]
                             hover:bg-${fg}/[0.12] hover:border-${fg}/[0.25]
                             backdrop-blur-xl shadow-[0_0_30px_rgba(0,0,0,0.03)]
                             transition-all duration-400 hover:scale-105 active:scale-95
                             text-${fg}/80 hover:text-${fg}
                             font-['UniversaNew'] text-sm sm:text-base tracking-widest uppercase font-bold
                             cursor-pointer`}
                >
                  <svg className="w-5 h-5 transition-transform duration-300 group-hover:translate-y-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                  </svg>
                  Download Resume
                </button>
              </div>

              {/* ── Bottom Accent Line ── */}
              <div className="resume-section pt-4" style={{ opacity: 0 }}>
                <div className={`h-px w-full bg-gradient-to-r from-transparent via-${fg}/10 to-transparent`} />
                <p className={`text-center text-${fg}/20 text-[10px] tracking-[0.4em] uppercase mt-4 font-mono`}>
                  Available for opportunities
                </p>
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ── Scoped Keyframes ── */}
      <style>{`
        @keyframes hireMeFloat {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(15px, -20px) scale(1.1); }
          66% { transform: translate(-10px, 15px) scale(0.95); }
        }
      `}</style>
    </>
  );
};

/* ═══════════════════════════════════════════
   SUB-COMPONENTS (kept in same file for cohesion)
   ═══════════════════════════════════════════ */

const SectionTitle = ({ children, fg = 'black' }) => (
  <div className="flex items-center gap-4 mb-4">
    <h3 className={`font-['OriginTech'] text-sm sm:text-base font-bold text-${fg}/90 tracking-widest uppercase whitespace-nowrap`}>
      {children}
    </h3>
    <div className={`flex-1 h-px bg-gradient-to-r from-${fg}/10 to-transparent`} />
  </div>
);

const SkillPill = ({ label, value, fg = 'black' }) => (
  <div className={`flex items-start gap-2 p-3 sm:p-4 rounded-xl bg-${fg}/[0.03] border border-${fg}/[0.06] hover:bg-${fg}/[0.05] hover:border-${fg}/[0.1] transition-all duration-300`}>
    <span className={`text-${fg}/40 text-xs font-mono tracking-wider uppercase shrink-0 mt-0.5`}>{label}</span>
    <span className={`text-${fg}/70 text-xs sm:text-sm font-light`}>{value}</span>
  </div>
);

const ProjectBlock = ({ title, subtitle, bullets, fg = 'black' }) => (
  <div className={`relative pl-5 border-l border-${fg}/[0.06] hover:border-${fg}/[0.12] transition-colors duration-500 group`}>
    <div className={`absolute top-1.5 left-[-4px] w-2 h-2 rounded-full bg-${fg}/20 group-hover:bg-${fg}/40 transition-colors duration-300`} />
    <h4 className={`text-${fg}/90 font-['UniversaNew'] font-bold text-sm sm:text-base tracking-wide uppercase`}>
      {title}
      <span className={`text-${fg}/35 font-normal normal-case text-xs ml-2`}>– {subtitle}</span>
    </h4>
    <ul className={`mt-2 space-y-1 text-${fg}/50 text-xs sm:text-sm font-light leading-relaxed`}>
      {bullets.map((b, i) => (
        <li key={i} className="flex gap-2">
          <span className={`text-${fg}/20 mt-0.5 shrink-0`}>▸</span>
          {b}
        </li>
      ))}
    </ul>
  </div>
);

export default HireMeResume;
