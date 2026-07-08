import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const JS_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M0 0h24v24H0V0zm22.034 18.276c-.175-1.095-.888-2.015-3.003-2.873-.736-.345-1.554-.585-1.797-1.14-.091-.33-.105-.51-.046-.705.15-.646.915-.84 1.515-.66.39.12.75.42.976.9 1.034-.676 1.034-.676 1.755-1.125-.27-.42-.404-.601-.586-.78-.63-.705-1.469-1.065-2.834-1.034l-.705.089c-.676.165-1.32.525-1.71 1.005-1.14 1.291-.811 3.541.569 4.471 1.365 1.02 3.361 1.244 3.616 2.205.24 1.17-.87 1.545-1.966 1.41-.811-.18-1.26-.586-1.755-1.336l-1.83 1.051c.21.48.45.689.81 1.109 1.74 1.756 6.09 1.666 6.871-1.004.029-.09.24-.705.074-1.65l.046.067zm-8.983-7.245h-2.248c0 1.938-.009 3.864-.009 5.805 0 1.232.063 2.363-.138 2.711-.33.689-1.18.601-1.566.48-.396-.196-.597-.466-.83-.855-.063-.105-.11-.196-.127-.196l-1.825 1.125c.305.63.75 1.172 1.324 1.517.855.51 2.004.675 3.207.405.783-.226 1.458-.691 1.811-1.411.51-.93.402-2.07.397-3.346.012-2.054 0-4.109 0-6.179l.004-.056z"/></svg>;
const REACT_ICON = <svg viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor"><circle cx="0" cy="0" r="2.05"/><g stroke="currentColor" strokeWidth="1" fill="none"><ellipse rx="11" ry="4.2"/><ellipse rx="11" ry="4.2" transform="rotate(60)"/><ellipse rx="11" ry="4.2" transform="rotate(120)"/></g></svg>;
const NODE_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z"/></svg>;
const THREE_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M.38 0a.268.268 0 0 0-.256.332l2.894 11.716a.268.268 0 0 0 .01.04l2.89 11.708a.268.268 0 0 0 .447.128L23.802 7.15a.268.268 0 0 0-.112-.45l-5.784-1.667a.268.268 0 0 0-.123-.035L6.38 1.715a.268.268 0 0 0-.144-.04L.456.01A.268.268 0 0 0 .38 0zm.374.654L5.71 2.08 1.99 5.664zM6.61 2.34l4.864 1.4-3.65 3.515zm-.522.12l1.217 4.926-4.877-1.4zm6.28 1.538l4.878 1.404-3.662 3.53zm-.52.13l1.208 4.9-4.853-1.392zm6.3 1.534l4.947 1.424-3.715 3.574zm-.524.12l1.215 4.926-4.876-1.398zm-15.432.696l4.964 1.424-3.726 3.586zM8.047 8.15l4.877 1.4-3.66 3.527zm-.518.137l1.236 5.017-4.963-1.432zm6.274 1.535l4.965 1.425-3.73 3.586zm-.52.127l1.235 5.012-4.958-1.43zm-9.63 2.438l4.873 1.406-3.656 3.523zm5.854 1.687l4.863 1.403-3.648 3.51zm-.54.04l1.214 4.927-4.875-1.4zm-3.896 4.02l5.037 1.442-3.782 3.638z"/></svg>;
const TW_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6,2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6,2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6,2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C10.337,13.382,8.976,12,6.001,12z"/></svg>;
const MONGO_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.193 9.555c-1.264-5.58-4.252-7.414-4.573-8.115-.28-.394-.53-.954-.735-1.44-.036.495-.055.685-.523 1.184-.723.566-4.438 3.682-4.74 10.02-.282 5.912 4.27 9.435 4.888 9.884l.07.05A73.49 73.49 0 0111.91 24h.481c.114-1.032.284-2.056.51-3.07.417-.296.604-.463.85-.693a11.342 11.342 0 003.639-8.464c.01-.814-.103-1.662-.197-2.218zm-5.336 8.195s0-8.291.275-8.29c.213 0 .49 10.695.49 10.695-.381-.045-.765-1.76-.765-2.405z"/></svg>;
const HTML_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M1.5 0h21l-1.91 21.563L11.977 24l-8.564-2.438L1.5 0zm7.031 9.75l-.232-2.718 10.059.003.23-2.622L5.412 4.41l.698 8.01h9.126l-.326 3.426-2.91.804-2.955-.81-.188-2.11H6.248l.33 4.171L12 19.351l5.379-1.443.744-8.157H8.531z"/></svg>;
const GSAP_ICON = <svg viewBox="0 0 24 24" fill="currentColor"><path d="M17.21 0c-.544.003-1.093.125-1.57.362-.165.247-.15.825-.123 1.195.024.33.1.975.127 1.303-.012.258-.023.544-.031.744-.009.264-.006.34-.07.388-.196-.055-.47-.05-.772.16a.25.25 0 0 0-.05.015c-.179.055-.275.289-.275.289-.316-.11-.344.013-.494.178-.327-.068-.372.054-.572.349a1.36 1.36 0 0 0-.487.297 1.56 1.56 0 0 0-.37 1.731c-.085.57-.168.995-.219 1.263-.891.756-.522 1.909.26 2.692V11c0 0 .173.554.51.916.082.09.172.169.274.224 0 0 .32.115.96-.188-.18.778-.6 3.004.22 4.048 0 0-.151.591.193 1.223.031.154.065.299.097.446-.186-.037-.326-.047-.262.351.068.426.275 1.222.288 1.84.014.619.014 1.333-.027 1.457-.041.123-.343.26-.563.412-.838.604-1.484.713-1.91.933-.425.22-.316.646.399.77.577.11 1.483-.109 2.088-.109.604 0 1.95.068 2.308-.18.412-.288.233-.824.233-.824-.11-.302-.385-.975-.302-1.524.082-.55.192-.852.398-1.36.206-.509.357-1.759.165-1.827a.437.437 0 0 0-.106-.029h-.027c-.034.003-.062.02-.11.04-.076-.281-.261-.569-.76-.959-.024-.362.126-.715.286-1.272.458.811 1.102 1.148 1.102 1.148.027.371.261.563.316.646-.028.284-.012.542.018.744.021.249.038.687.48 1.41.133.325.264.645.326.785.151.344.137 1.003.137 1.14 0 .138.055.412.096.426.041.014-.137.371-.055.577.055.192-.123.687-.137.797-.124.742-.014.797.756.893.768.096 1.332-.193 1.538-.385.206-.193.247-.618.041-1.003-.123-.247-.247-.329-.316-.631-.068-.289-.123-.357-.178-.467-.055-.096-.069-.193-.083-.866-.013-.673 0-1.937-.068-2.473a.157.157 0 0 0-.03-.075c-.032-.228-.082-.438-.157-.608a1.954 1.954 0 0 0-.16-.405c.152-.061.317-.167.47-.368.673-.906 1.319-1.277 3.119-1.305 1.73-.027 3.214-.879 3.434-2.72.134-1.197.335-2.078.937-2.63l.505.323.233.124a3.219 3.219 0 0 1 .44.26l-.002-.007c-.545.545-1.633 1.633-1.999-2.475zm-.005.34c.756 0 .976.234.989.357 0 .041.055.481.069.659 0 0 0 .22-.014.55-.013.22-.068.343-.096.632-.027.302-.11.494-.261.742-.068.041-.123.082-.192.096-.275.055-.756.069-1.017 0-.151-.041-.343-.302-.384-.536-.055-.288-.11-.494-.124-.673-.027-.178-.041-.577-.054-.687-.042-.302.027-.769.04-.797.042-.123.344-.343 1.044-.343z"/></svg>;

