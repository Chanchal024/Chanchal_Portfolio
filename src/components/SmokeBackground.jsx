/**
 * ═══════════════════════════════════════════════════════════════════════
 *  SmokeBackground.jsx — Production-Level Volumetric Fog System
 * ═══════════════════════════════════════════════════════════════════════
 *
 *  A reusable React component that renders GPU-driven volumetric fog
 *  using Three.js ShaderMaterial with custom GLSL shaders.
 *
 *  VARIANTS (via prop):
 *    "hero"        → Ultra-subtle, barely-there luxury fog
 *    "interactive"  → Medium density with smooth cursor parallax
 *    "artistic"     → Dense, expressive fog with GSAP scroll animation
 *
 *  FEATURES:
 *    ✓ Procedural fBm noise (no textures, fully GPU-generated)
 *    ✓ Domain warping for organic, flowing motion
 *    ✓ GSAP-smoothed mouse interaction (interactive variant only)
 *    ✓ GSAP ScrollTrigger scrubbed density (artistic variant only)
 *    ✓ Device-adaptive quality (mobile gets fewer octaves)
 *    ✓ Tab visibility detection (pauses when hidden)
 *    ✓ Full cleanup on unmount (no WebGL leaks)
 *
 *  USAGE:
 *    <SmokeBackground variant="hero" />
 *    <SmokeBackground variant="interactive" />
 *    <SmokeBackground variant="artistic" />
 *
 * ═══════════════════════════════════════════════════════════════════════
 */

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────────────────────────────
 *  VARIANT CONFIGURATION
 *  Each variant defines its visual character through shader parameters
 * ───────────────────────────────────────────────────────────────────── */
const VARIANTS = {
  hero: {
    intensity: 0.45,          // Very low fog density
    noiseScale: 2.5,          // Larger noise = smoother, softer shapes
    speed: 0.008,             // Very slow drift
    warpStrength: 1.8,        // Gentle domain warping
    fogStart: 0.35,           // smoothstep lower bound (higher = less fog)
    fogEnd: 0.75,             // smoothstep upper bound
    alpha: 0.55,              // Final alpha multiplier
    mouseInfluence: 0.0,      // No cursor interaction
    enableMouse: false,
    enableScroll: false,
    octaves: 4,               // Desktop octave count
    mobileOctaves: 3,         // Mobile octave count
  },
  interactive: {
    intensity: 0.85,          // Medium-high density
    noiseScale: 3.0,          // Balanced detail
    speed: 0.012,             // Moderate drift
    warpStrength: 3.0,        // Noticeable organic folding
    fogStart: 0.20,           // Lower = more fog coverage
    fogEnd: 0.70,
    alpha: 0.75,              // Clearly visible
    mouseInfluence: 0.15,     // Subtle but noticeable cursor effect
    enableMouse: true,
    enableScroll: false,
    octaves: 5,
    mobileOctaves: 3,
  },
  artistic: {
    intensity: 1.0,           // Full density
    noiseScale: 2.2,          // Tighter noise = more detailed wisps
    speed: 0.018,             // Faster, more expressive
    warpStrength: 4.0,        // Strong organic distortion
    fogStart: 0.15,           // Wide fog coverage
    fogEnd: 0.65,
    alpha: 0.90,              // Very prominent
    mouseInfluence: 0.0,
    enableMouse: false,
    enableScroll: true,        // GSAP ScrollTrigger controls density
    octaves: 5,
    mobileOctaves: 3,
  },
};

/* ─────────────────────────────────────────────────────────────────────
 *  VERTEX SHADER — Simple fullscreen quad passthrough
 * ───────────────────────────────────────────────────────────────────── */
