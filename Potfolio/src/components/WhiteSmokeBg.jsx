/**
 * WhiteSmokeBg — Subtle white smoke background for Page3
 * 
 * 95% white / 5% black ratio. Very minimal, elegant, soft.
 * Mouse-interactive. Renders behind all content (z-index: 0).
 * pointer-events: none — does NOT block clicks or scroll.
 */

import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";

const WhiteSmokeBg = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let animationId;
    const isMobile = window.innerWidth < 768;

    // ─── Scene ───
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // ─── Renderer ───
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: false,
      powerPreference: "low-power",
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1 : 1.5));
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // ─── Mouse ───
    const mouse = { x: 0, y: 0 };
    const smoothMouse = { x: 0, y: 0 };

    // ─── Uniforms ───
    const uniforms = {
      u_time: { value: 0 },
      u_mouse: { value: new THREE.Vector2(0, 0) },
      u_resolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
    };

    // ─── Vertex Shader ───
    const vertexShader = `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = vec4(position, 1.0);
      }
    `;

    // ─── Fragment Shader — 95% White / 5% Black ───
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
        vec2 st = vec2(uv.x * aspect, uv.y) * 1.5;

        float t = u_time * 0.025;

        // Gentle mouse influence
        st += u_mouse * 0.12;

        // Domain warping for organic flow
        vec2 q = vec2(
          fbm(st + t * 0.3),
          fbm(st + vec2(5.2, 1.3) + t * 0.25)
        );

        vec2 r = vec2(
          fbm(st + 3.0 * q + vec2(1.7, 9.2) + t * 0.15),
          fbm(st + 3.0 * q + vec2(8.3, 2.8) + t * 0.2)
        );

        float f = fbm(st + 3.0 * r);
        float smoke = smoothstep(0.15, 0.85, f);

        // Full coverage — no vignette fade, smoke fills entire page

        // 90% deep black, 10% white — sparse but visible wisps
        float whiteWisp = fbm(st * 2.5 + t * 0.6 + 7.3);
        whiteWisp = smoothstep(0.50, 0.75, whiteWisp);  // tight = rare white patches

        vec3 deepBlack = vec3(0.02, 0.02, 0.025);       // dominant black base
        vec3 pureWhite = vec3(1.0, 1.0, 1.0);            // clean white accent

        // 10% blend: mostly black, white only where wisp threshold triggers
        vec3 color = mix(deepBlack, pureWhite, whiteWisp * 0.40);

        // Professional opacity — present but refined
        float alpha = smoke * 0.45;

        gl_FragColor = vec4(color, alpha);
      }
    `;

    // ─── Mesh ───
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

    // ─── Mouse Handler ───
    const handleMouseMove = (e) => {
      mouse.x = (e.clientX / window.innerWidth) - 0.5;
      mouse.y = -((e.clientY / window.innerHeight) - 0.5);

      gsap.to(smoothMouse, {
        x: mouse.x,
        y: mouse.y,
        duration: 2.5,
        ease: "power2.out",
        overwrite: true,
      });
    };

    if (!isMobile) {
      window.addEventListener("mousemove", handleMouseMove);
    }

    // ─── Resize ───
    const handleResize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      uniforms.u_resolution.value.set(w, h);
    };
    window.addEventListener("resize", handleResize);

    // ─── Animation Loop ───
    const timeStep = isMobile ? 0.005 : 0.007;

    const animate = () => {
      if (!uniforms || !uniforms.u_time) return;
      animationId = requestAnimationFrame(animate);
      uniforms.u_time.value += timeStep;
      uniforms.u_mouse.value.set(smoothMouse.x, smoothMouse.y);
      renderer.render(scene, camera);
    };
    animate();

    // ─── Cleanup ───
    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
      if (geometry) geometry.dispose();
      if (material) material.dispose();
      if (renderer) {
        renderer.dispose();
        if (container && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
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

export default WhiteSmokeBg;
