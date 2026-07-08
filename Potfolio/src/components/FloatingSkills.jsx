import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const skillCategories = [
  {
    title: 'Frontend',
    icon: '💻',
    skills: ['React & Next.js', 'TypeScript', 'Tailwind CSS', 'GSAP & Three.js']
  },
  {
    title: 'Backend',
    icon: '⚙️',
    skills: ['Node.js & Express', 'MongoDB', 'PostgreSQL', 'REST APIs']
  },
  {
    title: 'Tools',
    icon: '🛠️',
    skills: ['Git & GitHub', 'Docker', 'AWS', 'Figma']
  },
  {
    title: 'Soft Skills',
    icon: '✨',
    skills: ['Problem Solving', 'Teamwork', 'Communication', 'Adaptability']
  }
]

const FloatingSkills = () => {
  const containerRef = useRef(null)
  const cardRefs = useRef([])

  useEffect(() => {
    if (!containerRef.current) return;
    const cards = cardRefs.current.filter(Boolean)
    if (!cards.length) return

    const ctx = gsap.context(() => {
      // 1. Entrance animation
      gsap.fromTo(cards, 
        { opacity: 0, y: 40, scale: 0.95 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 1,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none'
          }
        }
      )

      // 2. Subtle continuous floating effect
      cards.forEach((card, i) => {
        gsap.to(card, {
          y: i % 2 === 0 ? '-=10' : '+=10',
          x: i % 3 === 0 ? '+=5' : '-=5',
          duration: 3 + i,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut',
          delay: i * 0.2
        })
      })
    }, containerRef)

    return () => ctx.revert()
  }, [])

  return (
    <div className="relative w-full max-w-none mx-auto px-[0.75rem] z-[10] min-[480px]:px-[1rem] md:px-[1.25rem] lg:p-0" ref={containerRef}>
      
      {/* ── Background Particles ── */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-[-1]">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i}
            className="absolute w-[2px] h-[2px] bg-white/15 rounded-full animate-[fs-float_8s_ease-in-out_infinite] shadow-[0_0_10px_rgba(255,255,255,0.2)]"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${6 + Math.random() * 4}s`
            }}
          />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-[1.25rem] w-full max-w-none md:grid-cols-2 md:gap-[1.5rem] lg:gap-[1rem] xl:gap-[2rem]">
        {skillCategories.map((cat, i) => (
          <div 
            key={cat.title}
            className="group relative overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.01] border border-white/10 border-t-white/25 border-l-white/15 rounded-[20px] p-[1.5rem_1.2rem] backdrop-blur-[8px] shadow-[0_20px_50px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)] flex flex-col gap-[1rem] transition-all duration-400 ease-[cubic-bezier(0.25,1,0.5,1)] hover:-translate-y-1 hover:shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.2)] hover:border-white/20 hover:border-t-white/40 min-[480px]:p-[1.8rem_1.4rem] min-[480px]:rounded-[22px] min-[480px]:gap-[1.2rem] md:p-[2rem_1.5rem] md:rounded-[24px] md:gap-[1.3rem] md:hover:-translate-y-1.5 lg:p-[1.4rem_1.1rem] lg:rounded-[18px] lg:gap-[0.75rem] lg:backdrop-blur-[16px] lg:hover:-translate-y-1.25 xl:p-[2.2rem_1.8rem]"
            ref={el => cardRefs.current[i] = el}
          >
            {/* Ambient inner glow */}
            <div className="absolute top-0 left-0 right-0 h-full bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.15),transparent_60%)] opacity-0 transition-opacity duration-400 pointer-events-none group-hover:opacity-100" />

            <div className="flex items-center gap-[0.75rem] border-b border-white/10 pb-[1rem] mb-[0.3rem] md:gap-[1rem] md:pb-[1.2rem] lg:pb-[0.8rem] lg:mb-[0.15rem] lg:gap-[0.6rem] relative z-10">
              <span className="text-[1.8rem] [filter:drop-shadow(0_0_15px_rgba(255,255,255,0.4))] shrink-0 md:text-[2rem] lg:text-[1.5rem]">{cat.icon}</span>
              <h3 className="font-['OriginTech'] text-[clamp(1rem,2vw,1.5rem)] font-extrabold uppercase tracking-wider bg-gradient-to-r from-[var(--heading-color)] to-[var(--heading-color)]/50 bg-clip-text text-transparent m-0">{cat.title}</h3>
            </div>

            <div className="flex flex-col gap-[0.75rem] min-[480px]:gap-[0.85rem] md:gap-[1rem] lg:gap-[0.5rem] relative z-10">
              {cat.skills.map(skill => (
                <div 
                  key={skill}
                  className="group/item flex flex-col gap-[0.4rem] p-[0.6rem_0.8rem] border border-white/5 bg-white/[0.02] rounded-[12px] transition-all duration-300 ease-[cubic-bezier(0.25,1,0.5,1)] hover:bg-white/8 hover:border-white/15 hover:scale-[1.01] hover:shadow-[0_4px_15px_rgba(0,0,0,0.2)] min-[480px]:p-[0.7rem_0.9rem] md:p-[0.8rem_1rem] md:rounded-[14px] md:hover:scale-[1.02] lg:p-[0.45rem_0.65rem] lg:rounded-[10px]"
                >
                  <span className="font-['Universa'] text-[clamp(0.8rem,1.2vw,1.05rem)] font-medium text-[var(--text-color)]/85 transition-colors duration-300 group-hover/item:text-[var(--heading-color)]">{skill}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FloatingSkills
