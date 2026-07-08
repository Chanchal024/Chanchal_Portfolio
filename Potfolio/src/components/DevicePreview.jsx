import React, { useState, useEffect } from 'react';
import gsap from 'gsap';

/**
 * DevicePreview — Carousel of device frames for a single project.
 * Navigates through Monitor, Laptop, Tablet, and Phone views.
 */
const DevicePreview = ({ project, onClose }) => {
  const devices = ['monitor', 'laptop', 'tablet', 'phone'];
  const [deviceIndex, setDeviceIndex] = useState(0);
  const [direction, setDirection] = useState('right');

  const deviceImages = [
    '/images/pic1.png',
    '/images/pic2.png',
    '/images/pic3.png',
    '/images/pic4.png'
  ];

  const nextDevice = (e) => {
    e?.stopPropagation();
    setDirection('right');
    setDeviceIndex((prev) => (prev + 1) % devices.length);
  };

  const prevDevice = (e) => {
    e?.stopPropagation();
    setDirection('left');
    setDeviceIndex((prev) => (prev - 1 + devices.length) % devices.length);
  };

  useEffect(() => {
    // Animation for device change
    gsap.fromTo(".device-container", 
      { opacity: 0, scale: 0.8, x: direction === 'right' ? 100 : -100 },
      { opacity: 1, scale: 1, x: 0, duration: 0.8, ease: "expo.out" }
    );
  }, [deviceIndex]);

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-auto overflow-hidden bg-black">
      <div className="absolute inset-0 bg-black cursor-pointer" onClick={onClose} />
      
      {/* Navigation Buttons */}
      <div className="absolute inset-x-4 lg:inset-x-12 top-1/2 -translate-y-1/2 flex justify-between z-[10] pointer-events-none">
        <button 
          onClick={prevDevice}
          className="w-12 h-12 lg:w-20 lg:h-20 rounded-full border border-white/10 bg-white/5 text-white text-3xl flex items-center justify-center transition-all hover:bg-white hover:text-black active:scale-95 pointer-events-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          style={{ mixBlendMode: 'normal' }}
        >
          &#8249;
        </button>

        <button 
          onClick={nextDevice}
          className="w-12 h-12 lg:w-20 lg:h-20 rounded-full border border-white/10 bg-white/5 text-white text-3xl flex items-center justify-center transition-all hover:bg-white hover:text-black active:scale-95 pointer-events-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]"
          style={{ mixBlendMode: 'normal' }}
        >
          &#8250;
        </button>
      </div>

      {/* Close button */}
      <button 
        className="fixed top-4 right-4 sm:top-8 sm:right-8 w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 bg-white/5 text-white text-lg sm:text-xl cursor-pointer flex items-center justify-center z-[20] transition-all hover:bg-white hover:text-black shadow-xl" 
        style={{ mixBlendMode: 'normal', top: 'max(1rem, env(safe-area-inset-top))', right: 'max(1rem, env(safe-area-inset-right))' }}
        onClick={onClose}
      >
        &#x2715;
      </button>

      <div className="relative z-[2] w-full max-w-6xl flex flex-col items-center gap-12 p-8">
        {/* Project Header */}
        <div className="text-center animate-fadeIn">
          <h3 className="font-['Inter'] font-black text-3xl lg:text-5xl text-white mb-2 tracking-tighter uppercase" style={{ color: '#ffffff', mixBlendMode: 'normal', opacity: 1 }}>{project.title}</h3>
          <div className="flex items-center justify-center gap-4">
            <span className="h-[1px] w-8 bg-white/20"></span>
            <p className="font-['Inter'] font-light text-xs lg:text-sm text-white uppercase tracking-[0.4em]" style={{ color: '#ffffff', mixBlendMode: 'normal', opacity: 1 }}>{devices[deviceIndex]} View</p>
            <span className="h-[1px] w-8 bg-white/20"></span>
          </div>
        </div>

        {/* Single Device Container */}
        <div className="device-container w-full flex justify-center items-center min-h-[50vh]">
          <div className="w-full max-w-5xl flex justify-center transform transition-transform duration-700">
            <img 
              src={deviceImages[deviceIndex]} 
              alt={project.title} 
              className="w-full max-h-[70vh] object-contain drop-shadow-[0_20px_50px_rgba(0,0,0,0.5)] animate-deviceEntry"
            />
          </div>
        </div>

        {/* Device Indicators */}
        <div className="flex gap-4 opacity-40">
          {devices.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 transition-all duration-500 rounded-full ${i === deviceIndex ? 'w-12 bg-white opacity-100' : 'w-4 bg-white/30'}`}
            />
          ))}
        </div>
      </div>

      <style>{`
        .animate-fadeIn {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default DevicePreview;
