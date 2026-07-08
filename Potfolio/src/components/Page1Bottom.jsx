import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';
import 'remixicon/fonts/remixicon.css';

const Page1Bottom = () => {
  const iconRef = useRef(null);

  useEffect(() => {
    gsap.to(iconRef.current, {
      rotation: 360,
      duration: 5,
      repeat: -1,
      ease: 'linear',
    });
  }, []);

  return (
    <div className="sub-text absolute left-0 bottom-0 p-4 sm:p-6 md:p-10 flex flex-col md:flex-row items-start md:items-end justify-between w-full text-[var(--text-color)] pointer-events-none gap-4 md:gap-0 z-20">
      <div className="pointer-events-auto flex flex-col justify-center min-h-[44px]">
        <h2 className="text-[10px] sm:text-xs md:text-sm tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light">
          Frontend Developer | Logo Designer
        </h2>
        <h3 className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.1em] sm:tracking-[0.15em] uppercase text-[var(--text-color)]/40 mt-1">
          Open to Internship and Freelance Projects
        </h3>
      </div>

      <div 
        onClick={() => document.getElementById('section2')?.scrollIntoView({ behavior: 'smooth' })}
        className="
          border border-[var(--text-color)]/20 z-50
          h-12 w-12 sm:h-14 sm:w-14 md:h-20 md:w-20
          rounded-full flex items-center justify-center text-[var(--text-color)]
          self-end md:self-auto pointer-events-auto cursor-pointer
          transition-all duration-300
          hover:border-[var(--text-color)] hover:bg-[var(--text-color)]/10
          active:scale-90
        "
      >
        <i
          ref={iconRef}
          className="ri-arrow-down-s-line text-lg sm:text-xl md:text-3xl flex items-center justify-center"
        ></i>
      </div>
    </div>
  );
};

export default Page1Bottom;
