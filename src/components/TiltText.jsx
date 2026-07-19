import React from 'react'

const TiltText = (props) => {
    return (
        <div
          id='tilt'
          ref={props.abc}
          className='pointer-events-auto w-full text-left max-w-[95%] min-[480px]:max-w-[90%] sm:max-w-[85%] md:max-w-[75%] lg:max-w-[72%] min-[1200px]:max-w-[70%] min-[1920px]:max-w-[85%] font-[chan1] text-[var(--heading-color)]'
        >
          <h2 
            className="font-extrabold font-[chan1] tracking-tight leading-[1.1] cursor-hover-text"
            style={{ fontSize: 'clamp(1.4rem, 3.5vw + 0.5rem, 7.5rem)' }}
          >
            I'm Chanchal,
          </h2>

          <h1 
            className='mt-0.5 sm:mt-1 md:mt-2 lg:mt-3 leading-[0.85] tracking-[-0.03em] uppercase cursor-hover-text'
            style={{ fontSize: 'clamp(2.5rem, 8vw + 0.5rem, 11.5rem)' }}
          >
            FRONTEND
          </h1>
          <h1 
            className='-mt-0.5 sm:-mt-1 md:-mt-2 leading-[0.85] tracking-[-0.03em] uppercase cursor-hover-text'
            style={{ fontSize: 'clamp(2.5rem, 8vw + 0.5rem, 11.5rem)' }}
          >
            DEVELOPER
          </h1>

          {/* ── Tagline ── */}
          <div className='flex items-center justify-start gap-1.5 sm:gap-2 md:gap-3 mt-3 sm:mt-4 md:mt-6 lg:mt-8'>
            <span className='h-[1px] bg-[var(--text-color)]/40 inline-block' style={{ width: 'clamp(1rem, 3vw, 4.5rem)' }}></span>
            <h3 
              className='font-normal tracking-[0.04em] text-[var(--text-color)]/80'
              style={{ fontSize: 'clamp(0.75rem, 1.5vw + 0.25rem, 2rem)' }}
            >
              I Code What You Imagine.
            </h3>
          </div>
        </div>
    )
}

export default TiltText