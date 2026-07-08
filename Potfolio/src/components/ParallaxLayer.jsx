import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/**
 * ParallaxLayer — Reusable wrapper for depth illusion on scroll.
 * Applies a GSAP scrub animation to alter the vertical scroll speed.
 */
const ParallaxLayer = ({ children, speed = 1, className = '', style = {} }) => {
  const layerRef = useRef(null)

  useEffect(() => {
    if (!layerRef.current) return

    const isMobile = window.innerWidth < 768
    // Disable or heavily reduce parallax on mobile for performance
    const movement = isMobile ? speed * 20 : speed * 150

    const anim = gsap.to(layerRef.current, {
      y: movement,
      ease: 'none',
      scrollTrigger: {
        trigger: layerRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: true,
      },
    })

    return () => {
      anim.kill()
    }
  }, [speed])

  return (
    <div
      ref={layerRef}
      className={className}
      style={{
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  )
}

export default ParallaxLayer
