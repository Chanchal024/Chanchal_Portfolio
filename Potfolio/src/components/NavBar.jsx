import React from 'react';

const NavBar = () => {
  const navLinks = [
    { name: 'Home', href: '#page1' },
    { name: 'Projects', href: '#page3' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const handleScroll = (e, href) => {
    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="absolute top-0 left-1/2 -translate-x-1/2 p-4 sm:p-6 md:p-10 pointer-events-none z-20 hidden lg:flex">
      <nav 
        className="pointer-events-auto backdrop-blur-xl rounded-full px-6 lg:px-8 xl:px-12 min-[1440px]:px-16 2xl:px-24 py-1.5 lg:py-2 flex flex-row items-center gap-6 lg:gap-8 xl:gap-10 min-[1440px]:gap-16 2xl:gap-20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] transition-colors duration-500"
        style={{ backgroundColor: 'var(--nav-bg)' }}
      >
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            onClick={(e) => handleScroll(e, link.href)}
            className="font-['UniversaNew'] font-black text-sm lg:text-base min-[1440px]:text-lg 2xl:text-2xl tracking-widest uppercase hover:opacity-70 transition-all duration-300 relative group whitespace-nowrap shrink-0"
            style={{ color: 'var(--nav-text)' }}
          >
            {link.name}
            {/* Underline animation on hover */}
            <span 
              className="absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full"
              style={{ backgroundColor: 'var(--nav-line)' }}
            ></span>
          </a>
        ))}
      </nav>
    </div>
  );
};

export default NavBar;
