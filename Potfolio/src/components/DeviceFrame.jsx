import React from 'react';

/**
 * DeviceFrame — Pure CSS device mockup using Tailwind.
 * Types: 'laptop' | 'phone' | 'tablet' | 'monitor'
 */
const DeviceFrame = ({ type = 'laptop', src, alt = 'Project preview', video }) => {
  const media = video ? (
    <video
      src={video}
      autoPlay
      loop
      muted
      playsInline
      className="w-full h-full object-cover block"
    />
  ) : (
    <img src={src} alt={alt} loading="lazy" className="w-full h-full object-cover block" />
  );

  if (type === 'laptop') {
    return (
      <div className="relative w-full max-w-[520px] max-sm:max-w-full">
        <div className="bg-[#1a1a1c] border-2 border-white/12 rounded-t-[10px] p-[10px_12px_8px] relative before:content-[''] before:absolute before:top-[4px] before:left-1/2 before:-translate-x-1/2 before:w-[5px] before:h-[5px] before:bg-[#2a2a2e] before:rounded-full">
          <div className="overflow-hidden bg-[#0a0a0a] relative rounded-[3px] aspect-[16/10]">{media}</div>
        </div>
        <div className="h-[10px] bg-gradient-to-b from-[#222224] to-[#1a1a1c] border-2 border-white/10 border-t-white/5 rounded-b-[2px] after:content-[''] after:block after:h-[5px] after:mx-[-14px] after:bg-[#1a1a1c] after:border-2 after:border-white/8 after:border-t-0 after:rounded-b-[10px]" />
      </div>
    );
  }

  if (type === 'phone') {
    return (
      <div className="relative w-[90px] max-sm:w-[70px]">
        <div className="bg-[#1a1a1c] border-2 border-white/12 rounded-[16px] p-[14px_5px_18px] relative before:content-[''] before:absolute before:top-[7px] before:left-1/2 before:-translate-x-1/2 before:w-[28px] before:h-[4px] before:bg-[#2a2a2e] before:rounded-[4px]">
          <div className="overflow-hidden bg-[#0a0a0a] relative rounded-[4px] aspect-[9/19.5]">{media}</div>
        </div>
      </div>
    );
  }

  if (type === 'tablet') {
    return (
      <div className="relative w-[160px] max-sm:w-[120px]">
        <div className="bg-[#1a1a1c] border-2 border-white/12 rounded-[12px] p-[10px_6px] relative before:content-[''] before:absolute before:top-[4px] before:left-1/2 before:-translate-x-1/2 before:w-[5px] before:h-[5px] before:bg-[#2a2a2e] before:rounded-full">
          <div className="overflow-hidden bg-[#0a0a0a] relative rounded-[3px] aspect-[4/3]">{media}</div>
        </div>
      </div>
    );
  }

  if (type === 'monitor') {
    return (
      <div className="relative w-full max-w-[600px]">
        <div className="bg-[#1a1a1c] border-2 border-white/12 rounded-[6px] p-[12px] relative">
          <div className="overflow-hidden bg-[#0a0a0a] relative rounded-[2px] aspect-video">{media}</div>
        </div>
        <div className="w-[60px] h-[40px] bg-[#222] mx-auto" />
        <div className="w-[120px] h-[6px] bg-[#111] mx-auto rounded-t-lg" />
      </div>
    );
  }

  return null;
};

export default DeviceFrame;
