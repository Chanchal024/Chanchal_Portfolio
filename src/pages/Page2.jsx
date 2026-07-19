import React from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { ScrollTrigger } from 'gsap/all'

gsap.registerPlugin(useGSAP, ScrollTrigger);

const Page2 = () => {

  useGSAP(() => {
    gsap.utils.toArray(".rotateText").forEach((el) => {
      gsap.from(el, {
        rotateX: -80,
        opacity: 0,
        duration: 4,
        delay: 0.5,
        ease: "power4.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          end: "top 50%",
          scrub: true,
        },
      });
    });
  });

  return (
    <div id='section2' className='relative z-2 text-center text-[var(--heading-color)] py-4 overflow-hidden w-full' style={{ background: 'transparent' }}>
      <div className='rotateText max-w-full overflow-hidden'>
        <h1 className='font-[chan5] leading-[0.9] text-[45vw] whitespace-nowrap uppercase'>IMPACTFUL</h1>
      </div>
      <div className='rotateText max-w-full overflow-hidden'>
        <h1 className='font-[chan5] leading-[0.9] text-[45vw] whitespace-nowrap uppercase'>DESIGN</h1>
      </div>
      <div className='rotateText max-w-full overflow-hidden'>
        <h1 className='font-[chan5] leading-[0.9] text-[45vw] whitespace-nowrap uppercase'>MEETS</h1>
      </div>
      <div className='rotateText max-w-full overflow-hidden'>
        <h1 className='font-[chan5] leading-[0.9] text-[45vw] whitespace-nowrap uppercase'>FLOW</h1>
      </div>
      <div className='rotateText max-w-full overflow-hidden'>
        <h1 className='font-[chan5] leading-[0.9] text-[45vw] whitespace-nowrap uppercase'>IN</h1>
      </div>
      <div className='rotateText max-w-full overflow-hidden'>
        <h1 className='font-[chan5] leading-[0.9] text-[45vw] whitespace-nowrap uppercase'>EVERY</h1>
      </div>
      <div className='rotateText max-w-full overflow-hidden'>
        <h1 className='font-[chan5] leading-[0.9] text-[45vw] whitespace-nowrap uppercase'>PROJECT</h1>
      </div>
    </div>
  )
}

export default Page2
