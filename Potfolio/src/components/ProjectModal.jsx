import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import DeviceFrame from './DeviceFrame';

/**
 * ProjectModal — Overlay with animated device previews using Tailwind.
 * Displays the selected project inside laptop, tablet & phone frames.
 */
const ProjectModal = ({ project, onClose }) => {
  const overlayRef = useRef(null);
  const contentRef = useRef(null);

  /* ── Enter animation ── */
  useEffect(() => {
    gsap.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' }
    );
    gsap.fromTo(
      contentRef.current,
      { opacity: 0, scale: 0.92, y: 30 },
      { opacity: 1, scale: 1, y: 0, duration: 0.45, ease: 'power3.out', delay: 0.08 }
    );

    /* Lock body scroll while modal is open */
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  /* ── Close with exit animation ── */
  const handleClose = () => {
    gsap.to(contentRef.current, {
      opacity: 0, scale: 0.95, y: 20,
      duration: 0.28, ease: 'power2.in',
    });
    gsap.to(overlayRef.current, {
      opacity: 0, duration: 0.3, ease: 'power2.in',
      onComplete: onClose,
    });
  };

  /* Close on Escape key */
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black p-[1rem] overflow-y-auto" ref={overlayRef} onClick={handleClose}>
      <div
        className="relative w-full max-w-[960px] max-h-[90vh] overflow-y-auto bg-black border border-white/10 rounded-[20px] p-[2.5rem_2rem_2rem] shadow-[0_24px_80px_rgba(255,255,255,0.05)] scrollbar-thin scrollbar-thumb-[#333] scrollbar-track-transparent max-sm:p-[2rem_1.25rem_1.5rem] max-sm:rounded-[14px]"
        ref={contentRef}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button 
          className="absolute top-[1rem] right-[1rem] w-[36px] h-[36px] rounded-full border border-white/15 bg-white/5 text-white text-[1.2rem] cursor-pointer flex items-center justify-center transition-colors duration-250 z-[10] leading-none hover:bg-white/12 hover:border-white/30" 
          style={{ mixBlendMode: 'normal' }}
          onClick={handleClose} 
          aria-label="Close"
        >
          &#x2715;
        </button>

        {/* Project info */}
        <h3 className="font-['Inter'] font-bold text-[clamp(1.25rem,3vw,1.75rem)] text-white m-[0_0_0.3rem_0] tracking-tight" style={{ color: '#ffffff', mixBlendMode: 'normal', opacity: 1 }}>{project.title}</h3>
        <p className="font-['Inter'] font-normal text-[0.9rem] text-white/70 m-[0_0_2rem_0] leading-relaxed" style={{ color: '#ffffff', mixBlendMode: 'normal', opacity: 1 }}>{project.description}</p>

        {/* Device showcase */}
        <div className="flex flex-col items-center gap-[1.5rem]">
          {/* Row 1: Laptop (main) */}
          <DeviceFrame
            type="laptop"
            src={project.image}
            video={project.video}
            alt={project.title}
          />

          {/* Row 2: Tablet + Phone side by side */}
          <div className="flex items-end justify-center gap-[1.5rem] max-sm:gap-[1rem]">
            <DeviceFrame
              type="tablet"
              src={project.image}
              video={project.video}
              alt={project.title}
            />
            <DeviceFrame
              type="phone"
              src={project.image}
              video={project.video}
              alt={project.title}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;
