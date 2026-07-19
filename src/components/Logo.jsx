import React from 'react'

const Logo = () => {
  return (
    <div className='absolute top-0 left-0 p-4 sm:p-6 md:p-10 pointer-events-none z-20'>
        <h1 className='text-[var(--heading-color)] text-2xl sm:text-3xl md:text-5xl font-[chan1] pointer-events-auto cursor-pointer
          transition-opacity duration-300 hover:opacity-80
          min-h-[44px] flex items-center'>
            CM.
        </h1>
    </div>
  )
}

export default Logo