const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`;

/* ─────────────────────────────────────────────────────────────────────
 *  FRAGMENT SHADER FACTORY
 *  Generates optimized GLSL with variant constants baked in at
 *  compile time (avoids GPU branching overhead)
 * ───────────────────────────────────────────────────────────────────── */
const createFragmentShader = (config, octaves) => /* glsl */ `
  precision mediump float;

  // ── Uniforms passed from JavaScript ──
  uniform float u_time;          // Accumulated time
  uniform vec2  u_resolution;    // Viewport dimensions
  uniform vec2  u_mouse;         // Normalized mouse position (-0.5 to 0.5)
  uniform float u_intensity;     // Dynamic intensity (scroll-driven for artistic)

  varying vec2 vUv;

  // ════════════════════════════════════════
  //  NOISE FUNCTIONS
  //  Hash → Value Noise → fBm
  // ════════════════════════════════════════

  /**
   * Fast pseudo-random hash function.
   * Maps 2D coordinate to a pseudo-random float [0, 1].
   * Uses large primes to minimize visible patterns.
   */
  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
  }

  /**
   * 2D value noise with smooth Hermite interpolation.
   * Creates continuous, smooth random fields from discrete hash values.
   */
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smooth interpolation curve (cubic Hermite: 3f² - 2f³)
    vec2 u = f * f * (3.0 - 2.0 * f);

    // Sample 4 corners of the cell
    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    // Bilinear interpolation
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }

  /**
   * Fractal Brownian Motion (fBm).
   * Layers multiple octaves of noise at increasing frequency
   * and decreasing amplitude to create rich, natural detail.
   * Octave count: ${octaves} (baked at compile time for performance)
   */
  float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 1.0;

    for (int i = 0; i < ${octaves}; i++) {
      value += amplitude * noise(p * frequency);
      frequency *= 2.0;    // Each octave doubles the frequency
      amplitude *= 0.5;    // Each octave halves the amplitude
    }
    return value;
  }

  // ════════════════════════════════════════
  //  MAIN — Volumetric fog rendering
  // ════════════════════════════════════════
  void main() {
    vec2 uv = vUv;

    // Correct for aspect ratio so fog doesn't stretch
    float aspect = u_resolution.x / u_resolution.y;
    vec2 st = vec2(uv.x * aspect, uv.y) * ${config.noiseScale.toFixed(1)};

    // Slow time progression for natural drift
    float t = u_time * ${config.speed.toFixed(3)};

    // Mouse-driven displacement (baked to 0.0 for non-interactive variants)
    st += u_mouse * ${config.mouseInfluence.toFixed(2)};

    // ── DOMAIN WARPING ──
    // Feed noise output back as input coordinates.
    // This creates organic, smoke-like folding patterns.

    // Layer 1: Primary warp — large-scale organic shapes
    vec2 q = vec2(
      fbm(st + vec2(0.0, 0.0) + t * 0.30),
      fbm(st + vec2(5.2, 1.3) + t * 0.25)
    );

    // Layer 2: Secondary warp — fine detail folding
    float warp = ${config.warpStrength.toFixed(1)};
    vec2 r = vec2(
      fbm(st + warp * q + vec2(1.7, 9.2) + t * 0.15),
      fbm(st + warp * q + vec2(8.3, 2.8) + t * 0.20)
    );

    // Final composite — the warped noise field defines fog density
    float f = fbm(st + warp * r);

    // ── FOG SHAPING ──
    // smoothstep creates soft edges: values below fogStart are 0,
    // above fogEnd are 1, with smooth transition between.
    float fog = smoothstep(
      ${config.fogStart.toFixed(2)},
      ${config.fogEnd.toFixed(2)},
      f
    );

    // Apply dynamic intensity (constant for hero/interactive,
    // scroll-driven for artistic)
    fog *= u_intensity;

    // ── WHITE HIGHLIGHT WISPS ──
    // A separate, faster-moving noise layer creates bright accents
    // that sit on top of the dark fog field
    float highlights = fbm(st * 1.8 + t * 0.5 + vec2(7.3, 3.1));
    highlights = smoothstep(0.55, 0.80, highlights);

    // Color: fog is dark charcoal, highlights are slightly lighter charcoal (75% black feel)
    vec3 fogColor = vec3(0.08, 0.08, 0.1);    // Deep charcoal base
    vec3 hlColor  = vec3(0.15, 0.15, 0.18);   // Subtle visibility highlights
    vec3 color = mix(fogColor, hlColor, highlights * 0.4) * fog;

    // ── FINAL ALPHA ──
    float alpha = fog * ${config.alpha.toFixed(2)} * 1.2; // Slightly boosted for dark smoke visibility

    // Add subtle highlight glow
    alpha += highlights * 0.08 * fog;

    // Vignette: darken edges for depth perception
    float vignette = 1.0 - length((uv - 0.5) * 1.5);
    vignette = smoothstep(0.0, 0.6, vignette);
    alpha *= mix(0.4, 1.0, vignette);

    // Clamp to prevent over-brightness
    alpha = clamp(alpha, 0.0, 0.6);

    gl_FragColor = vec4(color, alpha);
  }
