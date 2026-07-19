import React from 'react';

const Footer = () => {
  return (
    <footer className="relative z-10 w-full border-t border-white/10 bg-black/50 backdrop-blur-md">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-6 md:py-8 flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
        
        {/* Left: Copyright */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h2 className="text-white font-['chan1'] text-xl mb-1">CM.</h2>
          <p className="text-white/40 font-['Inter'] text-xs">
            © {new Date().getFullYear()} Chanchal. All rights reserved.
          </p>
        </div>

        {/* Center: Navigation Links (Optional) */}
        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-6">
          {['Home', 'About', 'Projects', 'Skills', 'Contact'].map((link) => (
            <a 
              key={link} 
              href={`#${link.toLowerCase()}`}
              className="text-white/60 hover:text-white font-['Inter'] text-xs sm:text-sm transition-colors uppercase tracking-wider sm:tracking-widest min-h-[44px] flex items-center"
            >
              {link}
            </a>
          ))}
        </div>

        {/* Right: Back to Top */}
        <button 
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="group flex items-center gap-2 text-white/50 hover:text-white transition-colors min-h-[44px]"
        >
          <span className="font-['Inter'] text-xs uppercase tracking-widest">Back to top</span>
          <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/10 transition-colors">
            <i className="ri-arrow-up-line"></i>
          </div>
        </button>

      </div>
    </footer>
  );
};

export default Footer;
