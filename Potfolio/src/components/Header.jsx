import React from 'react'
import 'remixicon/fonts/remixicon.css'

const Header = ({ theme, toggleTheme, onHireMe, onMenuToggle }) => {
  return (
    <div className='absolute top-0 right-0 gap-3 sm:gap-4 flex items-center justify-end p-4 sm:p-6 md:p-10 pointer-events-none z-20'>
        {/* Theme Toggle */}
        <div 
          onClick={toggleTheme}
          className={`
            w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14
            flex items-center justify-center
            pointer-events-auto cursor-pointer
            transition-all duration-300 rounded-full
            hover:scale-110 active:scale-95
            ${theme === 'dark'
              ? 'bg-white text-black border border-white/20 hover:bg-white/90'
              : 'bg-black text-white border border-black/20 hover:bg-black/90'
            }
          `}
        >
          <i className={theme === 'dark' ? 'ri-sun-line text-xl sm:text-2xl' : 'ri-moon-line text-xl sm:text-2xl'}></i>
        </div>

        <button 
          onClick={onHireMe}
          className={`
          bg-[var(--heading-color)] text-[var(--bg-color)] font-[chan1] text-[10px] sm:text-sm md:text-lg
          rounded-full px-3 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3
          pointer-events-auto cursor-pointer
          transition-all duration-300 ease-out
          active:scale-95
          min-h-[44px] min-w-[44px]
          ${theme === 'dark' ? 'hover:bg-gray-200' : ''}
        `}>
            Hire Me
        </button>
        <button 
          onClick={onMenuToggle}
          className="pointer-events-auto cursor-pointer transition-opacity duration-300 hover:opacity-70 flex items-center justify-center min-h-[44px] min-w-[44px] p-2 -mr-2"
        >
          <i className="ri-menu-3-line text-2xl sm:text-3xl md:text-4xl text-[var(--heading-color)]"></i>
        </button>
    </div>
  )
}

export default Header