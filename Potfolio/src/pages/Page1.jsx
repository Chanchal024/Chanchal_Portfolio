import TiltText from "../components/TiltText";
import Logo from "../components/Logo";
import Header from "../components/Header";
import NavBar from "../components/NavBar";
import Page1Bottom from "../components/Page1Bottom";
import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

const Page1 = ({ theme, toggleTheme, onHireMe, onMenuToggle }) => {
    const tiltRef = useRef(null);
    const resetTimeoutRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (!tiltRef.current) return;
            // Disable 3D tilt animation on mobile for better performance and touch UX
            if (window.innerWidth < 768) return;

            // Clear previous reset timeout
            clearTimeout(resetTimeoutRef.current);

            const rect = tiltRef.current.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            const deltaX = e.clientX - centerX;
            const deltaY = e.clientY - centerY;

            const rotateX = (deltaY / 18).toFixed(2);
            const rotateY = (deltaX / -18).toFixed(2);

            // Animate tilt with overwrite so it doesn't conflict
            gsap.to(tiltRef.current, {
                duration: 0.1,
                ease: 'linear',
                rotateX,
                rotateY,
                z: 20,
                transformPerspective: 1000,
                transformOrigin: 'center',
                overwrite: true, // prevent animation conflict
            });

            // Schedule reset after 200ms of inactivity
            resetTimeoutRef.current = setTimeout(() => {
                if (!tiltRef.current) return;

                gsap.to(tiltRef.current, {
                    duration: 2,
                    ease: 'power3.out',
                    rotateX: 0,
                    rotateY: 0,
                    z: 0,
                    overwrite: true,
                });
            }, 200);
        };

        const handleMouseLeave = () => {
            clearTimeout(resetTimeoutRef.current);
            if (!tiltRef.current) return;

            gsap.to(tiltRef.current, {
                duration: 2,
                ease: 'power3.out',
                rotateX: 0,
                rotateY: 0,
                z: 0,
                overwrite: true,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseleave', handleMouseLeave);
            clearTimeout(resetTimeoutRef.current);
        };
    }, []);

    return (
        <div id='page1' className='flex items-center justify-start h-screen h-[100dvh] p-[3.5rem_0.75rem_2rem] min-[480px]:p-[4rem_1rem_2rem] sm:p-[4.5rem_1.5rem_2.5rem] md:p-[5rem_3rem_3rem] lg:p-[5rem_5rem_3rem] min-[1200px]:p-[5rem_6rem_3rem] bg-transparent relative z-[2] overflow-hidden'>
            {/* ── Hero content ── */}
            <div className='flex items-center justify-start w-full max-w-[1440px] min-[1920px]:max-w-[1800px] ml-[2vw] min-[480px]:ml-[3vw] sm:ml-[4vw] md:ml-[8vw] lg:ml-[4vw] xl:ml-[5vw] min-[1440px]:ml-[10vw] min-[1920px]:ml-[12vw] pointer-events-none z-[10]'>
                <TiltText abc={tiltRef} />
            </div>

            {/* ── Absolute positioned UI (unchanged) ── */}
            <Logo />
            <NavBar />
            <Header theme={theme} toggleTheme={toggleTheme} onHireMe={onHireMe} onMenuToggle={onMenuToggle} />
            <Page1Bottom />

            {/* ── Light Mode Robot Image ── */}
            {theme === 'light' && (
                <div className="absolute bottom-0 right-0 h-[60vh] min-[480px]:h-[70vh] sm:h-[75vh] md:h-[90vh] lg:h-[85vh] xl:h-[95vh] min-[1440px]:h-[115vh] min-[1920px]:h-[125vh] w-[95vw] min-[480px]:w-[92vw] sm:w-[87vw] md:w-[82vw] lg:w-[73vw] xl:w-[80vw] min-[1440px]:w-[92vw] min-[1920px]:w-[100vw] z-[1] sm:z-[5] md:z-[10000] pointer-events-none flex items-end justify-end overflow-visible opacity-25 min-[480px]:opacity-35 sm:opacity-50 md:opacity-80 lg:opacity-100" style={{ animation: 'fadeIn 1.5s ease-out forwards' }}>
                    <img 
                        src="/picc2.png" 
                        alt="White Robot" 
                        className="h-[90%] sm:h-[95%] md:h-[100%] lg:h-[85%] xl:h-[95%] min-[1440px]:h-[100%] 2xl:h-[115%] min-[1920px]:h-[130%] w-[90%] sm:w-[95%] md:w-[100%] lg:w-[85%] xl:w-[95%] min-[1440px]:w-[100%] 2xl:w-[115%] min-[1920px]:w-[130%] object-contain object-right-bottom mr-[-8%] mb-[-8%] filter drop-shadow-[0_0_40px_rgba(0,0,0,0.08)] transition-transform duration-[3s] hover:scale-[1.02]"
                    />
                </div>
            )}

            {/* ── Dark Mode Robot Image ── */}
            {theme === 'dark' && (
                <div className="absolute bottom-0 right-0 h-[50vh] min-[480px]:h-[60vh] sm:h-[65vh] md:h-[80vh] lg:h-[75vh] xl:h-[85vh] min-[1440px]:h-[105vh] min-[1920px]:h-[115vh] w-[92vw] min-[480px]:w-[87vw] sm:w-[82vw] md:w-[77vw] lg:w-[68vw] xl:w-[74vw] min-[1440px]:w-[87vw] min-[1920px]:w-[95vw] z-[1] sm:z-[5] md:z-[10000] pointer-events-none flex items-end justify-end overflow-visible opacity-25 min-[480px]:opacity-35 sm:opacity-50 md:opacity-80 lg:opacity-100" style={{ animation: 'fadeIn 1.5s ease-out forwards' }}>
                    <img 
                        src="/picc.png" 
                        alt="Dark Robot" 
                        className="h-[80%] sm:h-[85%] md:h-[90%] lg:h-[75%] xl:h-[85%] min-[1440px]:h-[95%] 2xl:h-[125%] min-[1920px]:h-[140%] w-[80%] sm:w-[85%] md:w-[90%] lg:w-[75%] xl:w-[85%] min-[1440px]:w-[95%] 2xl:w-[125%] min-[1920px]:w-[140%] object-contain object-right-bottom mr-[3%] mb-[0%] filter drop-shadow-[0_0_40px_rgba(255,255,255,0.08)] transition-transform duration-[3s] hover:scale-[1.02]"
                    />
                </div>
            )}
            {/* ── Download Resume — Left Middle (Vertical) ── */}
            <button
              onClick={async () => {
                const { jsPDF } = await import('jspdf');
                const doc = new jsPDF({ unit: 'mm', format: 'a4' });
                const pageW = doc.internal.pageSize.getWidth();
                const margin = 20;
                const contentW = pageW - margin * 2;
                let y = 20;
                const addLine = () => { doc.setDrawColor(200); doc.line(margin, y, pageW - margin, y); y += 4; };
                const checkPage = (needed = 12) => { if (y + needed > 275) { doc.addPage(); y = 20; } };

                doc.setFont('helvetica', 'bold'); doc.setFontSize(22);
                doc.text('CHANCHAL MANDAL', pageW / 2, y, { align: 'center' }); y += 8;
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
                doc.text('+91-7606940215  |  EMAIL  |  LinkedIn  |  GitHub  |  Portfolio', pageW / 2, y, { align: 'center' }); y += 6;
                addLine();

                doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
                doc.text('SUMMARY', margin, y); y += 6;
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
                const sLines = doc.splitTextToSize('Frontend Developer crafting fast, interactive UIs with React, Tailwind CSS, GSAP, and modern JavaScript.', contentW);
                doc.text(sLines, margin, y); y += sLines.length * 5 + 4; addLine();

                doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
                doc.text('TECHNICAL SKILLS', margin, y); y += 6;
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
                doc.text('\u2022  FrontEnd: HTML, CSS, JavaScript', margin + 2, y); y += 5;
                doc.text('\u2022  Framework: Tailwind CSS, React, GSAP, Bootstrap', margin + 2, y); y += 6; addLine();

                doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
                doc.text('EXPERIENCE', margin, y); y += 7; doc.setFontSize(11);
                doc.text('Frontend Developer Intern \u2013 InternPe', margin, y);
                doc.setFont('helvetica', 'normal'); doc.setFontSize(9);
                doc.text('June 2025 \u2013 July 2025', pageW - margin, y, { align: 'right' }); y += 6;
                doc.setFontSize(10);
                ['Worked on real-world projects using HTML, CSS, JavaScript, and React.js', 'Built responsive and interactive web applications'].forEach(b => { checkPage(); doc.text(`\u2022  ${b}`, margin + 2, y); y += 5; });
                y += 2; addLine();

                doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
                doc.text('PROJECTS', margin, y); y += 7;
                checkPage(35); doc.setFontSize(11);
                doc.text('Ecommerce Website \u2013 FrontEnd Development', margin, y); y += 6;
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
                ['Built ABHIPSA TRADERS using React (TypeScript) and Vite', 'Responsive UI with Tailwind CSS, shadcn/ui, and React Router', 'Used React Hook Form, Zod, TanStack Query', 'Backend with Node.js, Express, MongoDB, JWT', 'Features: CRUD, analytics dashboard, customer management'].forEach(b => { checkPage(); doc.text(`\u2022  ${b}`, margin + 2, y); y += 5; });
                y += 4; checkPage(35); doc.setFont('helvetica', 'bold'); doc.setFontSize(11);
                doc.text('Attendance Management \u2013 FrontEnd Development', margin, y); y += 6;
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
                ['Face Recognition Attendance System frontend using React', 'Dashboards for Admin, Teacher, Student', 'Webcam face capture integration', 'Component-based scalable architecture', 'Responsive UI and real-time interaction'].forEach(b => { checkPage(); doc.text(`\u2022  ${b}`, margin + 2, y); y += 5; });
                y += 2; addLine();

                checkPage(20); doc.setFont('helvetica', 'bold'); doc.setFontSize(12);
                doc.text('EDUCATION', margin, y); y += 6;
                doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
                const eduLines = doc.splitTextToSize('Motivated BCA 2nd-year student at Ravenshaw University with strong frontend development skills and passion for modern responsive web applications.', contentW);
                doc.text(eduLines, margin, y);
                doc.save('Chanchal_Mandal_Resume.pdf');
              }}
              className={`absolute left-0 top-1/2 -translate-y-1/2 z-[20] pointer-events-auto cursor-pointer
                         hidden sm:flex items-center justify-center
                         py-5 sm:py-6 lg:py-5 xl:py-6 min-[1440px]:py-8 2xl:py-10 px-1.5 sm:px-2 lg:px-1.5 xl:px-2 min-[1440px]:px-3 2xl:px-4
                         border border-white/20 rounded-none
                         backdrop-blur-sm
                         transition-all duration-300 hover:scale-105 active:scale-95
                         shadow-[0_4px_20px_rgba(0,0,0,0.1)]
                         group
                         ${theme === 'light' ? 'bg-black hover:bg-black/90' : 'bg-white hover:bg-white/90 hover:border-white/40'}`}
              aria-label="Download Resume"
            >
              <span className="font-['UniversaNew'] text-xs sm:text-sm lg:text-[10px] xl:text-xs min-[1440px]:text-sm 2xl:text-lg tracking-[0.25em] uppercase font-semibold"
                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', color: theme === 'light' ? '#ffffff' : '#000000' }}
              >
                Download Resume
              </span>
            </button>

            {/* ── Let's Connect — Bottom Center ── */}
            <button
              onClick={() => {
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className={`absolute bottom-0 left-1/2 -translate-x-1/2 z-[30] pointer-events-auto cursor-pointer
                         flex items-center gap-3 2xl:gap-3
                         px-7 py-3.5 sm:px-9 sm:py-4 lg:px-6 lg:py-3 xl:px-7 xl:py-3.5 min-[1440px]:px-9 min-[1440px]:py-4 2xl:px-10 2xl:py-4
                         border border-white/20 rounded-none
                         backdrop-blur-sm
                         transition-all duration-300 hover:scale-105 active:scale-95
                         shadow-[0_4px_20px_rgba(0,0,0,0.1)]
                         group
                         ${theme === 'light' ? 'bg-black hover:bg-black/90' : 'bg-white hover:bg-white/90 hover:border-white/40'}`}
              aria-label="Let's Connect"
            >
              <span className="font-['UniversaNew'] text-xs sm:text-sm lg:text-[10px] xl:text-xs min-[1440px]:text-sm 2xl:text-base tracking-[0.25em] uppercase font-semibold"
                    style={{ color: theme === 'light' ? '#ffffff' : '#000000' }}>
                Let's Connect
              </span>
              <svg className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-5 2xl:h-5 animate-bounce" viewBox="0 0 24 24" fill="none" stroke={theme === 'light' ? '#ffffff' : '#000000'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>
        </div>
    );
};

export default Page1;
