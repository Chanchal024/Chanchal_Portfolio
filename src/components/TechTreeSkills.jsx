import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const leftSkills = [
  { name: 'Redux', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/redux.svg' },
  { name: 'TypeScript', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/typescript.svg' },
  { name: 'Next.js', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/nextdotjs.svg' },
]

const rightSkills = [
  { name: 'Express', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/express.svg' },
  { name: 'Socket.io', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/socketdotio.svg' },
  { name: 'PostgreSQL', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/postgresql.svg' },
]

const bottomSkills = [
  { name: 'Git', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/git.svg' },
  { name: 'Docker', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/docker.svg' },
  { name: 'AWS', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/amazonaws.svg' },
  { name: 'Figma', logo: 'https://cdn.jsdelivr.net/npm/simple-icons@v9/icons/figma.svg' },
]

const TechTreeSkills = () => {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const centerRef = useRef(null)
  const leftBranchRef = useRef(null)
  const rightBranchRef = useRef(null)
  const bottomBranchRef = useRef(null)

  useEffect(() => {
    if (!containerRef.current) return;
    const ctx = gsap.context(() => {
      // Reveal container
      gsap.fromTo(containerRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 1.5, scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 80%'
        }}
      )

      // Center hub pulse
      gsap.to('.title-ring', {
        scale: 1.1,
        opacity: 0.4,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut'
      })

      // Staggered pill reveal
      gsap.from('.skill-pill', {
        opacity: 0,
        y: 20,
        scale: 0.8,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.7)',
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top 70%'
        }
      })

      // Line drawing animation (desktop only)
      if (window.innerWidth > 1024) {
        gsap.from('.techtree-svg path', {
          strokeDasharray: 1000,
          strokeDashoffset: 1000,
          duration: 2,
          stagger: 0.2,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 60%'
          }
        })
      }
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative w-full min-h-screen bg-transparent flex items-center justify-center overflow-hidden p-[4rem_1rem]" ref={containerRef}>
      
      {/* ── Connecting Lines (SVG) ── */}
      <svg className="techtree-svg absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-[1200px] pointer-events-none z-[2] max-lg:hidden" viewBox="0 0 1200 800" ref={svgRef}>
        {/* Left branches */}
        <path d="M600 400 C 450 400, 350 250, 150 250" className="fill-none stroke-white/15 stroke-[1.5] [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.3))]" />
        <path d="M600 400 C 450 400, 350 400, 150 400" className="fill-none stroke-white/15 stroke-[1.5] [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.3))]" />
        <path d="M600 400 C 450 400, 350 550, 150 550" className="fill-none stroke-white/15 stroke-[1.5] [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.3))]" />

        {/* Right branches */}
        <path d="M600 400 C 750 400, 850 250, 1050 250" className="fill-none stroke-white/15 stroke-[1.5] [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.3))]" />
        <path d="M600 400 C 750 400, 850 400, 1050 400" className="fill-none stroke-white/15 stroke-[1.5] [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.3))]" />
        <path d="M600 400 C 750 400, 850 550, 1050 550" className="fill-none stroke-white/15 stroke-[1.5] [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.3))]" />

        {/* Bottom branch */}
        <path d="M600 450 L 600 600" className="fill-none stroke-white/15 stroke-[1.5] [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.3))]" />
      </svg>

      <div className="relative z-[3] w-full max-w-[1200px] flex flex-col items-center justify-center gap-[2rem] max-lg:static max-lg:gap-[3rem]">
        
        {/* ── Left Branch ── */}
        <div className="flex flex-wrap justify-center gap-[0.75rem] w-full max-w-[450px] absolute left-[5%] top-1/2 -translate-y-1/2 justify-end max-lg:static max-lg:transform-none max-lg:justify-center max-lg:max-w-none" ref={leftBranchRef}>
          {leftSkills.map(skill => (
            <div key={skill.name} className="skill-pill group flex items-center gap-[0.6rem] p-[0.6rem_1.2rem] bg-white/3 border border-white/10 rounded-[100px] backdrop-blur-[10px] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap hover:bg-white/8 hover:border-white/40 hover:scale-105 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <img src={skill.logo} alt={skill.name} className="w-[1.25rem] h-[1.25rem] object-contain [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.2))]" />
              <span className="font-['Universa'] font-semibold text-[0.85rem] text-[var(--text-color)]/90 tracking-wide group-hover:text-[var(--heading-color)]">{skill.name}</span>
            </div>
          ))}
        </div>

        {/* ── Center Hub ── */}
        <div className="relative w-[180px] h-[180px] flex items-center justify-center my-[2rem] max-lg:w-[140px] max-lg:h-[140px] max-lg:m-0 max-lg:order-[-1]" ref={centerRef}>
          <div className="absolute inset-0 border border-white/20 rounded-full animate-[rotateRing_20s_linear_infinite] title-ring" />
          <div className="absolute inset-[-20px] bg-[radial-gradient(circle,rgba(255,255,255,0.05)_0%,transparent_70%)] rounded-full" />
          <span className="font-['OriginTech'] font-black text-[1.4rem] tracking-[0.15em] text-[var(--heading-color)] z-[2]">ECOSYSTEM</span>
        </div>

        {/* ── Right Branch ── */}
        <div className="flex flex-wrap justify-center gap-[0.75rem] w-full max-w-[450px] absolute right-[5%] top-1/2 -translate-y-1/2 justify-start max-lg:static max-lg:transform-none max-lg:justify-center max-lg:max-w-none" ref={rightBranchRef}>
          {rightSkills.map(skill => (
            <div key={skill.name} className="skill-pill group flex items-center gap-[0.6rem] p-[0.6rem_1.2rem] bg-white/3 border border-white/10 rounded-[100px] backdrop-blur-[10px] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap hover:bg-white/8 hover:border-white/40 hover:scale-105 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <img src={skill.logo} alt={skill.name} className="w-[1.25rem] h-[1.25rem] object-contain [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.2))]" />
              <span className="font-['Universa'] font-semibold text-[0.85rem] text-[var(--text-color)]/90 tracking-wide group-hover:text-[var(--heading-color)]">{skill.name}</span>
            </div>
          ))}
        </div>

        {/* ── Bottom Branch ── */}
        <div className="flex flex-wrap justify-center gap-[0.75rem] w-full max-w-[450px] mt-[4rem]" ref={bottomBranchRef}>
          {bottomSkills.map(skill => (
            <div key={skill.name} className="skill-pill group flex items-center gap-[0.6rem] p-[0.6rem_1.2rem] bg-white/3 border border-white/10 rounded-[100px] backdrop-blur-[10px] cursor-pointer transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] whitespace-nowrap hover:bg-white/8 hover:border-white/40 hover:scale-105 hover:-translate-y-[2px] hover:shadow-[0_0_20px_rgba(255,255,255,0.15)]">
              <img src={skill.logo} alt={skill.name} className="w-[1.25rem] h-[1.25rem] object-contain [filter:drop-shadow(0_0_5px_rgba(255,255,255,0.2))]" />
              <span className="font-['Universa'] font-semibold text-[0.85rem] text-[var(--text-color)]/90 tracking-wide group-hover:text-[var(--heading-color)]">{skill.name}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  )
}

export default TechTreeSkills
