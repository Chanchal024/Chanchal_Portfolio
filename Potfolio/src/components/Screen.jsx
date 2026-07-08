import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

/* ── Project data ── */
const projects = [
  {
    id: 1,
    title: "Project Alpha",
    description: "A sleek, modern web application crafted with performance and aesthetics in mind.",
    image: "/images/pic1.png",
    video: null,
  },
  {
    id: 2,
    title: "Project Beta",
    description: "An immersive digital experience pushing the boundaries of interactive design.",
    image: "/images/pic2.png",
    video: null,
  },
  {
    id: 3,
    title: "Project Gamma",
    description: "A responsive platform engineered for speed, clarity, and seamless user flow.",
    image: "/images/pic3.png",
    video: null,
  },
  {
    id: 4,
    title: "Project Delta",
    description: "A bold creative showcase blending motion, typography, and minimal elegance.",
    image: "/images/pic4.png",
    video: null,
  },
];

const images = projects.map((p) => p.image);

const SliderItem = ({ image, index, isActive, direction, animate, onClick }) => {
  const itemRef = useRef();

  useEffect(() => {
    if (!animate) return;

    if (isActive) {
      gsap.fromTo(
        itemRef.current,
        {
          x: direction === "right" ? "100%" : "-100%",
          opacity: 0
        },
        {
          x: "0%",
          opacity: 1,
          duration: 1.5,
          ease: "power2.out"
        }
      );
    } else {
      gsap.to(itemRef.current, {
        x: direction === "right" ? "-100%" : "100%",
        opacity: 0,
        duration: 1.5,
        ease: "power2.out"
      });
    }
  }, [isActive, direction, animate]);

  return (
    <div
      ref={itemRef}
      className={`absolute inset-0 transition-opacity duration-500 ${
        isActive ? "z-10" : "z-0"
      }`}
    >
      <img
        src={image}
        className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain ${
          index === 0 ? "w-[40%] h-[40%] md:w-[50%] md:h-[50%]" :
          index === 1 ? "w-[25%] h-[25%] md:w-[35%] md:h-[35%]" :
          index === 2 ? "w-[60%] h-[60%] md:w-[70%] md:h-[70%]" :
          index === 3 ? "w-[40%] h-[40%] md:w-[50%] md:h-[50%]" : 
          "w-[40%] h-[40%] md:w-[50%] md:h-[50%]"
        }`}
        draggable={false}
      />

      {/* ── View prompt removed as per user request (no hover effects) ── */}
    </div>
  );
};

const Screen = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [prevIndex, setPrevIndex] = useState(null);
  const [direction, setDirection] = useState("right");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);


  const nextSlide = () => {
    const newIndex = (activeIndex + 1) % images.length;
    setPrevIndex(activeIndex);
    setDirection("right");
    setActiveIndex(newIndex);
  };

  const prevSlide = () => {
    const newIndex = (activeIndex - 1 + images.length) % images.length;
    setPrevIndex(activeIndex);
    setDirection("left");
    setActiveIndex(newIndex);
  };


  return (
    <>
      <div className="relative bg-transparent w-full h-[65vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] overflow-hidden shadow-none">
        {images.map((img, i) => {
          const isActive = i === activeIndex;
          const wasActive = i === prevIndex;
          const shouldRender = isActive || wasActive;
          const animate = hasMounted && (isActive || wasActive);

          return shouldRender ? (
            <SliderItem
              key={i}
              image={img}
              index={i}
              isActive={isActive}
              direction={direction}
              animate={animate}
            />
          ) : null;
        })}

        {/* Prev Button */}
        <button
          onClick={prevSlide}
          className="absolute top-1/2 left-4 md:left-8 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/[0.05] text-white/50 text-2xl transition-all duration-400 active:scale-95 z-50 flex items-center justify-center group"
        >
          <span className="transition-transform duration-300">&#8249;</span>
        </button>
 
        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="absolute top-1/2 right-4 md:right-8 -translate-y-1/2 w-10 h-10 md:w-14 md:h-14 rounded-full border border-white/10 bg-white/[0.05] text-white/50 text-2xl transition-all duration-400 active:scale-95 z-50 flex items-center justify-center group"
        >
          <span className="transition-transform duration-300">&#8250;</span>
        </button>

      </div>

    </>
  );
};

export default Screen;
