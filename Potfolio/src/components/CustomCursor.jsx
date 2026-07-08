import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const CustomCursor = () => {
  const cursorDotRef = useRef(null);
  const cursorAuraRef = useRef(null);
  const cursorTextRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Disable on mobile
    if (window.innerWidth <= 768) {
      setIsMobile(true);
      return;
    }

    const dot = cursorDotRef.current;
    const aura = cursorAuraRef.current;
    const text = cursorTextRef.current;

    // Set initial position
    gsap.set(dot, { xPercent: -50, yPercent: -50 });
    gsap.set(aura, { xPercent: -50, yPercent: -50 });

    // State for cursor
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    
    // QuickSetters for performance
    const xSetDot = gsap.quickSetter(dot, "x", "px");
    const ySetDot = gsap.quickSetter(dot, "y", "px");
    const xSetAura = gsap.quickSetter(aura, "x", "px");
    const ySetAura = gsap.quickSetter(aura, "y", "px");

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      
      // Update CSS variables for global distortion effects
      document.documentElement.style.setProperty('--cursor-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--cursor-y', `${mouseY}px`);

      // Dot follows instantly
      xSetDot(mouseX);
      ySetDot(mouseY);
    };

    // Smooth aura follow loop
    const ticker = gsap.ticker.add(() => {
      // Lerp for smooth inertia
      const dt = 1.0 - Math.pow(0.8, gsap.ticker.deltaRatio()); 
      
      const currentX = gsap.getProperty(aura, "x");
      const currentY = gsap.getProperty(aura, "y");
      
      xSetAura(currentX + (mouseX - currentX) * 0.15);
      ySetAura(currentY + (mouseY - currentY) * 0.15);
    });

    window.addEventListener("mousemove", onMouseMove);

    // Hover interactions
    const handleMouseEnterText = () => {
      gsap.to(aura, {
        width: 100,
        height: 100,
        backgroundColor: 'rgba(255, 255, 255, 1)',
        border: 'none',
        duration: 0.4,
        ease: "power3.out"
      });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
    };

    const handleMouseLeaveText = () => {
      gsap.to(aura, {
        width: 40,
        height: 40,
        backgroundColor: 'transparent',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        duration: 0.4,
        ease: "power3.out"
      });
      gsap.to(dot, { opacity: 1, duration: 0.2 });
    };

    const handleMouseEnterImage = () => {
      gsap.to(aura, {
        width: 80,
        height: 80,
        backgroundColor: 'rgba(255,255,255,0.8)',
        backdropFilter: 'none',
        border: 'none',
        duration: 0.4,
        ease: "power3.out"
      });
      gsap.to(dot, { opacity: 0, duration: 0.2 });
      if (text) {
        text.innerText = "VIEW";
        gsap.to(text, { opacity: 1, scale: 1, duration: 0.3 });
      }
    };

    const handleMouseLeaveImage = () => {
      handleMouseLeaveText(); // reset to default
      if (text) {
        gsap.to(text, { opacity: 0, scale: 0.5, duration: 0.2, onComplete: () => text.innerText = "" });
      }
    };
    
    const handleMouseEnterLink = () => {
      gsap.to(aura, {
        width: 60,
        height: 60,
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        border: '1px solid rgba(255, 255, 255, 1)',
        duration: 0.4,
        ease: "power3.out"
      });
      gsap.to(dot, { scale: 1.5, duration: 0.3 });
    };

    const handleMouseLeaveLink = () => {
      handleMouseLeaveText();
      gsap.to(dot, { scale: 1, duration: 0.3 });
    };

    // Add listeners to DOM elements
    const attachListeners = () => {
      document.querySelectorAll('h1, h2, h3, p.text-fluid-body, .text-fluid-subheading, .hud-nav-link, .hud-nav-link *, .hud-btn, .hud-btn *').forEach(el => {
        if (el.closest('#section2')) return; // Skip text hover effects in Page 2
        el.addEventListener('mouseenter', handleMouseEnterText);
        el.addEventListener('mouseleave', handleMouseLeaveText);
        // Optional: Add local magnetic effect to text
        el.classList.add('cursor-hover-text');
      });

      document.querySelectorAll('img, video, canvas, .project-card').forEach(el => {
        if (el.classList.contains('no-hover-effect') || el.closest('.no-hover-effect')) return;
        el.addEventListener('mouseenter', handleMouseEnterImage);
        el.addEventListener('mouseleave', handleMouseLeaveImage);
        el.classList.add('cursor-hover-image');
      });
      
      document.querySelectorAll('a, button').forEach(el => {
        if (el.classList.contains('hud-nav-link') || el.classList.contains('hud-btn')) return; // HUD links/buttons use text hover reveal
        el.addEventListener('mouseenter', handleMouseEnterLink);
        el.addEventListener('mouseleave', handleMouseLeaveLink);
      });


    };

    // Delay attachment slightly to ensure DOM is ready
    setTimeout(attachListeners, 1000);
    
    // Use MutationObserver to attach listeners to newly added elements (like modals)
    const observer = new MutationObserver((mutations) => {
        attachListeners();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      gsap.ticker.remove(ticker);
      observer.disconnect();
    };
  }, []);

  if (isMobile) return null;

  return (
    <>
      <div 
        ref={cursorAuraRef}
        className="fixed top-0 left-0 w-10 h-10 border border-white/50 rounded-full pointer-events-none z-[999999] flex items-center justify-center overflow-hidden will-change-transform mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      >
        <span 
          ref={cursorTextRef} 
          className="text-[10px] font-black text-black tracking-widest opacity-0 scale-50 transition-all duration-300"
        >
        </span>
      </div>
      <div 
        ref={cursorDotRef}
        className="fixed top-0 left-0 w-2 h-2 bg-white rounded-full pointer-events-none z-[1000000] will-change-transform mix-blend-difference"
        style={{ transform: 'translate(-50%, -50%)' }}
      />
      
      {/* Global SVG Filters for Distortion Effects */}
      <svg className="hidden w-0 h-0 absolute">
        <filter id="liquid-warp">
          <feTurbulence type="fractalNoise" baseFrequency="0.015" numOctaves="3" result="warpNoise">
             <animate attributeName="baseFrequency" values="0.015;0.025;0.015" dur="10s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="30" in="SourceGraphic" in2="warpNoise" />
        </filter>
        <filter id="text-ripple">
          <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="1" result="rippleNoise">
            <animate attributeName="baseFrequency" values="0.05;0.08;0.05" dur="5s" repeatCount="indefinite" />
          </feTurbulence>
          <feDisplacementMap xChannelSelector="R" yChannelSelector="G" scale="10" in="SourceGraphic" in2="rippleNoise" />
        </filter>
      </svg>
    </>
  );
};

export default CustomCursor;
