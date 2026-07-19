/**
 * Page2Smoke — 90% white / 10% black smoke for Page2 background
 * Same fBm shader technique, tuned for white-dominant smoke.
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const Page2Smoke = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationId;
    let isVisible = true;
    const isMobile = window.innerWidth < 768;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    // Use parent section's full scrollable height so smoke covers entire Page2
    const parentEl = container.parentElement;
    const cw = parentEl ? parentEl.scrollWidth : window.innerWidth;
    const ch = parentEl ? parentEl.scrollHeight : window.innerHeight;

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(cw, ch);
    container.appendChild(renderer.domElement);

    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    const uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_resolution: {
        value: new THREE.Vector2(cw, ch),
      },
    };

    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    const fragmentShader = `
      precision mediump float;

      uniform float u_time;
      uniform vec2 u_mouse;
      uniform vec2 u_resolution;
      varying vec2 vUv;

      float hash(vec2 p) {
        p = fract(p * vec2(443.8975, 397.2973));
        p += dot(p, p.xy + 19.19);
        return fract(p.x * p.y);
      }

      float noise(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        float a = hash(i);
        float b = hash(i + vec2(1.0, 0.0));
        float c = hash(i + vec2(0.0, 1.0));
        float d = hash(i + vec2(1.0, 1.0));
        return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
      }

      float fbm(vec2 p) {
        float value = 0.0;
        float amplitude = 0.5;
        float frequency = 1.0;
        for (int i = 0; i < 4; i++) {
          value += amplitude * noise(p * frequency);
          frequency *= 2.0;
          amplitude *= 0.5;
        }
        return value;
      }

      void main() {
        vec2 uv = vUv;
        float aspect = u_resolution.x / u_resolution.y;
        vec2 st = vec2(uv.x * aspect, uv.y) * 1.8;

        float t = u_time * 0.03;
        st += u_mouse * 0.15;

        // Domain warping
        vec2 q = vec2(
          fbm(st + t * 0.4),
          fbm(st + vec2(5.2, 1.3) + t * 0.3)
        );
        vec2 r = vec2(
          fbm(st + 4.0 * q + vec2(1.7, 9.2) + t * 0.2),
          fbm(st + 4.0 * q + vec2(8.3, 2.8) + t * 0.25)
        );
        float f = fbm(st + 4.0 * r);
        float smoke = smoothstep(0.1, 0.9, f);

        // 90% white / 10% black — on white bg, the dark wisps are what you see
        float darkWisp = fbm(st * 2.5 + t * 0.6 + 3.7);
        darkWisp = smoothstep(0.3, 0.65, darkWisp);     // wider = more visible

        vec3 smokeWhite = vec3(0.88, 0.88, 0.90);        // near-white (blends into bg)
        vec3 smokeBlack = vec3(0.15, 0.15, 0.18);         // dark gray wisps

        // Dark wisps at full blend where they appear, white elsewhere
        vec3 color = mix(smokeWhite, smokeBlack, darkWisp * 0.90);

        float alpha = smoke * 0.30;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    const geometry = new THREE.PlaneGeometry(2, 2);
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
      depthTest: false,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = -((e.clientY / window.innerHeight) - 0.5);
      gsap.to(smoothMouse, {
        x: mouse.x,
        y: mouse.y,
        duration: 2.0,
        ease: "power2.out",
        overwrite: true,
      });
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    const handleVisibility = () => { isVisible = !document.hidden; };
    document.addEventListener("visibilitychange", handleVisibility);

    const handleResize = () => {
      const pw = parentEl ? parentEl.scrollWidth : window.innerWidth;
      const ph = parentEl ? parentEl.scrollHeight : window.innerHeight;
      renderer.setSize(pw, ph);
      uniforms.u_resolution.value.set(pw, ph);
    };
    window.addEventListener("resize", handleResize);

    const timeStep = isMobile ? 0.005 : 0.008;
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

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("visibilitychange", handleVisibility);
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
  }, []);

  return (
    <div
      ref={mountRef}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 1,
      }}
    />
  );
};

export default Page2Smoke;
