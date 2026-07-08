import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ── Core strengths that orbit ── */
const coreSkills = [
  { name: 'React', icon: '⚛️' },
  { name: 'GSAP', icon: '✦' },
  { name: 'Three.js', icon: '🔮' },
  { name: 'JavaScript', icon: '⚡' },
  { name: 'CSS', icon: '🎯' },
]

/**
 * SignatureSkills — Orbital floating skill cluster.
 * Key skills drift in elliptical paths around a center hub,
 * with CSS-only ambient particles for depth.
 */
const SignatureSkills = () => {
  const containerRef = useRef(null)
  const nodeRefs = useRef([])

  useEffect(() => {
    const container = containerRef.current
    const nodes = nodeRefs.current.filter(Boolean)
    if (!container || !nodes.length) return

    const animations = []
    const isMobile = window.innerWidth < 640

    /* ── Fade-in on scroll ── */
    const revealAnim = gsap.fromTo(
      container,
      { opacity: 0, scale: 0.92 },
      {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 88%',
          toggleActions: 'play none none none',
        },
      }
    )
    animations.push(revealAnim)

    /* ── Orbital float for each node ── */
    const count = nodes.length
    /* Only show first 4 on mobile */
    const visibleCount = isMobile ? Math.min(4, count) : count

    nodes.forEach((node, i) => {
      if (i >= visibleCount) {
        gsap.set(node, { opacity: 0, display: 'none' })
        return
      }

      /* Distribute nodes evenly around the orbit */
      const angle = (i / visibleCount) * Math.PI * 2
      const radiusX = isMobile ? 38 : 42
      const radiusY = isMobile ? 38 : 42 // Circular orbit now

      /* Starting position */
      const startX = Math.cos(angle) * radiusX
      const startY = Math.sin(angle) * radiusY

      gsap.set(node, {
        xPercent: -50,
        yPercent: -50,
        left: '50%',
        top: '50%',
        x: startX * (container.offsetWidth / 100),
        y: startY * (container.offsetHeight / 100),
      })

      /* Continuous slow circular rotation */
      if (!isMobile) { // Disable rotation on mobile as requested
        const duration = 25 // 20-30s
        // Animate angle from current to current + 2PI
        const orbitObj = { angle: angle }
        const orbitAnim = gsap.to(orbitObj, {
          angle: angle + Math.PI * 2,
          duration: duration,
          ease: 'none',
          repeat: -1,
          onUpdate: () => {
            gsap.set(node, {
              x: Math.cos(orbitObj.angle) * radiusX * (container.offsetWidth / 100),
              y: Math.sin(orbitObj.angle) * radiusY * (container.offsetHeight / 100),
            })
          }
        })
        animations.push(orbitAnim)
      }

      /* Gentle vertical drift for organic feel */
      const driftAnim = gsap.to(node, {
        y: `+=${8 + i * 2}`,
        duration: 3 + i * 0.5,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      })
      animations.push(driftAnim)

      /* Staggered node reveal */
      const nodeReveal = gsap.fromTo(
        node,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 1,
          ease: 'power2.out',
          delay: 0.6 + i * 0.1,
          scrollTrigger: {
            trigger: container,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        }
      )
      animations.push(nodeReveal)
    })

    return () => {
      animations.forEach((a) => {
        a.scrollTrigger?.kill()
        a.kill()
      })
    }
  }, [])

  return (
    <div 
      className="relative w-full max-w-[320px] aspect-square max-h-[240px] mx-auto mb-[1rem] flex items-center justify-center opacity-0 min-[480px]:max-w-[400px] min-[480px]:max-h-[300px] min-[480px]:mb-[1.2rem] md:max-w-[550px] md:max-h-[380px] md:mb-[1.5rem] lg:max-w-[500px] lg:max-h-[400px] lg:mb-0 xl:max-w-[800px] xl:max-h-[480px] xl:mb-[2rem]" 
      ref={containerRef}
    >
      {/* Label */}
      <span className="absolute top-[-2rem] left-1/2 -translate-x-1/2 font-['OriginTech'] font-extrabold text-[clamp(0.85rem,3vw,1.8rem)] tracking-[0.2em] uppercase text-[var(--heading-color)] whitespace-nowrap min-[480px]:top-[-2.5rem] md:top-[-2.8rem] lg:top-[-2.2rem]">
        Core Strengths
      </span>

      {/* Decorative orbit ring */}
      <div className="absolute top-1/2 left-1/2 rounded-full -translate-x-1/2 -translate-y-1/2 pointer-events-none w-[55%] h-[55%]" />

      {/* Center hub */}
      <div className="relative z-[5] flex flex-col items-center gap-[0.25rem]">
        <div className="hidden" />
        <span className="font-['OriginTech'] font-bold text-[0.9rem] text-[var(--text-color)]/60 tracking-[0.2em] uppercase mt-[0.6rem] min-[480px]:text-[1rem] md:text-[1.1rem] md:mt-[0.7rem] lg:mt-[0.6rem]">
          Skills
        </span>
      </div>

      {/* Particles (Ambient depth) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-full">
        {[...Array(8)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-[2px] h-[2px] rounded-full bg-white/12 [animation:sig-particle-float_8s_ease-in-out_infinite]"
            style={{
              top: `${[20, 60, 40, 75, 25, 55, 35, 80][i]}%`,
              left: `${[30, 70, 15, 45, 80, 25, 60, 75][i]}%`,
              animationDelay: `${[0, 1.5, 3, 4.5, 2, 5.5, 1, 3.5][i]}s`
            }}
          />
        ))}
      </div>

      {/* Orbiting skill nodes */}
      {coreSkills.map((skill, i) => (
        <div
          key={i}
          className="absolute flex items-center justify-center pointer-events-auto z-[3] group"
          ref={(el) => (nodeRefs.current[i] = el)}
        >
          <div className="flex items-center gap-[0.5rem] p-[0.5rem_1rem] bg-white/3 border border-white/10 rounded-[100px] backdrop-blur-[12px] cursor-default transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap hover:scale-110 hover:-translate-y-[2px] hover:border-white/30 hover:bg-white/8 hover:shadow-[0_10px_30px_rgba(0,0,0,0.4),0_0_20px_rgba(255,255,255,0.05)] min-[480px]:gap-[0.45rem] min-[480px]:p-[0.45rem_0.85rem] md:gap-[0.5rem] md:p-[0.55rem_1.1rem] lg:gap-[0.45rem] lg:p-[0.45rem_0.9rem] lg:backdrop-blur-[16px] xl:p-[0.7rem_1.4rem]">
            <span className="text-[1.1rem] min-[480px]:text-[1rem] md:text-[1.2rem] lg:text-[1.1rem] xl:text-[1.5rem]">{skill.icon}</span>
            <span className="font-['Universa'] font-semibold text-[0.8rem] text-[var(--text-color)]/90 tracking-wide group-hover:text-[var(--heading-color)] min-[480px]:text-[0.75rem] md:text-[0.85rem] lg:text-[0.8rem] xl:text-[1.05rem]">{skill.name}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

export default SignatureSkills