const SKILLS_DATA = [
  { 
    name: 'JavaScript', 
    icon: JS_ICON, 
    c1: '247,223,30', 
    c2: '76,175,80',
    level: 95,
    description: 'My expertise in JavaScript encompasses the full spectrum of modern web development. I have a deep understanding of ES6+ features, including arrow functions, destructuring, and template literals. I am highly proficient in managing asynchronous operations using Promises and Async/Await, ensuring smooth data flow and responsive user interfaces. My experience includes complex DOM manipulation, event handling, and utilizing various browser APIs to create dynamic and interactive web applications. I focus on writing clean, modular, and performant code that is easy to maintain and scale. By staying current with the latest JavaScript trends, I deliver robust solutions for any web development challenge.'
  },
  { 
    name: 'React', 
    icon: REACT_ICON, 
    c1: '97,218,251', 
    c2: '0,188,212',
    level: 90,
    description: 'I am a specialist in building high-performance web applications using the React framework. My proficiency includes creating reusable component-based architectures that prioritize scalability and maintainability. I have extensive experience using modern React features like Hooks and the Context API for efficient state management and side-effect handling. I am also skilled in integrating third-party libraries such as Redux and Zustand to manage complex application states. My focus on performance optimization involves techniques like memoization and lazy loading to ensure fast initial loads and smooth interactions. By leveraging the power of the virtual DOM, I build dynamic user interfaces that provide a seamless experience.'
  },
  { 
    name: 'Node.js', 
    icon: NODE_ICON, 
    c1: '0,150,136', 
    c2: '0,77,64',
    level: 85,
    description: 'Node.js is my primary choice for developing scalable and efficient server-side applications. I excel at building RESTful APIs and real-time communication systems using Express and Socket.io. My expertise includes managing non-blocking, event-driven architectures and handling concurrent operations with ease. I am proficient in working with various database systems, implementing secure authentication, and managing application deployment. My focus on backend performance involves optimizing query design and implementing caching strategies to handle high traffic volumes. By utilizing the extensive Node.js ecosystem, I create robust backend solutions that power modern web applications. I take pride in writing secure, well-documented code that ensures long-term stability and performance.'
  },
  { 
    name: 'Three.js', 
    icon: THREE_ICON, 
    c1: '255,255,255', 
    c2: '150,150,150',
    level: 80,
    description: 'I specialize in creating immersive 3D web experiences using the powerful Three.js library. My skills include working with complex geometries, materials, and textures to bring creative 3D concepts to life. I have a deep understanding of lighting, shadows, and camera controls, allowing me to craft realistic and interactive virtual environments. I am also proficient in creating custom shaders with GLSL to achieve unique visual effects and push the boundaries of web graphics. My focus on performance optimization ensures that 3D scenes run smoothly across a variety of devices. By blending technical expertise with creative vision, I add a new dimension of interactivity to modern websites.'
  },
  { 
    name: 'Tailwind CSS', 
    icon: TW_ICON, 
    c1: '56,189,248', 
    c2: '14,165,233',
    level: 95,
    description: 'Tailwind CSS is my preferred tool for crafting beautiful and responsive user interfaces with incredible speed. I am an expert in the utility-first CSS methodology, leveraging Tailwind\'s extensive set of classes to build highly customizable designs. My experience includes creating pixel-perfect layouts, managing complex design systems, and implementing sophisticated hover and transition effects. I value the consistency and maintainability that Tailwind brings to a project, allowing for rapid prototyping and seamless collaboration. By combining Tailwind\'s utility classes with modern CSS features, I create visually stunning web designs that are optimized for performance. I take pride in delivering modern, accessible, and highly functional user interfaces.'
  },
  { 
    name: 'MongoDB', 
    icon: MONGO_ICON, 
    c1: '76,175,80', 
    c2: '0,77,64',
    level: 85,
    description: 'I have extensive experience in NoSQL database design and management using MongoDB. I am proficient in creating flexible and efficient data models that can adapt to evolving application needs. My expertise includes performing complex data aggregations, indexing for performance, and ensuring high availability for large datasets. I am comfortable using the MongoDB query language to perform CRUD operations and integrate database functionality into my backend applications seamlessly. I also have experience with Mongoose for object modeling, ensuring data integrity and simplifying interactions. By leveraging MongoDB\'s horizontal scalability, I build data-driven applications that grow with the user\'s needs. I focus on creating secure and performant database solutions for modern apps.'
  },
  { 
    name: 'HTML/CSS', 
    icon: HTML_ICON, 
    c1: '255,152,0', 
    c2: '244,67,54',
    level: 98,
    description: 'The foundation of my web development expertise lies in a deep mastery of HTML and CSS. I am a specialist in semantic HTML, ensuring that every page I build is accessible, well-structured, and optimized for SEO. My CSS skills include advanced layout techniques using Flexbox and Grid, as well as complex animations and transitions. I am passionate about pixel-perfect design and take pride in crafting visually stunning user interfaces that are both beautiful and functional. I also have experience with modern styling tools and preprocessors, allowing me to build maintainable style systems. By combining technical precision with a creative eye, I deliver web experiences that are world-class.'
  },
  { 
    name: 'GSAP', 
    icon: GSAP_ICON, 
    c1: '136,206,2', 
    c2: '156,39,176',
    level: 90,
    description: 'GSAP is my tool of choice for creating high-performance web animations that bring websites to life. I have extensive experience using GSAP\'s timeline and ScrollTrigger features to build complex motion sequences that respond to user interaction. I specialize in creating smooth, cinematic animations that enhance the overall user experience and add a layer of sophistication to every project. My expertise includes SVG animation, parallax effects, and synchronized multi-step transitions. I focus on optimizing performance across all devices, ensuring that animations are fluid and responsive. By leveraging the full potential of GSAP, I create engaging and memorable digital experiences that leave a lasting impression.'
  },
]

