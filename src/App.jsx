import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/ScrollTrigger'

import Page1 from './pages/Page1'
import Page2 from './pages/Page2'
import Page3 from './pages/Page3'
import Page4 from './pages/Page4'
import Page5 from './pages/Page5'
import AboutMe from './components/AboutMe'
import Footer from './components/Footer'
import CyberHero from './components/CyberHero'
import CustomCursor from './components/CustomCursor'
import HireMeResume from './components/HireMeResume'
import FloatingMenu from './components/FloatingMenu'

import useScrollReveal from './hooks/useScrollReveal';

gsap.registerPlugin(ScrollTrigger);

const App = () => {
  const [theme, setTheme] = React.useState(() => {
    return localStorage.getItem('theme') || 'dark';
  });

  const [isHireMeOpen, setIsHireMeOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.classList.toggle('light', theme === 'light');
  }, [theme]);

  const scrollRef = useRef(null);

  // ⚡ ACTIVATE CLEAN GLOBAL SCROLL REVEAL
  useScrollReveal();

  useEffect(() => {
    // 🧲 MAGNETIC ELEMENTS (Restored)
    document.querySelectorAll("[data-magnetic]").forEach((el) => {
      const handleMouseMove = (e) => {
        const rect = el.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        gsap.to(el, {
          x: x * 0.25,
          y: y * 0.25,
          duration: 0.3
        });
      };

      const handleMouseLeave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.3 });
      };

      el.addEventListener("mousemove", handleMouseMove);
      el.addEventListener("mouseleave", handleMouseLeave);
      
      el._handleMouseMove = handleMouseMove;
      el._handleMouseLeave = handleMouseLeave;
    });

    return () => {
      document.querySelectorAll("[data-magnetic]").forEach((el) => {
        if (el._handleMouseMove) el.removeEventListener("mousemove", el._handleMouseMove);
        if (el._handleMouseLeave) el.removeEventListener("mouseleave", el._handleMouseLeave);
      });
    };
  }, []);

  return (
    <>
      <CustomCursor />

      {/* Global Cyber Hero Background */}
      <CyberHero />
      
      {/* Main Content */}
      <div ref={scrollRef}>
        <Page1 theme={theme} toggleTheme={toggleTheme} onHireMe={() => setIsHireMeOpen(true)} onMenuToggle={() => setIsMenuOpen(!isMenuOpen)} />
        <Page2 />
        <Page3 />
        <Page4 />
        <AboutMe />
        <Page5 />
        <Footer />
      </div>

      {/* Hire Me Resume Overlay */}
      <HireMeResume isOpen={isHireMeOpen} onClose={() => setIsHireMeOpen(false)} theme={theme} />

      {/* Global Futuristic Floating Menu */}
      <FloatingMenu theme={theme} isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
    </>
  )
}

export default App