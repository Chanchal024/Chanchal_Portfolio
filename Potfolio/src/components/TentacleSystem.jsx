import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import gsap from 'gsap';
import TentacleNode from './TentacleNode';
import DevicePreview from './DevicePreview';
import OneTimeHint from './OneTimeHint';

/**
 * Generate a smooth cubic bézier path from origin to target.
 * The control points create an organic, fluid curve.
 */
const buildPath = (ox, oy, tx, ty) => {
  const dx = tx - ox;
  const dy = ty - oy;

  /* Offset control points perpendicular to the line for organic curvature */
  const cx1 = ox + dx * 0.25 + dy * 0.15;
  const cy1 = oy + dy * 0.25 - dx * 0.1;
  const cx2 = ox + dx * 0.7 - dy * 0.12;
  const cy2 = oy + dy * 0.7 + dx * 0.08;

  return `M ${ox} ${oy} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${tx} ${ty}`;
};

/**
 * Compute node target positions radiating from the origin.
 * Distributes nodes in an arc around the origin point.
 */
const computeNodePositions = (originX, originY, count, viewW, viewH) => {
  const positions = [];
  const isMobile = viewW < 640;
  const radius = isMobile ? Math.min(viewW, viewH) * 0.32 : Math.min(viewW, viewH) * 0.34;

  /* Spread nodes in an arc — start from top-left, sweep clockwise */
  const startAngle = -Math.PI * 0.7;
  const endAngle = Math.PI * 0.7;
  const step = (endAngle - startAngle) / (count - 1 || 1);

  for (let i = 0; i < count; i++) {
    const angle = count === 1 ? 0 : startAngle + step * i;
    let x = originX + Math.cos(angle) * radius;
    let y = originY + Math.sin(angle) * radius;

    /* Clamp to viewport with padding */
    const pad = isMobile ? 60 : 90;
    x = Math.max(pad, Math.min(viewW - pad, x));
    y = Math.max(pad, Math.min(viewH - pad, y));

    positions.push({ x, y });
  }
  return positions;
};

/**
 * TentacleSystem — The main orchestrator using Tailwind.
 * Renders SVG tentacle lines from origin, node cards at endpoints,
 * and the inline DevicePreview when a node is clicked.
 */
const TentacleSystem = ({ projects, origin, onClose }) => {
  const svgRef = useRef(null);
  const lineRefs = useRef([]);
  const backdropRef = useRef(null);
  const systemRef = useRef(null);

  const [expandedProject, setExpandedProject] = useState(null);
  const [viewSize, setViewSize] = useState({
    w: window.innerWidth,
    h: window.innerHeight,
  });

  /* Track viewport size */
  useEffect(() => {
    const onResize = () =>
      setViewSize({ w: window.innerWidth, h: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  /* On mobile, limit to 3 tentacles */
  const isMobile = viewSize.w < 640;
  const visibleProjects = isMobile ? projects.slice(0, 3) : projects;

  /* Origin coordinates (center of the "View Project" button) */
  const ox = origin?.x ?? viewSize.w / 2;
  const oy = origin?.y ?? viewSize.h / 2;

  /* Compute target node positions */
  const nodePositions = useMemo(
    () => computeNodePositions(ox, oy, visibleProjects.length, viewSize.w, viewSize.h),
    [ox, oy, visibleProjects.length, viewSize.w, viewSize.h]
  );

  /* Build SVG paths */
  const paths = useMemo(
    () => nodePositions.map((pos) => buildPath(ox, oy, pos.x, pos.y)),
    [ox, oy, nodePositions]
  );

  /* ── GSAP entrance animation ── */
  useEffect(() => {
    /* Fade in backdrop */
    if (backdropRef.current) {
      gsap.fromTo(backdropRef.current, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: 'power2.out' });
    }

    /* Animate each tentacle line with stagger */
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const length = line.getTotalLength();

      gsap.set(line, {
        strokeDasharray: length,
        strokeDashoffset: length,
        opacity: 1,
      });

      gsap.to(line, {
        strokeDashoffset: 0,
        duration: 0.8,
        ease: 'power2.inOut',
        delay: i * 0.12,
      });
    });
  }, [paths]);

  /* ── Close with exit animation ── */
  const handleClose = useCallback(() => {
    setExpandedProject(null);

    const tl = gsap.timeline({ onComplete: onClose });

    /* Fade out nodes first */
    tl.to('.tnode', { opacity: 0, scale: 0.6, duration: 0.25, stagger: 0.05, ease: 'power2.in' }, 0);

    /* Retract lines */
    lineRefs.current.forEach((line, i) => {
      if (!line) return;
      const length = line.getTotalLength();
      tl.to(line, { strokeDashoffset: length, duration: 0.5, ease: 'power2.in' }, 0.1 + i * 0.06);
    });

    /* Fade backdrop */
    if (backdropRef.current) {
      tl.to(backdropRef.current, { opacity: 0, duration: 0.35 }, 0.15);
    }
  }, [onClose]);

  /* Close on Escape */
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (expandedProject) setExpandedProject(null);
        else handleClose();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [expandedProject, handleClose]);

  return (
    <div
      className="fixed inset-0 z-[9998] pointer-events-auto"
      ref={systemRef}
    >
      {/* Dimmed backdrop */}
      <div className="absolute inset-0 bg-black/75 cursor-pointer" ref={backdropRef} onClick={handleClose} />

      {/* Origin pulse dot */}
      <div 
        className="absolute w-[12px] h-[12px] rounded-full bg-white/60 shadow-[0_0_20px_rgba(255,255,255,0.3),0_0_40px_rgba(255,255,255,0.1)] -translate-x-1/2 -translate-y-1/2 z-[2] pointer-events-none before:content-[''] before:absolute before:inset-[-6px] before:rounded-full before:border before:border-white/20 before:animate-[tentacle-pulse_2s_ease-in-out_infinite]" 
        style={{ left: ox, top: oy }} 
      />

      {/* SVG tentacle lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" ref={svgRef}>
        <defs>
          <linearGradient id="tentacle-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.6)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>
        </defs>
        {paths.map((d, i) => (
          <path
            key={i}
            className="fill-none stroke-[1.5px] [stroke-linecap:round] opacity-0 [filter:drop-shadow(0_0_8px_rgba(255,255,255,0.1))]"
            style={{ stroke: 'url(#tentacle-grad)' }}
            d={d}
            ref={(el) => (lineRefs.current[i] = el)}
          />
        ))}
      </svg>

      {/* Node cards at tentacle endpoints */}
      {visibleProjects.map((proj, i) => (
        <TentacleNode
          key={proj.id}
          project={proj}
          position={nodePositions[i]}
          delay={i * 0.12}
          onClick={setExpandedProject}
        />
      ))}

      {/* One-time helper text */}
      <OneTimeHint />

      {/* Close button */}
      <button
        className="fixed top-[1.25rem] right-[1.25rem] w-[40px] h-[40px] rounded-full bg-black/60 text-white text-[1.1rem] cursor-pointer flex items-center justify-center z-[100] transition-colors duration-250 leading-none pointer-events-auto"
        onClick={handleClose}
        aria-label="Close tentacles"
      >
        &#x2715;
      </button>

      {/* Expanded project view */}
      {expandedProject && (
        <DevicePreview 
          project={expandedProject} 
          onClose={() => setExpandedProject(null)} 
        />
      )}

    </div>
  );
};

export default TentacleSystem;
