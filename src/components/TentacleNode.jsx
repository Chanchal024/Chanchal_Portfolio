import React, { useRef, useEffect } from 'react';
import gsap from 'gsap';

/**
 * TentacleNode — Text-only project name at the end of a tentacle line using Tailwind.
 * No images or thumbnails — clean typography only.
 */
const TentacleNode = ({ project, position, delay, onClick }) => {
  const nodeRef = useRef(null);

  useEffect(() => {
    if (!nodeRef.current) return;

    gsap.fromTo(
      nodeRef.current,
      { opacity: 0, scale: 0.5 },
      {
        opacity: 1,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        delay: delay + 0.3,
      }
    );
  }, [delay]);

  return (
    <div
      className="tnode absolute -translate-x-1/2 -translate-y-1/2 z-[5] pointer-events-auto opacity-0"
      ref={nodeRef}
      style={{ left: position.x, top: position.y }}
    >
      <div className="absolute top-1/2 left-1/2 w-[6px] h-[6px] bg-white/50 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
      <div 
        className="group flex items-center justify-center p-[0.6rem_1.4rem] bg-[#0d0d0f]/95 rounded-full cursor-pointer transition-all duration-400 ease-out max-sm:p-[0.4rem_1rem]" 
        onClick={() => onClick(project)}
      >
        <span className="font-['Inter'] font-medium text-[0.85rem] text-white/60 tracking-wider text-center whitespace-nowrap transition-all duration-300 group-hover:text-white max-sm:text-[0.7rem]">{project.title}</span>
      </div>
    </div>
  );
};

export default TentacleNode;