`;

/* ─────────────────────────────────────────────────────────────────────
 *  REACT COMPONENT
 * ───────────────────────────────────────────────────────────────────── */

/**
 * SmokeBackground — Volumetric fog background layer
 *
 * @param {Object} props
 * @param {"hero"|"interactive"|"artistic"} props.variant - Visual style preset
 */
const SmokeBackground = ({ variant = "hero" }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // ── Disable heavy WebGL on mobile devices for performance ──
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      return;
    }

    // ── Resolve variant config ──
    const config = VARIANTS[variant] || VARIANTS.hero;
    let animationId;
    let isVisible = true;

    // ══════════════════════════════════
    //  THREE.JS SETUP
    // ══════════════════════════════════

    const scene = new THREE.Scene();

    // Orthographic camera for fullscreen shader quad
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,              // Transparent canvas background
      antialias: false,         // Not needed for fullscreen shader
      powerPreference: "low-power",  // Prefer battery-friendly GPU
    });

    // Cap pixel ratio for performance
    renderer.setPixelRatio(
      Math.min(window.devicePixelRatio, isMobile ? 1.0 : 1.5)
    );
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // ── Shader Uniforms ──
    const uniforms = {
      u_time:       { value: 0 },
      u_resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
      u_mouse:      { value: new THREE.Vector2(0, 0) },
      u_intensity:  { value: config.intensity },
    };

    // ── Build Shader Material ──
    const octaves = isMobile ? config.mobileOctaves : config.octaves;
    const fragmentShader = createFragmentShader(config, octaves);

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });

    scene.add(new THREE.Mesh(geometry, material));

    // ══════════════════════════════════
    //  MOUSE INTERACTION (interactive variant only)
    //  Uses GSAP for silky-smooth interpolation
    // ══════════════════════════════════
    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    const handleMouseMove = (e) => {
      // Normalize to -0.5 to 0.5 range (centered)
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = -((e.clientY / window.innerHeight) - 0.5);

      // GSAP smooths the mouse position over 2 seconds
      // This prevents jittery, jarring fog movement
      gsap.to(smoothMouse, {
        x: mouse.x,
        y: mouse.y,
        duration: 2.0,
        ease: "power2.out",
        overwrite: true,
      });
    };

    // Only attach mouse listener for interactive variant on desktop
    if (config.enableMouse && !isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // ══════════════════════════════════
    //  SCROLL ANIMATION (artistic variant only)
    //  GSAP ScrollTrigger smoothly drives fog intensity
    //  from base value to 1.8× as user scrolls
    // ══════════════════════════════════
    let scrollTriggerInstance = null;

    if (config.enableScroll) {
      scrollTriggerInstance = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,   // 1.5s smooth scrub (no jumps)
        onUpdate: (self) => {
          // Smoothly interpolate intensity based on scroll progress
          // Goes from base intensity at top to 1.8× at bottom
          uniforms.u_intensity.value = config.intensity * (1.0 + self.progress * 0.8);
        },
      });
    }

    // ══════════════════════════════════
    //  TAB VISIBILITY
    //  Pause rendering when tab is hidden to save GPU
    // ══════════════════════════════════
    const handleVisibility = () => {
      isVisible = !document.hidden;
    };
    document.addEventListener("visibilitychange", handleVisibility);

    // ══════════════════════════════════
    //  RESPONSIVE RESIZE (debounced)
    // ══════════════════════════════════
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        const w = window.innerWidth;
        const h = window.innerHeight;
        renderer.setSize(w, h);
        uniforms.u_resolution.value.set(w, h);
      }, 100);
    };
    window.addEventListener("resize", handleResize);

    // ══════════════════════════════════
    //  ANIMATION LOOP
    // ══════════════════════════════════
    const timeStep = isMobile ? 0.25 : 0.4;

    const animate = () => {
      if (!uniforms || !uniforms.u_time) return;
      animationId = requestAnimationFrame(animate);

      // Skip rendering when tab is hidden
      if (!isVisible) return;

      // Advance time
      uniforms.u_time.value += timeStep;

      // Update mouse uniform (smoothed by GSAP)
      uniforms.u_mouse.value.set(smoothMouse.x, smoothMouse.y);

      renderer.render(scene, camera);
    };
    animate();

    // ══════════════════════════════════
    //  CLEANUP — Dispose ALL WebGL resources
    //  Prevents memory leaks on unmount
    // ══════════════════════════════════
    return () => {
      cancelAnimationFrame(animationId);
      clearTimeout(resizeTimeout);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);

      if (scrollTriggerInstance) {
        scrollTriggerInstance.kill();
      }

      // Safe cleanup of Three.js resources
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) {
        renderer.dispose();
        // Use native remove() which is safer than parent.removeChild in React
        if (renderer.domElement && renderer.domElement.parentNode) {
          renderer.domElement.remove();
        }
      }
    };
  }, [variant]);

  // ══════════════════════════════════
  //  RENDER — Fixed fullscreen container
  // ══════════════════════════════════
  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,              // Behind ALL page content
        background: "#000000",   // Deep black base
        pointerEvents: "none",   // Never blocks UI interaction
      }}
    />
  );
};

export default SmokeBackground;