function useOrbit(orbitRef, sectionRef, paused) {
  const animRef = useRef(null)

  useEffect(() => {
    if (!orbitRef.current) return

    animRef.current = gsap.to(orbitRef.current, {
      rotation: 360,
      duration: 50, // Constant rotation speed
      ease: 'none',
      repeat: -1,
      transformOrigin: '50% 50%',
    })

    return () => {
      animRef.current?.kill()
    }
  }, [])

  useEffect(() => {
    if (!animRef.current) return
    paused ? animRef.current.pause() : animRef.current.resume()
  }, [paused])

  return animRef
}

const SkillOrbit = () => {
  const [activeIndex, setActiveIndex] = useState(0)
  const [orbitPaused, setOrbitPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const sectionRef = useRef(null)
  const orbitRef   = useRef(null)
  const trackRef   = useRef(null)
  const centerCoreRef  = useRef(null)
  const centerIconRef  = useRef(null)
  const centerTitleRef = useRef(null)
  const progressBarRefs = useRef([])
  const descRefs = useRef([])
  const nodeRefs = useRef([])

  const activeSkill = SKILLS_DATA[activeIndex]
  const orbitAnimRef = useOrbit(orbitRef, sectionRef, orbitPaused)

  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      // ── Section Pinning ──
      // Removed pinning as requested to allow natural scrolling
      /*
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=100%',
        pin: true,
        pinSpacing: true,
        anticipatePin: 1,
      })
      */

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
        }
      })
      
      tl.fromTo('.so-header-tl > *', 
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      )
      .fromTo('.so-stage-bottom',
        { opacity: 0, y: 100 },
        { opacity: 1, y: 0, duration: 1.2, ease: 'power3.out' },
        '-=0.5'
      )

      // Background Parallax Text Animation (Railway Style - Starts from center)
      gsap.fromTo('.bg-parallax-text-skills', 
        { x: 300 },
        {
          x: -300,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5
          }
        }
      );

      // Track Animation (Railway Style - Starts from center)
      if (trackRef.current) {
        gsap.fromTo(trackRef.current,
          { x: 200 },
          {
            x: -200,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  const animateCenterChange = useCallback(() => {
    const els = [centerIconRef.current, centerTitleRef.current]
    gsap.to(els, {
      opacity: 0,
      scale: 0.8,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        gsap.to(els, { opacity: 1, scale: 1, duration: 0.45, ease: 'power3.out' })
      }
    })

    if (centerCoreRef.current) {
      gsap.fromTo(centerCoreRef.current,
        { scale: 1.15 },
        { scale: 1, duration: 0.8, ease: 'elastic.out(1, 0.5)' }
      )
    }
  }, [])

  const handleSkillClick = useCallback((index) => {
    if (index === activeIndex || isTransitioning) return

    const prevIndex = activeIndex
    setIsTransitioning(true)
    setActiveIndex(index)
    
    animateCenterChange()

    const prevEl = descRefs.current[prevIndex]
    const nextEl = descRefs.current[index]

    if (prevEl && nextEl) {
      const tl = gsap.timeline({
        onComplete: () => setIsTransitioning(false)
      })

      tl.to(prevEl, {
        opacity: 0,
        y: -30,
        filter: 'blur(10px)',
        duration: 0.6,
        ease: 'power2.in'
      })

      tl.fromTo(nextEl,
        { opacity: 0, y: 30, filter: 'blur(10px)' },
        { 
          opacity: 1, 
          y: 0, 
          filter: 'blur(0px)', 
          duration: 0.8, 
          ease: 'expo.out' 
        },
        "-=0.3"
      )

      const internal = nextEl.querySelectorAll('.so-desc-title, .so-desc-text, .so-grade-wrapper')
      tl.fromTo(internal,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power3.out' },
        "-=0.6"
      )

      const nextProgress = progressBarRefs.current[index]
      if (nextProgress) {
        gsap.fromTo(nextProgress,
          { width: 0 },
          {
            width: `${SKILLS_DATA[index].level}%`,
            duration: 1.2,
            delay: 0.2,
            ease: 'expo.out'
          }
        )
      }
    }
  }, [activeIndex, isTransitioning, animateCenterChange])

  const getNodeStyle = (index) => {
    const count = SKILLS_DATA.length
    const angleDeg = (index / count) * 360
    const angleRad = (angleDeg - 90) * (Math.PI / 180)
    const radius = 50 
    const x = 50 + radius * Math.cos(angleRad)
    const y = 50 + radius * Math.sin(angleRad)
    return {
      left: `${x}%`,
      top: `${y}%`,
    }
  }

  const handleNodeMouseEnter = useCallback((el) => {
    gsap.to(el.querySelector('.so-node-pill'), {
      scale: 1.15,
      duration: 0.4,
      ease: 'power2.out',
      overwrite: true
    })
  }, [])

  const handleNodeMouseLeave = useCallback((el) => {
    gsap.to(el.querySelector('.so-node-pill'), {
      scale: 1.0,
      duration: 0.6,
      ease: 'elastic.out(1, 0.75)',
      overwrite: true
    })
  }, [])

  useEffect(() => {
    const firstProgress = progressBarRefs.current[0]
    if (firstProgress) {
      gsap.fromTo(firstProgress,
        { width: 0 },
        {
          width: `${SKILLS_DATA[0].level}%`,
          duration: 1.5,
          delay: 1.5,
          ease: 'expo.out'
        }
      )
    }
  }, [])

  return (
    <div ref={sectionRef} className="w-full relative">
      <section 
        id="skills" 
        className="relative w-full h-screen min-h-[100dvh] overflow-hidden bg-transparent 
                   [--orbit-size:clamp(450px,65vh,900px)] 
                   [--core-size:clamp(180px,15vh,300px)] 
                   [--icon-size:clamp(75px,10vh,150px)] 
                   [--c1-rgb:155,77,202] 
                   [--c2-rgb:63,81,181]
                   max-[1440px]:[--orbit-size:clamp(400px,58vh,750px)]
                   max-lg:[--orbit-size:clamp(380px,50vh,600px)]
                   max-sm:[--orbit-size:95vw]
                   max-sm:[--core-size:130px]
                   max-sm:[--icon-size:55px]
                   flex flex-col items-center justify-between" 
      >
        {/* 🌌 Background Parallax Text */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none z-0">
          <h1 className="bg-parallax-text-skills text-[25vw] font-black text-[var(--heading-color)]/5 whitespace-nowrap tracking-tighter leading-none select-none uppercase lg:block hidden">
            EXPERTISE EXPERTISE EXPERTISE
          </h1>
        </div>

        {/* Header (Matched to Page 3) */}
        <div className="so-header-tl absolute top-[4vh] left-[6vw] lg:left-[10vw] z-30 pointer-events-none">
          <h2 className="text-[var(--heading-color)] text-2xl sm:text-4xl lg:text-6xl 2xl:text-8xl font-black tracking-tighter leading-none uppercase pointer-events-auto cursor-hover-text">
            <span className="text-3xl sm:text-5xl lg:text-8xl 2xl:text-[11rem]" style={{ color: 'var(--heading-color)' }}>Skills &</span> <br /> <span style={{ WebkitTextStroke: '0px' }}>Expertise</span>
          </h2>
        </div>

        {/* Active Description Slot */}
        <div className="so-desc-container absolute top-[22vh] sm:top-[18vh] lg:top-[25vh] 2xl:top-[32vh] left-1/2 -translate-x-1/2 w-[92vw] sm:w-[95vw] lg:w-[95vw] max-w-none min-h-[180px] sm:min-h-[220px] z-[25] pointer-events-none overflow-hidden">
          {SKILLS_DATA.map((skill, i) => (
            <div 
              key={skill.name}
              className="so-desc-slot absolute top-0 left-0 w-full will-change-[transform,opacity,filter]"
              ref={el => (descRefs.current[i] = el)}
              style={{ 
                opacity: i === 0 ? 1 : 0,
                pointerEvents: i === activeIndex ? 'auto' : 'none'
              }}
            >
              <div className="so-desc-content p-[0.4rem_0.75rem] sm:p-[0.4rem_1rem] lg:p-[0.8rem_2rem] bg-transparent flex flex-col gap-[0.15rem] lg:gap-[0.2rem] items-center w-full">
                <h3 className="so-desc-title text-xl sm:text-3xl lg:text-6xl font-black text-[var(--heading-color)] mb-2 sm:mb-4 tracking-tighter leading-none uppercase text-center">
                  {skill.name}
                </h3>
                <p className="so-desc-text text-[var(--text-color)]/50 text-xs sm:text-sm lg:text-lg w-full px-1 sm:px-2 lg:px-10 font-light leading-relaxed m-0 text-center line-clamp-3 sm:line-clamp-4 lg:line-clamp-none">
                  {skill.description}
                </p>
                <div className="so-grade-wrapper flex items-center gap-[0.7rem] lg:gap-[0.8rem] mt-[0.4rem] lg:mt-[0.6rem] pt-[0.4rem] lg:pt-[0.6rem] border-t border-[var(--heading-color)]/5 w-full max-w-[280px] lg:max-w-[350px]">
                  <div className="so-grade-label text-[0.6rem] lg:text-[0.75rem] uppercase tracking-widest text-[var(--text-color)]/40 font-semibold whitespace-nowrap">Proficiency</div>
                  <div className="so-grade-track flex-1 h-[3px] lg:h-[5px] bg-[var(--text-color)]/5 rounded-full overflow-hidden relative">
                    <div 
                      className="so-grade-fill h-full bg-[var(--heading-color)] shadow-[0_0_15px_rgba(255,255,255,0.4)] rounded-full w-0" 
                      ref={el => (progressBarRefs.current[i] = el)}
                      style={{ width: `${skill.level}%` }}
                    ></div>
                  </div>
                  <div className="so-grade-value text-[0.9rem] lg:text-[1.2rem] font-extrabold text-[var(--heading-color)] min-w-[35px] text-right [font-variant-numeric:tabular-nums]">{skill.level}%</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 🛤️ Railway Track (Added to match Page 3) */}
        <div ref={trackRef} className="absolute bottom-[12vh] left-0 w-[200vw] h-[2px] bg-gradient-to-r from-[var(--heading-color)]/0 via-[var(--heading-color)]/20 to-[var(--heading-color)]/0 z-0 lg:block hidden">
          <div className="absolute inset-0 flex justify-around items-center h-6 -top-2">
            {Array.from({ length: 50 }).map((_, i) => (
              <div key={i} className="w-[1px] h-full bg-[var(--heading-color)]/10"></div>
            ))}
          </div>
        </div>

        {/* Orbit Stage */}
        <div 
          className="so-stage-bottom absolute bottom-[calc(10vh-var(--orbit-size)/2)] left-1/2 -translate-x-1/2 w-[var(--orbit-size)] h-[var(--orbit-size)] z-[20] flex items-center justify-center"
          onMouseEnter={() => setOrbitPaused(true)}
          onMouseLeave={() => setOrbitPaused(false)}
        >
          <div className="so-orbit-track relative w-full h-full rounded-full border border-dashed border-white/15 will-change-transform" ref={orbitRef}>
            {SKILLS_DATA.map((skill, i) => (
              <div
                key={skill.name}
                className={`so-node group absolute top-1/2 left-1/2 cursor-pointer z-5 will-change-transform ${i === activeIndex ? 'is-active' : ''}`}
                style={{ ...getNodeStyle(i), '--node-c1': skill.c1, '--node-c2': skill.c2 }}
                ref={el => (nodeRefs.current[i] = el)}
                onClick={() => handleSkillClick(i)}
                onMouseEnter={(e) => handleNodeMouseEnter(e.currentTarget)}
                onMouseLeave={(e) => handleNodeMouseLeave(e.currentTarget)}
                onTouchStart={(e) => handleNodeMouseEnter(e.currentTarget)}
                onTouchEnd={(e) => handleNodeMouseLeave(e.currentTarget)}
              >
                <div className="so-node-inner flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
                  <div className={`so-node-pill w-[var(--icon-size)] h-[var(--icon-size)] rounded-full bg-white/3 border border-white/10 backdrop-blur-[8px] lg:backdrop-blur-[12px] flex items-center justify-center text-[calc(var(--icon-size)*0.52)] shadow-[0_8px_20px_rgba(0,0,0,0.4),inset_0_1px_8px_rgba(255,255,255,0.1)] transition-[background-color,border-color,box-shadow] duration-400 cubic-bezier-[0.4,0,0.2,1] group-hover:bg-white/10 group-hover:border-white/30 group-hover:shadow-[0_12px_30px_rgba(var(--node-c1),0.4),inset_0_1px_12px_rgba(255,255,255,0.2)] ${i === activeIndex ? 'bg-[rgba(var(--node-c1),0.15)] border-[rgba(var(--node-c1),0.5)] shadow-[0_0_25px_rgba(var(--node-c1),0.4),inset_0_0_12px_rgba(var(--node-c2),0.3)]' : ''}`}>
                    {skill.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="so-core absolute w-[var(--core-size)] h-[var(--core-size)] rounded-full bg-[var(--heading-color)]/3 backdrop-blur-[12px] lg:backdrop-blur-[20px] border border-[var(--heading-color)]/15 flex flex-col items-center justify-center shadow-[0_0_50px_rgba(var(--c1-rgb),0.3),inset_0_0_25px_rgba(var(--c2-rgb),0.2)] transition-[box-shadow,border-color] duration-800 z-10" ref={centerCoreRef}>
            <div className="so-core-icon text-[calc(var(--core-size)*0.4)] leading-none mb-[0.1rem] lg:mb-[0.2rem] drop-shadow-[0_0_15px_rgba(var(--c1-rgb),0.6)] flex items-center justify-center" ref={centerIconRef}>
              {activeSkill.icon}
            </div>
            <div className="so-core-title font-['OriginTech'] text-[calc(var(--core-size)*0.1)] lg:text-[calc(var(--core-size)*0.11)] font-bold text-[var(--heading-color)] tracking-wider text-center px-2" ref={centerTitleRef}>
              {activeSkill.name}
            </div>
          </div>
        </div>
      </section>
      <style>{`
        .text-outline {
          -webkit-text-stroke: 1px rgba(255,255,255,0.3);
          color: transparent;
        }
        @media (max-height: 720px) {
          #skills {
            --orbit-size: clamp(300px, 48vh, 600px) !important;
            --core-size: clamp(100px, 12vh, 200px) !important;
            --icon-size: clamp(45px, 8vh, 90px) !important;
          }
          .so-desc-container {
            top: 20vh !important;
          }
        }
        @media (max-height: 520px) {
          #skills {
            --orbit-size: clamp(240px, 45vh, 400px) !important;
            --core-size: clamp(80px, 10vh, 140px) !important;
            --icon-size: clamp(35px, 6vh, 60px) !important;
          }
          .so-desc-container {
            top: 15vh !important;
          }
        }
      `}</style>
    </div>
  )
}

export default SkillOrbit
