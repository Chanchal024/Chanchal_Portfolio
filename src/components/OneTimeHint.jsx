import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const STORAGE_KEY = 'portfolio_hint_shown';

/**
 * OneTimeHint — Shows "Click a project name to preview" only on the
 * very first tentacle expansion using Tailwind.
 */
const OneTimeHint = () => {
  const [visible, setVisible] = useState(false);
  const hintRef = useRef(null);

  useEffect(() => {
    /* Check if already shown this session */
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    /* Mark as shown */
    sessionStorage.setItem(STORAGE_KEY, '1');
    setVisible(true);

    /* Auto-dismiss after 3.5 seconds */
    const timer = setTimeout(() => {
      if (hintRef.current) {
        gsap.to(hintRef.current, {
          opacity: 0,
          y: -8,
          duration: 0.5,
          ease: 'power2.in',
          onComplete: () => setVisible(false),
        });
      }
    }, 3500);

    return () => clearTimeout(timer);
  }, []);

  /* Entrance animation */
  useEffect(() => {
    if (visible && hintRef.current) {
      gsap.fromTo(
        hintRef.current,
        { opacity: 0, y: 12 },
        { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out', delay: 0.8 }
      );
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <div 
      className="fixed bottom-[5rem] left-1/2 -translate-x-1/2 z-[9999] font-['Inter'] font-normal text-[0.8rem] text-white/50 tracking-[0.06em] p-[0.55rem_1.4rem] bg-[#141416]/90 border border-white/8 rounded-[100px] pointer-events-none whitespace-nowrap max-sm:text-[0.7rem] max-sm:bottom-[3.5rem]" 
      ref={hintRef}
    >
      Click a project name to preview
    </div>
  );
};

export default OneTimeHint;
