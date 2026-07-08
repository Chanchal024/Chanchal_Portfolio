import React, { useState, useEffect, useRef } from 'react';

const FloatingMenu = ({ theme, isOpen: externalIsOpen, setIsOpen: setExternalIsOpen }) => {
  const [localIsOpen, setLocalIsOpen] = useState(false);
  const isOpen = externalIsOpen !== undefined ? externalIsOpen : localIsOpen;
  const setIsOpen = setExternalIsOpen !== undefined ? setExternalIsOpen : setLocalIsOpen;
  const [activeSection, setActiveSection] = useState('#page1');
  const [isMobile, setIsMobile] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showButton, setShowButton] = useState(false);

  const navLinks = [
    { name: 'Home', href: '#page1' },
    { name: 'Projects', href: '#page3' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Track active section and button visibility via scroll listener
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        { id: '#page1', name: 'HOME' },
        { id: '#section2', name: 'DESIGN' },
        { id: '#page3', name: 'PROJECTS' },
        { id: '#skills', name: 'SKILLS' },
        { id: '#about', name: 'ABOUT' },
        { id: '#contact', name: 'CONTACT' }
      ];

      const viewportMiddle = window.innerHeight / 2;
      let closestSection = '#page1';
      let minDistance = Infinity;

      // Special check: if at the bottom of the page, force 'CONTACT'
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 60) {
        closestSection = '#contact';
      } else {
        sections.forEach(sec => {
          const el = document.querySelector(sec.id);
          if (el) {
            const rect = el.getBoundingClientRect();
            // If viewport center is inside this section
            if (rect.top <= viewportMiddle && rect.bottom >= viewportMiddle) {
              closestSection = sec.id;
              minDistance = 0;
            } else if (minDistance !== 0) {
              const distance = Math.abs(rect.top - viewportMiddle);
              if (distance < minDistance) {
                minDistance = distance;
                closestSection = sec.id;
              }
            }
          }
        });
      }

      setActiveSection(closestSection);
      
      // Hide button on the first page (home screen)
      setShowButton(window.scrollY > window.innerHeight * 0.6);
    };

    handleScroll(); // initial check
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsOpen(false);
    const target = document.querySelector(href);
    if (target) {
      // Small timeout to allow closing animation to start
      setTimeout(() => {
        target.scrollIntoView({ behavior: 'smooth' });
        setActiveSection(href);
      }, 250);
    }
  };

  // Dimensions based on viewport
  const radius = isMobile ? 120 : 320;
  const panelSize = isMobile ? 280 : 720;
  const angleRange = isMobile ? 100 : 110; // total angle spread in degrees
  const startAngle = -(angleRange / 2);
  const angleStep = angleRange / (navLinks.length - 1);

  const isButtonVisible = isOpen || showButton;

  const getButtonText = () => {
    if (isOpen) return 'CLOSE';
    
    const sectionNames = {
      '#page1': 'HOME',
      '#section2': 'DESIGN',
      '#page3': 'PROJECTS',
      '#skills': 'SKILLS',
      '#about': 'ABOUT',
      '#contact': 'CONTACT'
    };
    
    return sectionNames[activeSection] || 'MENU';
  };

  return (
    <>
      {/* Background dim overlay */}
      <div 
        onClick={() => setIsOpen(false)}
        className={`fixed inset-0 bg-white/15 backdrop-blur-md z-[9998] transition-opacity duration-500 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      />

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        data-magnetic
        className={`hud-btn fixed z-[10000] w-20 h-20 sm:w-24 sm:h-24 md:w-36 md:h-36 rounded-full flex items-center justify-center cursor-pointer group focus:outline-none ${
          isButtonVisible ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
        style={{
          right: isButtonVisible
            ? (isOpen 
                ? (isMobile ? '12px' : '24px') 
                : (isHovered ? (isMobile ? '8px' : '20px') : (isMobile ? '-40px' : '-72px')))
            : (isMobile ? '-100px' : '-160px'),
          top: isMobile ? 'calc(50% - 40px)' : 'calc(50% - 72px)',
          transition: 'right 0.35s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.35s ease, background-color 0.3s, border-color 0.3s, box-shadow 0.3s'
        }}
        aria-label="Toggle Menu"
      >
        <span 
          className="font-['OriginTech'] text-[12px] font-bold tracking-[0.05em] transition-transform duration-300"
          style={{
            color: 'var(--hud-btn-icon)',
            transform: (!isOpen && !isHovered) ? 'translateX(-30px)' : 'translateX(0px)'
          }}
        >
          {getButtonText()}
        </span>
      </button>

      {/* Futuristic Curved Navigation HUD Panel */}
      <div 
        className="fixed right-0 top-1/2 -translate-y-1/2 z-[9999] pointer-events-none flex items-center justify-end overflow-visible"
        style={{
          width: `${panelSize}px`,
          height: `${panelSize}px`
        }}
      >
        {/* The Glassmorphic Radial Shell */}
        <div 
          className="hud-radial-panel relative pointer-events-auto flex items-center justify-center rounded-full transition-all duration-[800ms] cubic-bezier(0.16, 1, 0.3, 1) select-none"
          style={{
            width: `${panelSize}px`,
            height: `${panelSize}px`,
            transform: isOpen 
              ? 'translate(50%, 0) rotate(0deg) scale(1)' 
              : 'translate(75%, 0) rotate(75deg) scale(0.15)',
            opacity: isOpen ? 1 : 0
          }}
        >
          {/* Animated Decorative HUD Elements (Rings) */}
          {isOpen && (
            <>
              {/* Outer White Ring */}
              <div 
                className="absolute rounded-full border-2 border-dashed animate-hud-spin pointer-events-none"
                style={{
                  width: `${radius * 2 + 50}px`,
                  height: `${radius * 2 + 50}px`,
                  borderColor: 'rgba(255, 255, 255, 0.35)'
                }}
              />
              {/* Inner White Ring */}
              <div 
                className="absolute rounded-full border-2 border-dotted animate-hud-spin-reverse pointer-events-none"
                style={{
                  width: `${radius * 2 - 35}px`,
                  height: `${radius * 2 - 35}px`,
                  borderColor: 'rgba(255, 255, 255, 0.25)'
                }}
              />
              {/* Subtle Pulsing Aura */}
              <div 
                className="absolute rounded-full animate-hud-pulse pointer-events-none filter blur-xl opacity-30"
                style={{
                  width: `${radius * 2 - 60}px`,
                  height: `${radius * 2 - 60}px`,
                  background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)'
                }}
              />
            </>
          )}

          {/* Curved Navigation Links */}
          {navLinks.map((link, index) => {
            const angle = startAngle + index * angleStep;
            const rad = (angle * Math.PI) / 180;
            const x = -Math.cos(rad) * radius;
            const y = Math.sin(rad) * radius;
            const isActive = activeSection === link.href;

            return (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleLinkClick(e, link.href)}
                className={`hud-nav-link absolute font-['OriginTech'] font-bold uppercase tracking-[0.2em] cursor-pointer select-none text-center ${
                  isActive ? 'active' : ''
                }`}
                style={{
                  left: '50%',
                  top: '50%',
                  transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px)) scale(${isActive ? 1.08 : 0.95})`,
                  opacity: isOpen ? 1 : 0,
                  fontSize: isMobile ? '14px' : '18px',
                  color: '#000000',
                  // staggered entrance transitions when menu is opened
                  transition: `
                    transform 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                    opacity 0.5s cubic-bezier(0.25, 1, 0.5, 1),
                    color 0.3s ease,
                    text-shadow 0.3s ease
                  `,
                  transitionDelay: isOpen ? `${index * 60 + 120}ms` : '0ms'
                }}
              >
                <div className="relative py-2 px-3 group/item flex items-center justify-center">
                  {/* Indicator Line / Dot */}
                  <span 
                    className={`absolute left-0 w-1.5 h-1.5 rounded-full transition-all duration-300 -translate-x-3 scale-0 group-hover/item:scale-100 bg-white shadow-[0_0_8px_#ffffff] ${isActive ? 'scale-100 opacity-100' : 'opacity-0'}`}
                  />
                  <span className="hover:tracking-[0.25em] transition-all duration-300 inline-block">
                    {link.name}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default FloatingMenu;
